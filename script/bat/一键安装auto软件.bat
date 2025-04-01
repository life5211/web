@echo off
title Win_soft_install_auto
color 02

for %%i in (auto\*.*) do (
 echo %%i "====Start============="
 start /wait .\%%i /q /Q /s /S
 echo %%i "====End========================Done===="
 @echo  %%i>>install_auto.log
)

pause
