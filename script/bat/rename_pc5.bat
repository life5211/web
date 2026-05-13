@echo off
chcp 65001
set  name="Classroom5"
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\ComputerName\ActiveComputerName" /v ComputerName /t reg_sz /d %name% /f >nul 2>nul
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\ComputerName\ComputerName" /v ComputerName /t reg_sz /d %name% /f >nul 2>nul
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Tcpip\Parameters" /v "NV Hostname" /t reg_sz /d %name% /f >nul 2>nul
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Tcpip\Parameters" /v Hostname /t reg_sz /d %name% /f >nul 2>nul
::需要重启电脑才能生效
::reg add HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Control\ComputerName\ComputerName /v ComputerName /t REG_SZ /d %name% /f
::利用wmic改名不用重启
::wmic computersystem where "PrimaryOwnerName='%username%'" call rename %name%&exit

echo.
echo "Update pc name done"
echo.
wmic computersystem where Name="%COMPUTERNAME%" call JoinDomainOrWorkgroup Name="WORKGROUP"
echo "Update workgroup done"
pause>nul
echo.
