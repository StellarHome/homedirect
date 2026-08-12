#!/bin/bash

# HomeDirect Deployment Script
# This script deploys the entire HomeDirect application using Docker Compose

set -e

echo "🚀 Starting HomeDirect deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file. Please update it with your configuration."
    else
        echo "❌ .env.example file not found. Please create a .env file manually."
        exit 1
    fi
fi

# Build and start services
echo "📦 Building Docker images..."
docker-compose build

echo "🔄 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
docker-compose ps

echo "✅ Deployment complete!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Relayer API: http://localhost:3001"
echo "🗄️  PostgreSQL: localhost:5432"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"
