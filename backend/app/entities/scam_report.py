from sqlalchemy import Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.entities.base_entity import BaseEntity


class ScamReport(BaseEntity):
    __tablename__ = "scam_reports"

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    prediction: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        index=True,
    )

    confidence: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    risk_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    detected_patterns: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    model_version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    processing_time_ms: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
