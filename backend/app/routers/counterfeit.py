from fastapi import APIRouter, Depends, File, UploadFile

from app.core.errors import ResourceNotFoundException
from app.core.responses import (
    paginated_response,
    success_response,
)
from app.dependencies import get_counterfeit_service
from app.ml.registry import registry
from app.schemas.common import (
    PaginatedResponse,
    SuccessResponse,
)
from app.schemas.counterfeit import (
    CounterfeitCreateRequest,
    CounterfeitResponse,
)
from app.schemas.model_info import ModelInfoResponse
from app.services.counterfeit_service import CounterfeitService

router = APIRouter(
    prefix="/counterfeit",
    tags=["Counterfeit"],
)


@router.post(
    "",
    response_model=SuccessResponse[CounterfeitResponse],
)
def create_report(
    request: CounterfeitCreateRequest,
    service: CounterfeitService = Depends(get_counterfeit_service),
):
    report = service.create_report(request)

    return success_response(
        "Report created.",
        CounterfeitResponse.model_validate(report),
    )


@router.get(
    "",
    response_model=PaginatedResponse[CounterfeitResponse],
)
def list_reports(
    skip: int = 0,
    limit: int = 100,
    service: CounterfeitService = Depends(get_counterfeit_service),
):
    reports = service.list_reports(skip, limit)

    total = service.count_reports()

    return paginated_response(
        message="Reports fetched.",
        data=[CounterfeitResponse.model_validate(report) for report in reports],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{report_id}",
    response_model=SuccessResponse[CounterfeitResponse],
)
def get_report(
    report_id: str,
    service: CounterfeitService = Depends(get_counterfeit_service),
):
    report = service.get_report(report_id)

    if report is None:
        raise ResourceNotFoundException("Counterfeit report not found.")

    return success_response(
        "Report fetched.",
        CounterfeitResponse.model_validate(report),
    )


@router.delete("/{report_id}")
def delete_report(
    report_id: str,
    service: CounterfeitService = Depends(get_counterfeit_service),
):
    deleted = service.delete_report(report_id)

    if not deleted:
        raise ResourceNotFoundException("Counterfeit report not found.")

    return success_response("Report deleted successfully.")


@router.post(
    "/predict",
    response_model=SuccessResponse[CounterfeitResponse],
)
async def predict(
    file: UploadFile = File(...),
    service: CounterfeitService = Depends(get_counterfeit_service),
):
    report = await service.predict(file)

    return success_response(
        "Prediction completed.",
        report,
    )


@router.get(
    "/model/info",
    response_model=SuccessResponse[ModelInfoResponse],
)
def model_info():
    info = registry.counterfeit.get_model_info()

    return success_response(
        "Model information fetched.",
        ModelInfoResponse(**info),
    )
