from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from app.services import source_manager, chat_engine

router = APIRouter()

class ChatQuery(BaseModel):
    query: str
    project_id: str
    history_id: Optional[str] = None

class SyncRequest(BaseModel):
    project_id: str
    files: List[str]

@router.get("/sources/list")
def list_sources(parent_id: Optional[str] = None):
    """Lists available files from the cloud bucket/storage."""
    return source_manager.list_available_files(parent_id)

@router.get("/sources/status")
def get_sources_status():
    """Returns storage metrics of the vector database."""
    return source_manager.get_metrics()

@router.get("/sources/search")
def search_sources(query: str):
    """Searches for files by name globally."""
    return source_manager.global_search(query)

@router.post("/sources/sync")
def sync_sources(data: SyncRequest):
    """Triggers indexing / embedding generation for selected files."""
    try:
        results = source_manager.sync_files(data.project_id, data.files)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sources/upload")
def upload_source(file: UploadFile = File(...)):
    """Uploads a local file to the server storage."""
    return source_manager.handle_upload(file)

@router.delete("/sources/purge")
def purge_sources(file_id: str):
    """Removes a document from the vector database."""
    return source_manager.purge_file(file_id)

@router.post("/chat/query")
def chat_query(data: ChatQuery):
    """Sends a query to the RAG engine."""
    results = chat_engine.generate_response(data.query, data.project_id, data.history_id)
    return results

@router.get("/chat/sessions")
def list_sessions(project_id: str):
    """Lists recent chat sessions for a project."""
    return chat_engine.list_sessions(project_id)

@router.get("/chat/history/{session_id}")
def chat_history(session_id: str):
    """Retrieves chat history for a given session."""
    return chat_engine.get_history(session_id)
