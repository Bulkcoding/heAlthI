@echo off
cd /d "%~dp0"
"%~dp0cloudflared.exe" tunnel --url http://127.0.0.1:3000 1>"%~dp0tunnel.log" 2>&1
