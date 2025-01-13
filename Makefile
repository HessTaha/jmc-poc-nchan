# Use bash for the shell
SHELL := /bin/bash

# Variables for environment file
ENV_FILE := backend/event-backend/.env
ENV_CONTENT := "MONGO_INITDB_ROOT_USERNAME=admin\nMONGO_INITDB_ROOT_PASSWORD=admin\nMONGO_HOST=mongodb\nBACKEND_SRV_PORT=8080"

# Phony targets: not actual files, but commands
.PHONY: help build-backend start-backend start-frontend start-all stop-all

## Show help: lists all available make targets with descriptions
help:
	@echo "Usage: make [target]"
	@echo
	@echo "Available targets:"
	@echo "  help              Display this help message"
	@echo "  build-backend     Build docker images for the backend"
	@echo "  start-backend     Start backend services (nginx, API, mongodb)"
	@echo "  start-frontend    Start frontend service"
	@echo "  start-all         Start both backend and frontend services"
	@echo "  stop-all          Stop all running services (backend & frontend)"

# ## 1. Setup ENV
# setup-env:
# 	@echo "Creating .env file for backend..."
# 	@mkdir -p backend/event-backend
# 	@echo $(ENV_CONTENT) | tr -d '"' > $(ENV_FILE)
# 	@echo ".env file created at $(ENV_FILE)"

## 2. Build backend
build-backend:
	@echo "Building backend services..."
	cd backend && docker-compose build

## 3. Start backend (nginx, api, mongodb)
start-backend:
	@echo "Starting backend services..."
	cd backend && docker-compose up
	@echo "Backend services started."

## 4. Start frontend
start-frontend:
	@echo "Starting frontend..."
	cd front && npm run dev
	@echo "Frontend is running."

## 5. Start backend and frontend
start-all: start-backend
	@echo "Starting all services..."
	make start-frontend

## 6. Stop all services
stop-all:
	@echo "Stopping all services..."
	# Stop backend containers
	cd backend && docker compose down || true
	# Optionally stop a frontend dev process if needed (uncomment if you want):
	# pkill -f "npm run dev"
	@echo "All services stopped."
