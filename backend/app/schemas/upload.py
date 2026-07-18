from pydantic import BaseModel


class UploadedFileInfo(BaseModel):
    original_filename: str
    stored_filename: str
    file_path: str
    content_type: str
    size: int
