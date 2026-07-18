from app.ml.loaders.counterfeit_loader import CounterfeitLoader

loader = CounterfeitLoader()

prediction, confidence = loader.predict(
    "/home/sai_shiva/Downloads/archive (1)/data/data/fake/50/aug_999_WhatsApp Image 2025-04-05 at 10.48.38 (1).jpeg"  # use any currency image
)


print(f"Prediction : {prediction}")
print(f"Confidence : {confidence:.4f}")
