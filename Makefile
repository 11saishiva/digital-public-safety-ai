.PHONY: run format lint test clean

run:
	cd backend && uvicorn app.main:app --reload

format:
	cd backend && black app
	cd backend && ruff check app --fix

lint:
	cd backend && ruff check app

test:
	cd backend && pytest

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete