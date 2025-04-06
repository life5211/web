@echo off
chcp 65001
title PC_rename IP_config

set /p number="Please input your computer_Name_IP_Number:"
set name=OFFICECOMPUTER%number%
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\ComputerName\ActiveComputerName" /v ComputerName /t reg_sz /d %name% /f >nul 2>nul
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\ComputerName\ComputerName" /v ComputerName /t reg_sz /d %name% /f >nul 2>nul
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Tcpip\Parameters" /v "NV Hostname" /t reg_sz /d %name% /f >nul 2>nul
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Tcpip\Parameters" /v Hostname /t reg_sz /d %name% /f >nul 2>nul
::需要重启电脑才能生效
::reg add HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Control\ComputerName\ComputerName /v ComputerName /t REG_SZ /d %name% /f
::利用wmic改名不用重启
::wmic computersystem where "PrimaryOwnerName='%username%'" call rename %name%&exit
echo "Update pc name done"
echo.
wmic computersystem where Name="%COMPUTERNAME%" call JoinDomainOrWorkgroup Name="WORKGROUP"
echo "Update workgroup done"
echo.
set  describe=rename By rename.bat
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\lanmanserver\Parameters" /v srvcomment /t reg_sz /d %describe% /f
net config server /SRVCOMMENT:"%describe%"
echo "Update pc describe done"
echo.
set NETNAME="本地连接"
set ADDR=10.160.124.%number%
set MASK=255.255.255.0
set GATEWAY=10.160.124.1
netsh interface ipv4 set address name=%NETNAME% source=static %ADDR% %MASK% %GATEWAY% 1
netsh interface ipv4 set dnsservers name=%NETNAME% source=static 223.5.5.5 primary validate=no
netsh interface ipv4 add dnsservers name=%NETNAME% 114.114.114.114 index=2  validate=no
netsh interface ipv4 add dnsservers name=%NETNAME% 8.8.8.8 index=3  validate=no
ipconfig /flushdns
echo "Update pc net config done"
echo.

