import os
import uuid
from pathlib import Path
from typing import Tuple
import aiofiles

async def save_upload_file(file, upload_dir: str) -> Tuple[str, str]:
    """Save uploaded file and return doc_id and filepath"""
    doc_id = str(uuid.uuid4())
    file_extension = Path(file.filename).suffix
    filename = f"{doc_id}{file_extension}"
    filepath = os.path.join(upload_dir, filename)
    
    os.makedirs(upload_dir, exist_ok=True)
    
    async with aiofiles.open(filepath, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    return doc_id, filepath

def get_file_type(filename: str) -> str:
    """Determine file type from extension"""
    extension = Path(filename).suffix.lower()
    type_mapping = {
        '.pdf': 'PDF',
        '.docx': 'DOCX',
        '.doc': 'DOC',
        '.txt': 'TXT'
    }
    return type_mapping.get(extension, 'UNKNOWN')