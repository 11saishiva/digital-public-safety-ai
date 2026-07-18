# from app.ml.loaders.counterfeit_loader import CounterfeitLoader


# class ModelRegistry:
#     def __init__(self):
#         self._counterfeit = CounterfeitLoader()

#     @property
#     def counterfeit(self) -> CounterfeitLoader:
#         return self._counterfeit


# registry = ModelRegistry()
from app.ml.loaders.counterfeit_loader import CounterfeitLoader
from app.ml.loaders.scam_loader import ScamLoader


class ModelRegistry:
    def __init__(self):
        self.counterfeit = CounterfeitLoader()
        self.scam = ScamLoader()


registry = ModelRegistry()
