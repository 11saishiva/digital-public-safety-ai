from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.entities.scam_report import ScamReport
from app.repositories.base_repository import BaseRepository


class ScamRepository(BaseRepository[ScamReport]):
    def __init__(self, db: Session):
        super().__init__(db, ScamReport)

    def get_by_prediction(
        self,
        prediction: str,
        skip: int = 0,
        limit: int = 100,
    ) -> list[ScamReport]:
        stmt = (
            select(ScamReport)
            .where(ScamReport.prediction == prediction)
            .offset(skip)
            .limit(limit)
        )
        return list(self.db.execute(stmt).scalars().all())

    def get_by_risk_level(
        self,
        risk_level: str,
    ) -> list[ScamReport]:
        stmt = select(ScamReport).where(ScamReport.risk_level == risk_level)
        return list(self.db.execute(stmt).scalars().all())

    def get_latest(
        self,
        limit: int = 10,
    ) -> list[ScamReport]:
        stmt = select(ScamReport).order_by(desc(ScamReport.created_at)).limit(limit)
        return list(self.db.execute(stmt).scalars().all())
