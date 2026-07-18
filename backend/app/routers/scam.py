from fastapi import APIRouter, Depends

from app.core.errors import ResourceNotFoundException
from app.core.responses import (
    paginated_response,
    success_response,
)
from app.dependencies import get_scam_service
from app.schemas.common import (
    PaginatedResponse,
    SuccessResponse,
)
from app.schemas.model_info import ModelInfoResponse
from app.schemas.scam import (
    ScamPredictRequest,
    ScamResponse,
)
from app.services.scam_service import ScamService

router = APIRouter(
    prefix="/scam",
    tags=["Scam Detection"],
)


@router.post(
    "/predict",
    response_model=SuccessResponse[ScamResponse],
)
def predict(
    request: ScamPredictRequest,
    service: ScamService = Depends(get_scam_service),
):
    report = service.predict(request)

    return success_response(
        "Prediction completed.",
        ScamResponse.model_validate(report),
    )


@router.get(
    "",
    response_model=PaginatedResponse[ScamResponse],
)
def list_reports(
    skip: int = 0,
    limit: int = 100,
    service: ScamService = Depends(get_scam_service),
):
    reports = service.list_reports(skip, limit)

    total = service.count_reports()

    return paginated_response(
        message="Reports fetched.",
        data=[ScamResponse.model_validate(report) for report in reports],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{report_id}",
    response_model=SuccessResponse[ScamResponse],
)
def get_report(
    report_id: str,
    service: ScamService = Depends(get_scam_service),
):
    report = service.get_report(report_id)

    if report is None:
        raise ResourceNotFoundException("Scam report not found.")

    return success_response(
        "Report fetched.",
        ScamResponse.model_validate(report),
    )


@router.delete("/{report_id}")
def delete_report(
    report_id: str,
    service: ScamService = Depends(get_scam_service),
):
    deleted = service.delete_report(report_id)

    if not deleted:
        raise ResourceNotFoundException("Scam report not found.")

    return success_response("Report deleted successfully.")


@router.get(
    "/model/info",
    response_model=SuccessResponse[ModelInfoResponse],
)
def model_info(
    service: ScamService = Depends(get_scam_service),
):
    info = service.get_model_info()

    return success_response(
        "Model information fetched.",
        ModelInfoResponse(**info),
    )
