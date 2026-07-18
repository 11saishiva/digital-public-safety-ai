import torch.nn as nn
from torchvision import models


class CurrencyClassifier(nn.Module):
    def __init__(self):
        super().__init__()

        self.model = models.mobilenet_v3_large(weights=None)

        in_features = self.model.classifier[0].in_features

        self.model.classifier = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.BatchNorm1d(512),
            nn.Hardswish(),
            nn.Dropout(0.30),
            nn.Linear(512, 128),
            nn.BatchNorm1d(128),
            nn.Hardswish(),
            nn.Dropout(0.20),
            nn.Linear(128, 2),
        )

    def forward(self, x):
        return self.model(x)
