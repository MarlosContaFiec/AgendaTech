@echo off
setlocal EnableDelayedExpansion

echo =====================================
echo  AGENDATECH - BACKEND AUTO
echo =====================================

REM Ir para a pasta do script
cd /d "%~dp0"

REM Criar pasta de logs se nao existir
if not exist logs (
    mkdir logs
)

REM Entrar no backend
cd backend

REM Criar .env se nao existir
if not exist .env (
    echo Criando .env a partir do .env.example...
    copy .env.example .env > nul
) else (
    echo .env ja existe.
)

REM Subir containers
echo Subindo containers...
docker compose up -d

echo Aguardando containers...
timeout /t 5 /nobreak > nul

REM ===============================
REM SEED (somente uma vez)
REM ===============================
if exist .seed_aplicado (
    echo Seed ja aplicado. Pulando...
) else (
    echo Seed nao encontrado. Aplicando...
    docker compose exec api node src/database/migrate.js --seed

    if %ERRORLEVEL% EQU 0 (
        echo Seed aplicado com sucesso.
        echo OK > .seed_aplicado
    ) else (
        echo ERRO ao aplicar seed!
        echo [%DATE% %TIME%] ERRO NO SEED >> ..\logs\seed_error.log
        pause
        exit /b 1
    )
)

REM ===============================
REM HEALTH CHECK
REM ===============================
echo Verificando health check...

curl -f http://localhost:3000/health > ..\logs\health_last.log 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo #####################################
    echo  ERRO: API NAO RESPONDEU NO /health
    echo #####################################
    echo.

    echo [%DATE% %TIME%] Health check falhou >> ..\logs\health_error.log
    echo ------------------------------ >> ..\logs\health_error.log
    type ..\logs\health_last.log >> ..\logs\health_error.log
    echo ------------------------------ >> ..\logs\health_error.log

    REM Beep de alerta
    echo ^G

    echo Veja o log em:
    echo Caso não seja Eu me avise e mande para mim este log no meu email
    echo logs\health_error.log

    pause
    exit /b 1
)

echo Health check OK ✅

echo =====================================
echo  BACKEND PRONTO 🚀
echo =====================================
pause
endlocal