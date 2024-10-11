@echo on
chcp 65001
title 初始化安装软件
color 02

for %%i in (auto\*.*) do (
 echo %%i "====Start============="
 start /wait .\%%i /q /Q /s /S
 echo %%i "====End========================Done===="
 @echo  %%i>>install.log
)

pause
