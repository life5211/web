
title svn sync
chcp 65001
::@echo off
:: SVN 同步脚本（日志文件外置，避免干扰SVN状态）
:: 使用说明：将此脚本放在任意目录运行（需配置工作副本路径）

:: 配置部分 ==========================================
:: SVN工作副本路径
set WORKING_DIR=D:\SVN\Disk_xuhongzhi
:: ==================================================
cd %WORKING_DIR%
:: 日志文件存储目录（工作副本外）
set LOG_DIR=..\svn_logs
set SVN_PATH=svn
set LOG_FILE=%LOG_DIR%\%~n0_%date:~0,4%%date:~5,2%.log
set COMMIT_MSG=自动同步变更 [%date% %time%]

:: 创建日志目录（如果不存在）
if not exist %LOG_DIR% ( mkdir %LOG_DIR% )

:: 创建日志头
echo ========================================== >> %LOG_FILE%
echo SVN同步开始 [%date% %time%] >> %LOG_FILE%
echo 工作副本路径：%WORKING_DIR% >> %LOG_FILE%
echo ========================================== >> %LOG_FILE%

:: 1. 精确处理本地删除的文件（状态为 !）
echo 1.检查本地删除的文件... >> %LOG_FILE%
%SVN_PATH% status %WORKING_DIR% > "%TEMP%\svn_status.txt"
:: 使用正则表达式精确匹配 "!     " 开头的行（注意后面有空格）
findstr /R /C:"^!     " "%TEMP%\svn_status.txt" > "%TEMP%\deleted_files.txt"
if exist "%TEMP%\deleted_files.txt" (
    for /f "tokens=2,* delims= " %%A in ('type "%TEMP%\deleted_files.txt"') do (
        set "file_path=%%B"
        setlocal enabledelayedexpansion
        echo 正在删除标记：!file_path! ... >> %LOG_FILE%
        %SVN_PATH% delete "!file_path!" --force >> %LOG_FILE%
        endlocal
    )
    del "%TEMP%\deleted_files.txt"
)
del "%TEMP%\svn_status.txt"
echo 本地删除文件处理完成。 >> %LOG_FILE%

:: 2. 处理新增的文件（状态为 ?）
echo 2.检查新增的文件... >> %LOG_FILE%
%SVN_PATH% status %WORKING_DIR% | findstr "^?" > "%TEMP%\added_files.txt"
if exist "%TEMP%\added_files.txt" (
    %SVN_PATH% add %WORKING_DIR% --force >> %LOG_FILE%
    del "%TEMP%\added_files.txt"
)
echo 新增文件处理完成。 >> %LOG_FILE%

:: 3. 更新仓库（拉取最新代码）
echo 3.正在更新仓库... >> %LOG_FILE%
%SVN_PATH% update %WORKING_DIR% --accept theirs-full --force >> %LOG_FILE%
if %errorlevel% neq 0 (
    echo [错误] SVN更新失败! 错误代码: %errorlevel% >> %LOG_FILE%
    goto ERROR
)
echo 仓库更新成功。 >> %LOG_FILE%

:: 4. 提交所有变更（A/M/D）
echo 4.检查并提交所有变更... >> %LOG_FILE%
%SVN_PATH% status %WORKING_DIR% | findstr /R "^[AMD]" >nul
if %errorlevel% equ 0 (
    %SVN_PATH% commit %WORKING_DIR% -m "%COMMIT_MSG%" >> %LOG_FILE%
    if %errorlevel% neq 0 (
        echo [错误] SVN提交失败! 错误代码: %errorlevel% >> %LOG_FILE%
        goto ERROR
    )
    echo 所有变更已提交（新增、修改、删除）。 >> %LOG_FILE%
) else (
    echo 没有需要提交的变更。 >> %LOG_FILE%
)

:: 成功结束
echo ========================================== >> %LOG_FILE%
echo SVN同步成功完成 [%date% %time%] >> %LOG_FILE%
echo ========================================== >> %LOG_FILE%
exit /b 0

:ERROR
echo ========================================== >> %LOG_FILE%
echo SVN同步失败 [%date% %time%] >> %LOG_FILE%
echo ========================================== >> %LOG_FILE%
exit /b 1

