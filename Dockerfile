# Multi-stage Dockerfile to build React frontend and run Flask backend with Gunicorn

# --- Build frontend ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app/front
COPY front/package.json front/package-lock.json* ./
RUN npm ci --silent || npm install --silent
COPY front/ ./
RUN npm run build

# --- Build backend image ---
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# system deps for some packages (if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend
COPY back/ ./back/

# Copy built frontend into backend static folder
COPY --from=frontend-builder /app/front/build/ ./front/build/

# Install Python deps
COPY back/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 5000

# Use Gunicorn to serve the Flask app with multiple workers
ENV FLASK_APP=back.app
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "back.app:app"]
