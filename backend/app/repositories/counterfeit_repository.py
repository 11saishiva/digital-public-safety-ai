from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.entities.counterfeit_report import CounterfeitReport
from app.repositories.base_repository import BaseRepository


class CounterfeitRepository(BaseRepository[CounterfeitReport]):
    def __init__(self, db: Session):
        super().__init__(db, CounterfeitReport)

    def get_by_prediction(
        self,
        prediction: str,
        skip: int = 0,
        limit: int = 100,
    ) -> list[CounterfeitReport]:
        stmt = (
            select(CounterfeitReport)
            .where(CounterfeitReport.prediction == prediction)
            .offset(skip)
            .limit(limit)
        )

        return list(self.db.execute(stmt).scalars().all())

    def get_high_confidence(
        self,
        threshold: float = 0.9,
    ) -> list[CounterfeitReport]:
        stmt = select(CounterfeitReport).where(
            CounterfeitReport.confidence >= threshold
        )

        return list(self.db.execute(stmt).scalars().all())

    def get_latest(
        self,
        limit: int = 10,
    ) -> list[CounterfeitReport]:
        stmt = (
            select(CounterfeitReport)
            .order_by(desc(CounterfeitReport.created_at))
            .limit(limit)
        )

        return list(self.db.execute(stmt).scalars().all())

    def get_by_model_version(
        self,
        version: str,
    ) -> list[CounterfeitReport]:
        stmt = select(CounterfeitReport).where(
            CounterfeitReport.model_version == version
        )

        return list(self.db.execute(stmt).scalars().all())

    def delete(self, report: CounterfeitReport) -> None:
        self.db.delete(report)
        self.db.commit()
