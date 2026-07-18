from app.ml.loaders.counterfeit_loader import CounterfeitLoader

loader = CounterfeitLoader()

print(loader.metadata)

print(loader.labels)

print(loader.model)
