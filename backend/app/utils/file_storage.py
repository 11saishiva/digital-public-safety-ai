from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.errors import BadRequestException
from app.core.paths import UPLOAD_DIR

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/jpg",
}

MAX_FILE_SIZE = 5 * 1024 * 1024


class FileStorage:
    @staticmethod
    async def save_image(
        file: UploadFile,
    ) -> str:
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise BadRequestException("Only JPG and PNG images are supported.")

        content = await file.read()

        if len(content) > MAX_FILE_SIZE:
            raise BadRequestException("Maximum file size is 5 MB.")

        extension = Path(file.filename).suffix.lower()

        filename = f"{uuid4()}{extension}"

        upload_dir = UPLOAD_DIR / "counterfeit"

        upload_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        destination = upload_dir / filename

        with open(destination, "wb") as f:
            f.write(content)

        await file.seek(0)

        return str(destination)
