@echo off
echo ====================================
echo  AI Resume Fraud Detection - Setup
echo ====================================

echo.
echo [1/2] Starting Spring Boot Backend...
cd backend
start "Spring Boot Backend" cmd /k "mvn spring-boot:run"
cd ..

echo Waiting for backend to start...
timeout /t 15 /nobreak

echo.
echo [2/2] Starting React Frontend...
cd frontend
call npm install
start "React Frontend" cmd /k "npm start"
cd ..

echo.
echo ====================================
echo  Services starting...
echo  Backend : http://localhost:8080
echo  Frontend: http://localhost:3000
echo ====================================
pause
