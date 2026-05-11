@echo off
setlocal EnableExtensions EnableDelayedExpansion
title AGENDATECH - Backend

REM =================================================
REM  CAMINHOS
REM =================================================
set "ROOT=%~dp0"
set "BACKEND=%ROOT%Backend"
set "LOGS=%ROOT%logs"
set "SEED_FLAG=%BACKEND%\.seed_aplicado"
set "SEED_LAST=%LOGS%\seed_last.log"
set "SEED_ERR=%LOGS%\seed_error.log"

if not exist "%LOGS%" mkdir "%LOGS%" >nul 2>&1

cls
echo.
echo  ============================================
echo    AGENDATECH - Iniciando o Backend...
echo  ============================================
echo.

REM =================================================
REM  VALIDACAO: pasta Backend e docker-compose
REM =================================================
if not exist "%BACKEND%\docker-compose.yml" (
    echo.
    echo  [ERRO] Nao encontrei o arquivo docker-compose.yml
    echo.
    echo  O que fazer:
    echo   - Verifique se a pasta "Backend" esta na mesma
    echo     pasta que este arquivo .bat
    echo   - Verifique se docker-compose.yml esta dentro
    echo     da pasta Backend
    echo.
    pause
    exit /b 1
)

pushd "%BACKEND%"
if errorlevel 1 (
    echo.
    echo  [ERRO] Nao consigo acessar a pasta Backend.
    echo  Caminho: %BACKEND%
    echo.
    pause
    exit /b 1
)

REM =================================================
REM  DOCKER CLI: localizar executavel
REM =================================================
set "DOCKER_CMD="
where docker >nul 2>&1
if not errorlevel 1 set "DOCKER_CMD=docker"

if not defined DOCKER_CMD (
    if exist "C:\Program Files\Docker\Docker\resources\bin\docker.exe" (
        set "DOCKER_CMD=C:\Program Files\Docker\Docker\resources\bin\docker.exe"
    )
)

if not defined DOCKER_CMD (
    echo.
    echo  [ERRO] Docker nao esta instalado neste computador.
    echo.
    echo  Como instalar:
    echo   1. Acesse: https://www.docker.com/products/docker-desktop
    echo   2. Clique em "Download for Windows"
    echo   3. Instale e reinicie o computador
    echo   4. Execute este script novamente
    echo.
    popd
    pause
    exit /b 1
)

REM =================================================
REM  PASSO 1: Garantir que o Docker esta rodando
REM =================================================
echo  [1/5] Verificando Docker...
call :StartDockerDesktop
call :WaitDocker
if errorlevel 1 (
    echo.
    echo  [ERRO] O Docker nao conseguiu iniciar a tempo.
    echo.
    echo  O que fazer:
    echo   1. Abra o "Docker Desktop" manualmente
    echo   2. Espere aparecer "Engine running" no rodape
    echo   3. Execute este script novamente
    echo.
    echo  Se o problema persistir, reinicie o computador.
    echo.
    popd
    pause
    exit /b 1
)
echo  Docker OK!
echo.

REM =================================================
REM  PASSO 2: Criar .env se nao existir
REM =================================================
if not exist ".env" (
    if exist ".env.example" (
        copy /y ".env.example" ".env" >nul
        echo  Arquivo .env criado automaticamente.
        echo.
    ) else (
        echo.
        echo  [AVISO] Nao encontrei o arquivo .env nem o .env.example
        echo  O sistema pode nao funcionar sem as configuracoes.
        echo  Fale com o time de backend.
        echo.
    )
)

REM =================================================
REM  LER VARIAVEIS DO .ENV (para exibir no Adminer)
REM =================================================
set "MYSQL_USER="
set "MYSQL_PASSWORD="
set "MYSQL_DATABASE="
if exist ".env" (
    for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do (
        set "_k=%%A"
        if /i "!_k!"=="MYSQL_USER"     set "MYSQL_USER=%%B"
        if /i "!_k!"=="MYSQL_PASSWORD" set "MYSQL_PASSWORD=%%B"
        if /i "!_k!"=="MYSQL_DATABASE" set "MYSQL_DATABASE=%%B"
    )
)

REM =================================================
REM  PASSO 3: Subir containers
REM =================================================
echo  [2/5] Subindo os containers...
"%DOCKER_CMD%" compose up -d 2>&1
echo.

