@echo off
chcp 65001
title IP_Set
color 02

set NAME="本地连接"
set ADDR=10.160.124.28
set MASK=255.255.255.0
set GATEWAY=10.160.124.1

netsh interface ipv4 set address name=%NAME% source=static %ADDR% 255.255.255.0 %GATEWAY% 1
netsh interface ipv4 set dnsservers name=%NAME% source=static 223.5.5.5 primary validate=no
netsh interface ipv4 add dnsservers name=%NAME% 114.114.114.114 index=2  validate=no
netsh interface ipv4 add dnsservers name=%NAME% 8.8.8.8 index=3  validate=no

ipconfig /flushdns

pause

::DHCP
::netsh interface ip set address %NAME% dhcp
::netsh interface ip set dns %NAME% dhcp

pause
