@echo off
setlocal

REM 从 .env 文件中读取环境变量
for /f "tokens=1,2 delims==" %%a in (../../.env) do (
    if "%%a"=="PG_HOST" set PG_HOST=%%b
    if "%%a"=="PG_PORT" set PG_PORT=%%b
    if "%%a"=="PG_USER" set PG_USER=%%b
    if "%%a"=="PG_PASSWORD" set PG_PASSWORD=%%b
)

REM 创建数据库
echo Creating database...
psql -h %PG_HOST% -p %PG_PORT% -U %PG_USER% -c "CREATE DATABASE l;"

REM 创建表
echo Creating table...
psql -h %PG_HOST% -p %PG_PORT% -U %PG_USER% -d l -c "CREATE TABLE items (id UUID PRIMARY KEY, name TEXT NOT NULL);"

echo Database and table created successfully.

endlocal
pause