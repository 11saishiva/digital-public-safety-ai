from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.entities.base_entity import BaseEntity


class FraudCluster(BaseEntity):
    __tablename__ = "fraud_clusters"

    cluster_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    risk_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    node_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )
