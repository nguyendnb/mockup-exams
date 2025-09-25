#!/bin/bash

echo "🚀 Starting GCP Cloud Architect Practice Exam Application..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if the CSV file exists
if [ ! -f "Architect - result (2).csv" ]; then
    echo "❌ CSV file 'Architect - result (2).csv' not found in the current directory."
    echo "Please ensure the CSV file is in the same directory as this script."
    exit 1
fi

echo "✅ Docker is running"
echo "✅ CSV file found"
echo ""

# Build and start the application
echo "🔨 Building and starting the application..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "🎉 Application started successfully!"
    echo ""
    echo "📱 Access the application at: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5000"
    echo "🎨 Frontend: http://localhost:3000"
    echo ""
    echo "📊 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
    echo ""
else
    echo "❌ Failed to start the application. Check the logs with: docker-compose logs"
    exit 1
fi
