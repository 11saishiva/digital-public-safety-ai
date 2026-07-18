from pydantic import BaseModel


class ModelInfoResponse(BaseModel):
    model: str
    architecture: str
    framework: str
    version: str
    accuracy: float
    loaded: bool
