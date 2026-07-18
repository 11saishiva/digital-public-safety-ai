from sqlalchemy import Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.entities.base_entity import BaseEntity


class FraudNode(BaseEntity):
    __tablename__ = "fraud_nodes"

    identifier: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
    )

    identifier_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    risk_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )
