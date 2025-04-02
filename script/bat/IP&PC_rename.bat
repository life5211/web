@echo off
chcp 65001
set /p name="Please input your computer_name:"
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\ComputerName\ActiveComputerName" /v ComputerName /t reg_sz /d %name% /f >nul 2>nul
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\ComputerName\ComputerName" /v ComputerName /t reg_sz /d %name% /f >nul 2>nul
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Tcpip\Parameters" /v "NV Hostname" /t reg_sz /d %name% /f >nul 2>nul
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Tcpip\Parameters" /v Hostname /t reg_sz /d %name% /f >nul 2>nul
::需要重启电脑才能生效
::reg add HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Control\ComputerName\ComputerName /v ComputerName /t REG_SZ /d %name% /f
::利用wmic改名不用重启
::wmic computersystem where "PrimaryOwnerName='%username%'" call rename %name%&exit

eixt
echo.
echo "Update pc name done"
echo.
echo AppLife.Net
wmic computersystem where Name="%COMPUTERNAME%" call JoinDomainOrWorkgroup Name="WORKGROUP"
echo "Update workgroup done"
pause>nul
echo.

set NAME="锟斤拷锟斤拷锟斤拷锟斤拷"
set ADDR=10.160.124.28
set MASK=255.255.255.0
set GATEWAY=10.160.124.1

netsh interface ipv4 set address name=%NAME% source=static %ADDR% 255.255.255.0 %GATEWAY% 1
netsh interface ipv4 set dnsservers name=%NAME% source=static 223.5.5.5 primary validate=no
netsh interface ipv4 add dnsservers name=%NAME% 114.114.114.114 index=2  validate=no
netsh interface ipv4 add dnsservers name=%NAME% 8.8.8.8 index=3  validate=no

ipconfig /flushdns

set /p describe=请输入您的计算机描述（公司规定必须是使用者姓名）：
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\lanmanserver\Parameters" /v srvcomment /t reg_sz /d %describe% /f
net config server /SRVCOMMENT:"%describe%"


