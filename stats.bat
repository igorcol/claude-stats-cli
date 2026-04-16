@echo off
chcp 65001 > nul

:: O comando "call" impede que o npx feche o processo pai
call npx tsx "%~dp0src\index.ts"

echo.
echo  [ Pressione qualquer tecla para fechar ]
pause > nul