@echo off
cd /d "%~dp0.."
"C:\Program Files\WindowsApps\OpenAI.Codex_26.506.3741.0_x64__2p2nqsd0c76g0\app\resources\node.exe" "preview\server.js" 1>"preview\stdout.log" 2>"preview\stderr.log"
