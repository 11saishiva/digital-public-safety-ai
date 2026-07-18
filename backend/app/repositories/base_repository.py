from __future__ import annotations

from typing import Generic, TypeVar

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.entities.base_entity import BaseEntity

T = TypeVar("T", bound=BaseEntity)


class BaseRepository(Generic[T]):
    """
    Generic repository implementing common CRUD operations.
    """

    def __init__(self, db: Session, entity: type[T]) -> None:
        self.db = db
        self.entity = entity

    def create(self, obj: T) -> T:
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def get_by_id(self, entity_id: str) -> T | None:
        stmt = select(self.entity).where(self.entity.id == entity_id)
        return self.db.execute(stmt).scalar_one_or_none()

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> list[T]:
        stmt = select(self.entity).offset(skip).limit(limit)

        return list(self.db.execute(stmt).scalars().all())

    def update(self, obj: T) -> T:
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def delete(self, obj: T) -> None:
        self.db.delete(obj)
        self.db.commit()

    def exists(self, entity_id: str) -> bool:
        return self.get_by_id(entity_id) is not None

    def count(self) -> int:
        stmt = select(func.count()).select_from(self.entity)
        return self.db.execute(stmt).scalar_one()
