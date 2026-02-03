@echo off
echo Starting Backend...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Starting Frontend...
start "Frontend Server" cmd /k "npm run dev"

echo Done!
