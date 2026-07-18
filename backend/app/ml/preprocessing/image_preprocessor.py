from PIL import Image
from torchvision import transforms


class ImagePreprocessor:
    def __init__(self, metadata: dict):
        normalization = metadata["normalization"]

        self.transform = transforms.Compose(
            [
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=normalization["mean"],
                    std=normalization["std"],
                ),
            ]
        )

    def preprocess(self, image_path: str):
        image = Image.open(image_path).convert("RGB")
        tensor = self.transform(image)
        return tensor.unsqueeze(0)
