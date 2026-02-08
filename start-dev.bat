@echo off
setlocal

REM Start backend
start "backend" cmd /k "cd /d %~dp0backend && npm run dev"

REM Start frontend
start "frontend" cmd /k "cd /d %~dp0frontend && npm start"

endlocal
