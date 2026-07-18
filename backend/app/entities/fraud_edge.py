from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.entities.base_entity import BaseEntity


class FraudEdge(BaseEntity):
    __tablename__ = "fraud_edges"

    source_node_id: Mapped[str] = mapped_column(
        ForeignKey("fraud_nodes.id"),
        nullable=False,
    )

    target_node_id: Mapped[str] = mapped_column(
        ForeignKey("fraud_nodes.id"),
        nullable=False,
    )

    relationship_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    weight: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=1.0,
    )
