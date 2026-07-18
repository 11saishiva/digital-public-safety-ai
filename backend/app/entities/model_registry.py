from sqlalchemy import Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.entities.base_entity import BaseEntity


class ModelRegistry(BaseEntity):
    __tablename__ = "model_registry"

    module_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    model_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    version: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    accuracy: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    model_path: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
