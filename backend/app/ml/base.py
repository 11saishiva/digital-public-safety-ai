from abc import ABC, abstractmethod


class BaseModel(ABC):
    @abstractmethod
    def load(self) -> None:
        pass

    @abstractmethod
    def predict(self, image_path: str):
        pass
