import json

import torch
import torch.nn.functional as F

from app.core.paths import MODEL_DIR
from app.ml.models.currency_classifier import CurrencyClassifier
from app.ml.preprocessing.image_preprocessor import ImagePreprocessor


class CounterfeitLoader:
    """
    Loads the trained Counterfeit Currency Detection model
    and performs inference.
    """

    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        self.model = None
        self.labels = None
        self.metadata = None
        self.preprocessor = None

        self.load()

    def load(self):
        """
        Load metadata, labels, model architecture,
        trained weights and preprocessing pipeline.
        """

        model_root = MODEL_DIR / "counterfeit" / "v1"

        # -------------------------
        # Load Labels
        # -------------------------

        with open(
            model_root / "labels.json",
        ) as f:
            self.labels = json.load(f)

        # -------------------------
        # Load Metadata
        # -------------------------

        with open(
            model_root / "model_metadata.json",
        ) as f:
            self.metadata = json.load(f)

        # -------------------------
        # Image Preprocessor
        # -------------------------

        self.preprocessor = ImagePreprocessor(self.metadata)

        # -------------------------
        # Create Model
        # -------------------------

        self.model = CurrencyClassifier()

        # -------------------------
        # Load Weights
        # -------------------------

        state_dict = torch.load(
            model_root / "best_model.pth",
            map_location=self.device,
        )

        self.model.load_state_dict(state_dict)

        self.model.to(self.device)

        self.model.eval()

    def predict(
        self,
        image_path: str,
    ) -> tuple[str, float]:
        """
        Predict whether a currency note is
        REAL or FAKE.

        Returns:
            (prediction, confidence)
        """

        image = self.preprocessor.preprocess(image_path)

        image = image.to(self.device)

        with torch.inference_mode():
            output = self.model(image)

            probabilities = F.softmax(
                output,
                dim=1,
            )

            confidence, predicted = torch.max(
                probabilities,
                dim=1,
            )

        prediction = self.labels[str(predicted.item())]

        confidence = float(confidence.item())

        return (
            prediction,
            confidence,
        )

    def get_model_info(self) -> dict:
        return {
            "model": self.metadata["model_name"],
            "architecture": self.metadata["architecture"],
            "framework": self.metadata["framework"],
            "version": self.metadata["version"],
            "accuracy": self.metadata["test_metrics"]["accuracy"],
            "loaded": self.model is not None,
        }
