# Digital Public Safety AI

An AI-powered public safety platform that leverages Machine Learning and Natural Language Processing to detect counterfeit Indian currency and identify scam or phishing messages through a unified web application.

The platform combines computer vision and transformer-based language models with a modern web interface to provide fast, accurate, and explainable predictions while maintaining a searchable history of all analyses.

---

## Overview

Digital fraud continues to evolve in multiple forms, including counterfeit currency circulation and online phishing or scam campaigns. Traditional verification methods are often manual, time-consuming, and inaccessible to the general public.

Digital Public Safety AI addresses these challenges by integrating two independent AI systems into a single platform:

- Counterfeit Currency Detection using Computer Vision
- Scam & Phishing Text Detection using Natural Language Processing

Each prediction is stored in a centralized database, allowing users to review previous analyses, inspect detailed reports, and monitor overall statistics through an interactive dashboard.

---

## Features

### Counterfeit Currency Detection

- Upload images of Indian currency notes
- AI-powered counterfeit classification
- Confidence score prediction
- Image storage and report generation
- Historical prediction records
- Detailed report view

---

### Scam Detection

- Detect phishing emails
- Detect SMS spam
- Detect financial scam messages
- Detect social engineering attempts
- Confidence score prediction
- Pattern identification
- Complete report history

---

### Dashboard

- Overall prediction statistics
- Counterfeit detection summary
- Scam detection summary
- Interactive visualizations
- Recent activity overview

---

### Report Management

- Search reports
- Pagination
- Detailed report pages
- Delete reports
- Copy prediction details
- View uploaded currency images

---

## Project Architecture

```
                    User
                      │
                      ▼
              React Frontend
                      │
         REST API Communication
                      │
                      ▼
              FastAPI Backend
          ┌──────────┴──────────┐
          ▼                     ▼
Counterfeit Service      Scam Detection Service
          │                     │
          ▼                     ▼
 MobileNetV3 Model      DistilBERT Model
          │                     │
          └──────────┬──────────┘
                     ▼
                SQLite Database
                     │
                     ▼
            Prediction History
```

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack React Query
- React Router
- Axios
- Recharts
- Lucide React

---

## Backend

- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- Uvicorn

---

## Machine Learning

### Counterfeit Detection

- PyTorch
- Torchvision
- MobileNetV3 Large
- Image Classification

### Scam Detection

- Hugging Face Transformers
- DistilBERT
- PyTorch
- Binary Text Classification

---

## Development Tools

- Git
- GitHub
- Python
- Node.js
- npm

---

# Folder Structure

```
digital-public-safety-ai
│
├── backend
│   ├── app
│   │   ├── core
│   │   ├── db
│   │   ├── entities
│   │   ├── middleware
│   │   ├── ml
│   │   ├── repositories
│   │   ├── routers
│   │   ├── schemas
│   │   ├── services
│   │   └── utils
│   │
│   ├── storage
│   │   ├── models
│   │   ├── uploads
│   │   └── database
│   │
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   ├── routes
│   │   ├── types
│   │   └── utils
│   │
│   └── package.json
│
├── docs
│
├── docker-compose.yml
│
└── README.md
```

---

# Application Workflow

## Counterfeit Detection

```
Upload Image
      │
      ▼
Image Preprocessing
      │
      ▼
MobileNetV3 Model
      │
      ▼
Prediction
      │
      ▼
Store Report
      │
      ▼
Display Results
```

---

## Scam Detection

```
Enter Text
      │
      ▼
Text Preprocessing
      │
      ▼
DistilBERT Model
      │
      ▼
Prediction
      │
      ▼
Store Report
      │
      ▼
Display Results
```

---

# API Endpoints

## Counterfeit Detection

| Method | Endpoint | Description |
|----------|------------------------------|------------------------------|
| POST | `/counterfeit/predict` | Predict counterfeit currency |
| GET | `/counterfeit` | List reports |
| GET | `/counterfeit/{id}` | Get report |
| DELETE | `/counterfeit/{id}` | Delete report |
| GET | `/counterfeit/model/info` | Model information |

---

## Scam Detection

| Method | Endpoint | Description |
|----------|---------------------|-----------------------|
| POST | `/scam/predict` | Predict scam text |
| GET | `/scam` | List reports |
| GET | `/scam/{id}` | Get report |
| DELETE | `/scam/{id}` | Delete report |
| GET | `/scam/model/info` | Model information |

---

# Installation

## Clone Repository

```bash
git clone https://github.com/<username>/digital-public-safety-ai.git
cd digital-public-safety-ai
```

---

## Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt
```

Run the server

```bash
uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

Backend

```
DATABASE_URL=
MODEL_PATH=
UPLOAD_DIRECTORY=
```

Frontend

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

# Machine Learning Models

## Counterfeit Detection

Architecture

- MobileNetV3 Large

Task

- Binary Image Classification

Output

- Genuine
- Counterfeit

---

## Scam Detection

Architecture

- DistilBERT

Task

- Binary Text Classification

Output

- Safe
- Scam

---

# Screenshots

## Dashboard

_Add screenshot here_

---

## Counterfeit Detection

_Add screenshot here_

---

## Scam Detection

_Add screenshot here_

---

## Reports

_Add screenshot here_

---

## Report Details

_Add screenshot here_

---

# Future Enhancements

- User authentication
- Role-based access control
- PDF report export
- Advanced analytics
- Multi-language scam detection
- Mobile application
- Cloud deployment
- Model version management
- Additional fraud detection modules

---

# License

This project is intended for educational, research, and hackathon purposes.

---

# Acknowledgements

- FastAPI
- React
- Hugging Face
- PyTorch
- Torchvision
- Tailwind CSS
- TanStack React Query
- Recharts
