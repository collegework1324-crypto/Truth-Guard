# Truth Guard — Multimodal Fake News Detection System

Truth Guard is a full-stack, multimodal fake news detection system using Natural Language Processing (NLP), Computer Vision (CV), Video Frame Aggregation, and Reliability-Gated Fusion.

## Technology Stack

- **Backend**: Python 3.11, FastAPI, Uvicorn, SQLAlchemy, Pydantic v2
- **NLP & Computer Vision Engine**: scikit-learn, NumPy, Pillow, OpenCV (cv2)
- **Database**: SQLite (Out-of-the-box support for PostgreSQL via `DATABASE_URL`)
- **Frontend**: React 18, Vite 5, Axios, Lucide React Icons, Vanilla CSS Design System
- **Authentication**: JWT (JSON Web Tokens), Bcrypt Password Hashing

## Project Structure

```
Truth Guard/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/  # Auth, Detection, History, Feedback, Admin, Health
│   │   ├── core/               # Security, DB Engine, Settings
│   │   ├── engine/             # TextProcessor, ImageProcessor, VideoProcessor, Fusion
│   │   ├── models/             # SQLAlchemy Models (User, DetectionAnalysis, Feedback)
│   │   ├── schemas/            # Pydantic Input/Output Schemas
│   │   └── main.py             # FastAPI App Entrypoint
│   ├── uploads/                # Media storage directory
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/client.js       # Axios Backend HTTP Client
│   │   ├── components/         # HealthStatusBadge, Navbar, Footer
│   │   ├── context/            # AuthContext
│   │   └── pages/              # Home, Workspace, History, Feedback, Admin, About, Login
│   └── vite.config.js
└── README.md
```

## API Endpoints

- `GET  /api/v1/health` — Real-time health monitor & DB status
- `POST /api/v1/auth/register` — Register new user
- `POST /api/v1/auth/login` — Login user & return JWT token
- `POST /api/v1/detection/analyze` — Multimodal analysis (headline, body, image, video)
- `GET  /api/v1/history` — Query past detection analysis records
- `POST /api/v1/feedback` — Submit user feedback and ground truth corrections
- `GET  /api/v1/admin/metrics` — Dashboard telemetry & analytics

## Running Locally

### Backend Server
```bash
cd backend
venv\Scripts\activate # On Windows
python run.py
# Running at http://127.0.0.1:8000 (Swagger docs at http://127.0.0.1:8000/api/v1/docs)
```

### Frontend Dev Server
```bash
cd frontend
npm run dev
# Running at http://localhost:5173
```
