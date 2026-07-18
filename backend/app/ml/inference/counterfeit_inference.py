from app.ml.registry import registry


class CounterfeitInference:
    def __init__(self):
        self.model = registry.counterfeit

    def predict(self, image_path: str):
        return self.model.predict(image_path)
