.PHONY: install run chat web clean test format lint help docker-build docker-run docker-chat docker-stop docker-clean docker-web

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "Local Development:"
	@echo "  install    - Install dependencies using Poetry"
	@echo "  run        - Run the AI agent in interactive CLI mode"
	@echo "  chat       - Alias for run"
	@echo "  web        - Start web interface with progressive security levels"
	@echo "  test       - Run tests"
	@echo "  format     - Format code with black"
	@echo "  lint       - Lint code with flake8"
	@echo "  clean      - Clean up cache files"
	@echo ""
	@echo "Docker Commands:"
	@echo "  docker-build  - Build Docker image"
	@echo "  docker-run    - Run CLI with Docker Compose in background"
	@echo "  docker-web    - Start web interface with Docker"
	@echo "  docker-chat   - Run interactive chat with Docker"
	@echo "  docker-stop   - Stop Docker containers"
	@echo "  docker-clean  - Clean up Docker containers and images"
	@echo ""
	@echo "Examples:"
	@echo "  make install"
	@echo "  make web"
	@echo "  make run"
	@echo "  make docker-web"

# Install dependencies
install:
	chmod +x scripts/setup.sh
	./scripts/setup.sh

# Run interactive CLI mode
run:
	poetry run python vhack.py

# Alias for run
chat: run

# Start web interface with progressive security levels
web:
	@echo "Starting V.H.A.C.K. web interface at http://localhost:8000"
	@echo "⚠️  WARNING: This is a vulnerable application for educational purposes!"
	@echo "🔒 Switch between security levels dynamically in the web interface"
	chmod +x scripts/start_web.sh
	./scripts/start_web.sh

# Run tests
test:
	poetry run pytest

# Format code
format:
	poetry run black .

# Lint code
lint:
	poetry run flake8 .

# Clean up
clean:
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name ".pytest_cache" -delete

# Docker commands
docker-build:
	docker compose build

docker-run:
	@echo "Starting Docker container in background..."
	docker compose up -d

docker-chat:
	@echo "Starting interactive chat with Docker..."
	docker compose run --rm vhack poetry run python vhack.py

docker-web:
	@echo "Starting V.H.A.C.K. web interface with Docker at http://localhost:8000"
	@echo "⚠️  WARNING: This is a vulnerable application for educational purposes!"
	@echo "🔒 Switch between security levels dynamically in the web interface"
	docker compose --profile web up --build

docker-stop:
	docker compose down

docker-clean:
	docker compose down --rmi all --volumes --remove-orphans