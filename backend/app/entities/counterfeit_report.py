from sqlalchemy import Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.entities.base_entity import BaseEntity


class CounterfeitReport(BaseEntity):
    """
    Stores the result of a counterfeit currency prediction.
    """

    __tablename__ = "counterfeit_reports"

    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    prediction: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    confidence: Mapped[float] = mapped_column(
        Float,
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

    image_path: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
