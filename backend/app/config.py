from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    openai_api_key: str
    anthropic_api_key: Optional[str] = None
    upload_dir: str = "./uploads"
    vector_store_dir: str = "./vector_store"
    max_file_size: int = 50000000
    embedding_model: str = "text-embedding-3-small"
    llm_model: str = "gpt-4-turbo-preview"
    chunk_size: int = 1000
    chunk_overlap: int = 200
    
    class Config:
        env_file = ".env"

settings = Settings()