import json
import re
import time

from app.entities.scam_report import ScamReport
from app.ml.registry import registry
from app.repositories.scam_repository import ScamRepository
from app.schemas.scam import ScamPredictRequest


class ScamService:
    def __init__(
        self,
        repository: ScamRepository,
    ):
        self.repository = repository

    def predict(
        self,
        request: ScamPredictRequest,
    ) -> ScamReport:
        start = time.perf_counter()

        prediction, confidence = registry.scam.predict(request.message)

        processing_time_ms = int((time.perf_counter() - start) * 1000)

        risk_level = self._calculate_risk_level(
            prediction,
            confidence,
        )

        patterns = self._extract_patterns(request.message)

        report = ScamReport(
            message=request.message,
            prediction=prediction,
            confidence=confidence,
            risk_level=risk_level,
            detected_patterns=json.dumps(patterns),
            model_version=registry.scam.metadata["version"],
            processing_time_ms=processing_time_ms,
        )

        return self.repository.create(report)

    def get_model_info(self):
        return registry.scam.get_model_info()

    def _calculate_risk_level(
        self,
        prediction: str,
        confidence: float,
    ) -> str:
        if prediction == "SAFE":
            return "LOW"

        if confidence >= 0.90:
            return "HIGH"

        if confidence >= 0.70:
            return "MEDIUM"

        return "LOW"

    def _extract_patterns(
        self,
        text: str,
    ) -> list[str]:
        patterns = []

        rules = {
            "OTP Request": r"\botp\b",
            "Urgency": r"\burgent\b|\bimmediately\b|\bnow\b",
            "Prize Claim": r"\bwon\b|\bprize\b|\breward\b",
            "Financial": r"\bbank\b|\bupi\b|\baccount\b",
            "Link": r"http[s]?://|www\.",
            "Verification": r"\bverify\b|\bconfirm\b",
        }

        lower = text.lower()

        for name, pattern in rules.items():
            if re.search(pattern, lower):
                patterns.append(name)

        return patterns

    def list_reports(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> list[ScamReport]:
        return self.repository.get_all(
            skip=skip,
            limit=limit,
        )

    def count_reports(self) -> int:
        return self.repository.count()

    def get_report(
        self,
        report_id: str,
    ) -> ScamReport | None:
        return self.repository.get_by_id(report_id)

    def delete_report(
        self,
        report_id: str,
    ) -> bool:
        report = self.repository.get_by_id(report_id)

        if report is None:
            return False

        self.repository.delete(report)

        return True
