import time
from pathlib import Path

from fastapi import UploadFile

from app.entities.counterfeit_report import CounterfeitReport
from app.ml.registry import registry
from app.repositories.counterfeit_repository import CounterfeitRepository
from app.schemas.counterfeit import CounterfeitCreateRequest, CounterfeitResponse
from app.utils.file_storage import FileStorage


class CounterfeitService:
    def __init__(self, repository: CounterfeitRepository):
        self.repository = repository
        self.model = registry.counterfeit

    def create_report(
        self,
        request: CounterfeitCreateRequest,
    ) -> CounterfeitReport:
        report = CounterfeitReport(
            filename=request.filename,
            image_path=request.image_path,
            prediction=request.prediction,
            confidence=request.confidence,
            model_version=request.model_version,
            processing_time_ms=request.processing_time_ms,
        )

        return self.repository.create(report)

    def get_report(
        self,
        report_id: str,
    ) -> CounterfeitReport | None:
        return self.repository.get_by_id(report_id)

    def list_reports(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> list[CounterfeitReport]:
        return self.repository.get_all(skip, limit)

    def latest_reports(
        self,
        limit: int = 10,
    ) -> list[CounterfeitReport]:
        return self.repository.get_latest(limit)

    def high_confidence_reports(
        self,
        threshold: float = 0.9,
    ) -> list[CounterfeitReport]:
        return self.repository.get_high_confidence(threshold)

    def count_reports(self) -> int:
        return self.repository.count()

    def delete_report(
        self,
        report_id: str,
    ) -> bool:
        report = self.repository.get_by_id(report_id)

        if report is None:
            return False

        image_path = Path(report.image_path)

        if image_path.exists():
            image_path.unlink()

        self.repository.delete(report)

        return True

    async def predict(
        self,
        file: UploadFile,
    ) -> CounterfeitResponse:
        start = time.perf_counter()

        image_path = await FileStorage.save_image(file)

        prediction, confidence = self.model.predict(image_path)

        elapsed = int((time.perf_counter() - start) * 1000)

        report = CounterfeitReport(
            filename=file.filename,
            image_path=image_path,
            prediction=prediction,
            confidence=confidence,
            model_version="mobilenet-placeholder-v1",
            processing_time_ms=elapsed,
        )

        report = self.repository.create(report)

        return CounterfeitResponse.model_validate(report)
