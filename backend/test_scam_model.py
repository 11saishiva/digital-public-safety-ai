from app.ml.loaders.scam_loader import ScamLoader

loader = ScamLoader()

print(loader.get_model_info())

prediction, confidence = loader.predict(
    "Congratulations! You have won ₹10,00,000. Click the link below to claim your reward."
)

print(f"Prediction : {prediction}")
print(f"Confidence : {confidence:.4f}")
