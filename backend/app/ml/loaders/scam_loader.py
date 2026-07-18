import json

import torch
import torch.nn.functional as F
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
)

from app.core.paths import MODEL_DIR


class ScamLoader:
    """
    Loads the trained Scam Detection model
    and performs inference.
    """

    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        self.model = None
        self.tokenizer = None
        self.labels = None
        self.metadata = None

        self.load()

    def load(self):
        model_root = MODEL_DIR / "scam" / "v1"

        # -------------------------
        # Labels
        # -------------------------

        with open(
            model_root / "labels.json",
        ) as f:
            self.labels = json.load(f)

        # -------------------------
        # Metadata
        # -------------------------

        with open(
            model_root / "model_metadata.json",
        ) as f:
            self.metadata = json.load(f)

        # -------------------------
        # Tokenizer
        # -------------------------

        self.tokenizer = AutoTokenizer.from_pretrained(model_root)

        # -------------------------
        # Model
        # -------------------------

        self.model = AutoModelForSequenceClassification.from_pretrained(model_root)

        self.model.to(self.device)

        self.model.eval()

    def predict(
        self,
        text: str,
    ) -> tuple[str, float]:
        encoded = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=self.metadata["max_sequence_length"],
        )

        encoded = {key: value.to(self.device) for key, value in encoded.items()}

        with torch.inference_mode():
            outputs = self.model(**encoded)

            probabilities = F.softmax(
                outputs.logits,
                dim=1,
            )

            confidence, predicted = torch.max(
                probabilities,
                dim=1,
            )

        prediction = self.labels[str(predicted.item())]

        return (
            prediction,
            float(confidence.item()),
        )

    def get_model_info(self):
        return {
            "model": self.metadata["model_name"],
            "architecture": self.metadata["architecture"],
            "framework": self.metadata["framework"],
            "version": self.metadata["version"],
            "accuracy": self.metadata["test_metrics"]["accuracy"],
            "loaded": self.model is not None,
        }
