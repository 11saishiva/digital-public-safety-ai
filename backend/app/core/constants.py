from enum import Enum


class HealthStatus(str, Enum):
    HEALTHY = "healthy"
    UNHEALTHY = "unhealthy"


class ModelType(str, Enum):
    COUNTERFEIT = "counterfeit"
    SCAM = "scam"
    GRAPH = "graph"
