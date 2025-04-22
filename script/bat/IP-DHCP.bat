@echo off
chcp 65001
title IP_DHCP_SET
color 02

set NAME="本地连接"
::DHCP
netsh interface ip set address %NAME% dhcp
netsh interface ip set dns %NAME% dhcp
ipconfig /flushdns
pause
