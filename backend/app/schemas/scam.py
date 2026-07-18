from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ScamPredictRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="Message to analyze",
    )


class ScamResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    message: str
    prediction: str
    confidence: float
    risk_level: str
    detected_patterns: str
    model_version: str
    processing_time_ms: int
    created_at: datetime


class ScamModelInfoResponse(BaseModel):
    model: str
    architecture: str
    framework: str
    version: str
    accuracy: float
    loaded: bool
