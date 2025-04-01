@echo off
chcp 65001
title NGINX批处理程序
color 02
SET NGINX_DIR=C:\softFile\nginx-1.16.0\
cd "%NGINX_DIR%"

:showHelp 
echo ======================
echo Options:
	echo   1,start      开始: start nginx master process
	echo   2,reopen     重启: reopen nginx
	echo   3,reload     重新加载: reload configuration
	echo   4,stop       快速停止: stop the newest nginx master process
	echo   5,quit       完整有序停止: 
	echo   6,kill       停止所有任务：stop all nginx master processes
	echo   7,-t         测试配置文件
	echo   find         启动列表: show the nginx master process list 
	echo   help,-h      帮助: this help
	echo   version,-v   版本: show current nginx version
echo =======================
goto dobat

:dobat
	set /p p1=输入你的选择：
	if "%p1%"=="1" goto start
	if "%p1%"=="2" goto reopen
	if "%p1%"=="3" goto reload
	if "%p1%"=="4" goto stop
	if "%p1%"=="5" goto quit
	if "%p1%"=="6" goto kill
	if "%p1%"=="7" goto test
	if "%p1%"=="-t" goto test
	if "%p1%"=="start" goto start
	if "%p1%"=="stop" goto stop
	if "%p1%"=="reload" goto reload
	if "%p1%"=="reopen" goto reopen
	if "%p1%"=="find" goto find
	if "%p1%"=="help" goto help
	if "%p1%"=="-h" goto help
	if "%p1%"=="version" goto version
	if "%p1%"=="-v" goto version
goto error

:start
tasklist|find /i "nginx.exe" > NUL
if %errorlevel%==0 (
	%cd%/nginx -s quit
	echo 服务关闭中...
)
start %cd%/nginx -c conf/nginx.conf
echo 服务已成功开启...
goto dobat

:reopen
nginx -s reopen
goto dobat

:stop
nginx -s stop
goto dobat

:kill
taskkill /F /IM nginx.exe
goto dobat

:quit
nginx -s quit

:test
nginx -t
goto dobat

:reload
nginx -s reload
goto dobat

:find
tasklist /fi "imagename eq nginx.exe"
goto dobat

:help
nginx -h
goto showHelp

:version
nginx.exe -v
goto dobat

:error
echo ****error****
echo=   
goto dobat