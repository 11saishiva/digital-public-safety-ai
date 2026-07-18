from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.counterfeit_repository import CounterfeitRepository
from app.repositories.scam_repository import ScamRepository
from app.services.counterfeit_service import CounterfeitService
from app.services.scam_service import ScamService


def get_counterfeit_repository(
    db: Session = Depends(get_db),
) -> CounterfeitRepository:
    return CounterfeitRepository(db)


def get_counterfeit_service(
    repository: CounterfeitRepository = Depends(get_counterfeit_repository),
) -> CounterfeitService:
    return CounterfeitService(repository)


def get_scam_repository(
    db: Session = Depends(get_db),
) -> ScamRepository:
    return ScamRepository(db)


def get_scam_service(
    repository: ScamRepository = Depends(get_scam_repository),
) -> ScamService:
    return ScamService(repository)
