
title svn sync
chcp 65001
:: @echo off
:: SVN 同步脚本（日志文件外置，避免干扰SVN状态）
:: 使用说明：将此脚本放在任意目录运行（需配置工作副本路径）

:: 配置部分 ==========================================
:: SVN工作副本路径
set WORK_DIR=\SVN\Disk_xuhongzhi
:: ==================================================
:: cd %WORK_DIR%
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
echo 工作副本路径：%WORK_DIR% >> %LOG_FILE%
echo ========================================== >> %LOG_FILE%
for /f "tokens=1* delims= " %%A in ('svn status') do (
  echo %%A
  echo %%B
  echo 2 %%A
  echo 2 %%B

)
:: 1. 逐行处理 SVN 状态
for /F "tokens=1* delims= " %%A in ('svn status') do (
  if "%%A"=="?" (
     echo ?发现未跟踪文件: %%B >> %LOG_FILE%
     %SVN_PATH% add "%%B" >> %LOG_FILE%
  ) else if "%%A"=="!" (
     echo !发现本地删除文件: %%B >> %LOG_FILE%
      %SVN_PATH% delete "%%B" --force >> %LOG_FILE%
  ) else if "%%A"=="C" (
      echo C发现冲突文件结束执行: %%B >> %LOG_FILE%
      goto ERROR
  ) else if "%%A"=="A" (
      echo A已计划添加文件: %%B >> %LOG_FILE%
  ) else if "%%A"=="M" (
      echo M已修改文件: %%B >> %LOG_FILE%
  ) else if "%%A"=="D" (
      echo D已计划删除文件: %%B >> %LOG_FILE%
  ) else (
      echo 忽略未知状态 [%%A]: %%B >> %LOG_FILE%
  )
  if %errorlevel% 1 (
      echo [错误] 处理文件 "%%B" 时发生异常 >> %LOG_FILE%
  )
)
echo 本地变更处理完成。 >> %LOG_FILE%

:: 2. 更新仓库（拉取最新代码）
echo 正在更新仓库... >> %LOG_FILE%
%SVN_PATH% update %WORK_DIR% --accept theirs-full --force >> %LOG_FILE%
if %errorlevel% neq 0 (
    echo [错误] SVN更新失败! 错误代码: %errorlevel% >> %LOG_FILE%
    goto ERROR
)
echo 仓库更新成功。 >> %LOG_FILE%

:: 3. 提交所有变更（A/M/D）
echo 检查并提交所有变更... >> %LOG_FILE%
%SVN_PATH% status %WORK_DIR% | findstr /R "^[AMD]" >nul
if %errorlevel% equ 0 (
::    %SVN_PATH% commit %WORK_DIR% -m %COMMIT_MSG% >> %LOG_FILE%
    if %errorlevel% neq 0 (
        echo [错误] SVN提交失败! 错误代码: %errorlevel% >> %LOG_FILE%
        goto ERROR
    )
    echo 所有变更已提交。 >> %LOG_FILE%
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

:flog
echo %~1 >> %LOG_FILE%
goto :eof