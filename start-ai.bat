@echo off
echo =======================================================
echo   Starting AI Worker...
echo =======================================================
set PYTHONIOENCODING=utf-8
cd ai-worker

REM Kích hoạt virtual environment gốc (nơi đã cài đủ package)
call ..\venv\Scripts\activate.bat

REM Chạy AI worker bằng python (đã map vào venv)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
