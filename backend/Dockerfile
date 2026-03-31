# Use the official Python image
FROM python:3.10-slim

# Set working directory to /app
WORKDIR /app

# Install system dependencies (build-essential for some python packages like chromadb)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file first to take advantage of Docker caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend content (except what is in .dockerignore)
COPY . .

# Set environment variables (can be overridden by Cloud Run)
ENV PORT=8000
ENV HOST=0.0.0.0

# Expose the API port
EXPOSE 8000

# Start the uvicorn server
# --host 0.0.0.0 is mandatory for Cloud Run
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
