from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CounterfeitCreateRequest(BaseModel):
    filename: str = Field(..., max_length=255)
    image_path: str
    prediction: str
    confidence: float = Field(..., ge=0, le=1)
    model_version: str
    processing_time_ms: int = Field(..., ge=0)


class CounterfeitResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    filename: str
    image_path: str
    prediction: str
    confidence: float
    model_version: str
    processing_time_ms: int
    created_at: datetime
    updated_at: datetime