REM =================================================
REM  PASSO 4: Aguardar API responder no /health
REM =================================================
echo  [3/5] Aguardando a API ficar pronta...
call :WaitApi
if errorlevel 1 (
    echo.
    echo  [ERRO] A API nao respondeu depois de varios minutos.
    echo.
    echo  O que pode ter acontecido:
    echo   - Erro no codigo ao iniciar o servidor
    echo   - Banco de dados com problema de conexao
    echo   - Porta 3000 bloqueada pelo firewall
    echo.
    echo  Para investigar, abra outro terminal e rode:
    echo    docker compose logs api
    echo.
    popd
    pause
    exit /b 1
)
echo  API no ar!
echo.

REM =================================================
REM  PASSO 5: Seed (somente na primeira execucao)
REM =================================================
echo  [4/5] Verificando banco de dados...
if not exist "%SEED_FLAG%" (
    echo  Primeira vez rodando - populando o banco com dados iniciais...
    "%DOCKER_CMD%" compose exec -T api node src/database/migrate.js --seed > "%SEED_LAST%" 2>&1
    if errorlevel 1 (
        echo.
        echo  [ERRO] Falha ao popular o banco de dados.
        echo.
        echo  O que fazer:
        echo   1. Fale com o time de backend
        echo   2. Mostre o arquivo de log em:
        echo      %SEED_LAST%
        echo.
        echo  --- Trecho do erro: ---
        type "%SEED_LAST%"
        echo.
        echo. >> "%SEED_ERR%"
        echo [%date% %time%] >> "%SEED_ERR%"
        type "%SEED_LAST%" >> "%SEED_ERR%"
        popd
        pause
        exit /b 1
    )
    echo OK > "%SEED_FLAG%"
    echo  Banco populado com sucesso!
) else (
    echo  Banco ja estava pronto. Nada a fazer.
)
echo.

REM =================================================
REM  PASSO 6: Abrir sistema no navegador
REM =================================================
echo  [5/5] Abrindo o sistema no navegador...
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000/"
start "" "http://localhost:8080/"

REM =================================================
REM  INFORMACOES DE ACESSO AO BANCO (Adminer)
REM =================================================
set "INFO_FILE=%TEMP%\AGENDATECH_ACESSO_BANCO.txt"
(
    echo ============================================
    echo  AGENDATECH - Acesso ao Banco de Dados
    echo ============================================
    echo.
    echo  Abra no navegador: http://localhost:8080
    echo.
    echo  Preencha a tela de login com:
    echo.
    echo    Sistema:  MySQL
    echo    Servidor: mysql
    echo    Usuario:  agendamento
    echo    Senha:    agendamento@123
    echo    Banco:    agendamento
    echo.
    echo  Dica: copie e cole os dados acima no Adminer.
    echo ============================================
) > "%INFO_FILE%"

notepad "%INFO_FILE%"

REM =================================================
REM  TUDO CERTO!
REM =================================================
popd
echo.
echo  ============================================
echo   BACKEND PRONTO! Bom trabalho!
echo  ============================================
echo.
echo   API     --^>  http://localhost:3000
echo   Adminer --^>  http://localhost:8080
echo.
pause
exit /b 0

REM =================================================
REM  FUNCOES INTERNAS
REM =================================================

:StartDockerDesktop
if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    timeout /t 3 /nobreak >nul
)
exit /b 0

:WaitDocker
for /L %%I in (1,1,40) do (
    "%DOCKER_CMD%" info >nul 2>&1
    if not errorlevel 1 exit /b 0
    if %%I==1  echo  Aguardando Docker iniciar ^(pode demorar 1-2 min na primeira vez^)...
    if %%I==10 echo  Ainda aguardando o Docker...
    if %%I==25 echo  Docker demorando mais que o normal. Verifique o Docker Desktop.
    timeout /t 3 /nobreak >nul
)
exit /b 1

:WaitApi
for /L %%I in (1,1,40) do (

    powershell -NoProfile -Command "try { $r = Invoke-WebRequest 'http://127.0.0.1:3000/health' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"

    if not errorlevel 1 exit /b 0

    if %%I==1  echo  Aguardando API responder...
    if %%I==10 echo  Ainda aguardando... o banco de dados pode estar subindo.
    if %%I==25 echo  Demorando mais que o esperado. Aguarde...

    timeout /t 3 /nobreak >nul
)

exit /b 1