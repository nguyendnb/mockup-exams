FROM python:3.11-slim

WORKDIR /app

# Install system dependencies and Python build tools
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install setuptools first
RUN pip install --upgrade pip setuptools wheel

# Copy requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/app.py .

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
