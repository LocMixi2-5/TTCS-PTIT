# Job Recommender System — AI-Powered Job Matching

> Hệ thống gợi ý việc làm thông minh sử dụng SBERT + Vector Search (Milvus)

## Kiến trúc hệ thống

Hệ thống cung cấp 2 giao diện người dùng:
1. **React Frontend**: Giao diện chính với đầy đủ chức năng.
2. **Streamlit App**: Giao diện prototype nhanh gọn để thử nghiệm AI.

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   React Frontend    │────▶│  Node.js API Gateway │────▶│  FastAPI AI Worker  │
│   (Vite + Tailwind) │     │  (Express + JWT)     │     │  (SBERT + Milvus)   │
│   Port: 5173        │     │  Port: 3000          │     │  Port: 8000         │
└─────────────────────┘     └──────────┬───────────┘     └──────────┬──────────┘
                                       │                            │
                            ┌──────────▼───────────┐     ┌─────────▼──────────┐
                            │    PostgreSQL        │     │    Milvus Lite     │
                            │    (Users, Jobs,     │     │    (Job Vectors)   │
                            │     CVs, Tracking)   │     │    384-dim         │
                            └──────────────────────┘     └────────────────────┘

┌─────────────────────┐
│    Streamlit App    │
│   (Python UI)       │
│   Port: 8501        │
└─────────────────────┘
```

## Quick Start

### 1. Khởi động Database
```bash
docker-compose up -d
```

### 2. Backend (Node.js)
```bash
cd backend
npm install
npm run migrate     # Tạo bảng PostgreSQL
npm run seed        # Import dữ liệu jobs từ CSV
npm run dev
```

### 3. AI Worker (Python)
Cài đặt thư viện:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cd ai-worker
pip install -r requirements.txt
```

Khởi động AI Worker:
```bash
# Sử dụng script chạy nhanh trên Windows
start-ai.bat
```
Hoặc thủ công:
```bash
cd ai-worker
python -m uvicorn app.main:app --reload --port 8000
```

### 4. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### 5. Streamlit Prototype (Tùy chọn)
```bash
streamlit run streamlit_app.py
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + Vite + Tailwind CSS | SPA with dark mode UI |
| Frontend (Prototype) | Streamlit | Quick UI for AI testing |
| Backend | Node.js + Express | API Gateway, Auth, File uploads |
| AI Worker | Python + FastAPI + SBERT | NLP processing, vector encoding |
| Vector DB | Milvus Lite | Similarity search, Local Vector DB |
| Database | PostgreSQL | Users, CVs, Jobs, Tracking |
| UI | Framer Motion + Lucide | Animations + Icons |

## Cấu trúc thư mục

```
Job_Recommender_System/
├── frontend/                  # React SPA
├── backend/                   # Node.js API Gateway
├── ai-worker/                 # Python FastAPI Worker
│   ├── app/
│   │   ├── models/           # SBERT model, schemas
│   │   ├── services/         # CV parser, matching, Milvus
│   │   └── routers/          # API endpoints
│   └── milvus.db/            # Local Milvus database
├── data/                      # CSV job data
├── streamlit_app.py           # Streamlit Prototype UI
├── start-ai.bat               # Script khởi động AI Worker
├── docker-compose.yml         # PostgreSQL
└── .env                       # Environment variables
```

## API Endpoints

### Node.js Backend (Port 3000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập → JWT |
| GET | `/api/auth/me` | Thông tin user |
| POST | `/api/cv/upload` | Upload CV (PDF) |
| GET | `/api/cv/list` | Danh sách CV |
| GET | `/api/recommendations/:cvId` | Kết quả gợi ý |
| POST | `/api/tracking/events` | Tracking events |

### FastAPI AI Worker (Port 8000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/match` | CV → SBERT → Milvus search |
| POST | `/api/ai/jobs/index` | Batch index jobs |
| GET | `/health` | Health check |
