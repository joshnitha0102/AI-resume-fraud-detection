#!/bin/bash

echo "===================================="
echo " AI Resume Fraud Detection - Setup"
echo "===================================="

echo ""
echo "[1/2] Starting Spring Boot Backend..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

echo "Waiting 15s for backend to start..."
sleep 15

echo ""
echo "[2/2] Installing and Starting React Frontend..."
cd frontend
npm install
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "===================================="
echo " Services running:"
echo " Backend : http://localhost:8080"
echo " Frontend: http://localhost:3000"
echo " Press Ctrl+C to stop both"
echo "===================================="

wait $BACKEND_PID $FRONTEND_PID
