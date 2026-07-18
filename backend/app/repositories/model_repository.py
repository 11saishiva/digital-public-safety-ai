from sqlalchemy import select
from sqlalchemy.orm import Session

from app.entities.model_registry import ModelRegistry
from app.repositories.base_repository import BaseRepository


class ModelRepository(BaseRepository[ModelRegistry]):
    def __init__(self, db: Session):
        super().__init__(db, ModelRegistry)

    def get_by_module(
        self,
        module_name: str,
    ) -> list[ModelRegistry]:
        stmt = select(ModelRegistry).where(ModelRegistry.module_name == module_name)
        return list(self.db.execute(stmt).scalars().all())

    def get_by_version(
        self,
        version: str,
    ) -> ModelRegistry | None:
        stmt = select(ModelRegistry).where(ModelRegistry.version == version)
        return self.db.execute(stmt).scalar_one_or_none()
