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
async def list_sources(parent_id: Optional[str] = None):
    """Lists available files from the cloud bucket/storage."""
    return await source_manager.list_available_files(parent_id)

@router.get("/sources/status")
async def get_sources_status():
    """Returns storage metrics of the vector database."""
    return await source_manager.get_metrics()

@router.get("/sources/search")
async def search_sources(query: str):
    """Searches for files by name globally."""
    return await source_manager.global_search(query)

@router.post("/sources/sync")
async def sync_sources(data: SyncRequest):
    """Triggers indexing / embedding generation for selected files."""
    try:
        results = await source_manager.sync_files(data.project_id, data.files)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sources/upload")
async def upload_source(file: UploadFile = File(...)):
    """Uploads a local file to the server storage."""
    return await source_manager.handle_upload(file)

@router.delete("/sources/purge")
async def purge_sources(file_id: str):
    """Removes a document from the vector database."""
    return await source_manager.purge_file(file_id)

@router.post("/chat/query")
async def chat_query(data: ChatQuery):
    """Sends a query to the RAG engine."""
    results = await chat_engine.generate_response(data.query, data.project_id, data.history_id)
    return results

@router.get("/chat/sessions")
async def list_sessions(project_id: str):
    """Lists recent chat sessions for a project."""
    return await chat_engine.list_sessions(project_id)

@router.get("/chat/history/{session_id}")
async def chat_history(session_id: str):
    """Retrieves chat history for a given session."""
    return await chat_engine.get_history(session_id)
