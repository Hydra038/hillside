@echo off
echo Connecting to Railway MySQL Database...
echo Host: interchange.proxy.rlwy.net:47475
echo Database: railway
echo User: root
echo.

REM Check if MySQL is available
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo MySQL client not found. Trying WSL...
    wsl mysql -h interchange.proxy.rlwy.net -u root -p -P 47475 --protocol=TCP railway
) else (
    echo Using Windows MySQL client...
    mysql -h interchange.proxy.rlwy.net -u root -p -P 47475 --protocol=TCP railway
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Connection failed. Please check:
    echo 1. Railway database is running
    echo 2. Network connectivity
    echo 3. Firewall settings
    echo.
    echo Try running: npx prisma db push
    echo Or install MySQL client with: choco install mysql.workbench
)

pause
