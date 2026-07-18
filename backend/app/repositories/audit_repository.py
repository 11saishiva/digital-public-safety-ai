from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.entities.audit_log import AuditLog
from app.repositories.base_repository import BaseRepository


class AuditRepository(BaseRepository[AuditLog]):
    def __init__(self, db: Session):
        super().__init__(db, AuditLog)

    def latest(
        self,
        limit: int = 100,
    ) -> list[AuditLog]:
        stmt = select(AuditLog).order_by(desc(AuditLog.created_at)).limit(limit)
        return list(self.db.execute(stmt).scalars().all())
