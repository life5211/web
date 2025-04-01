@echo off
echo AppLife.Net
set /p name="Please input your computer_name:"
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\ComputerName\ActiveComputerName" /v ComputerName /t reg_sz /d %name% /f >nul 2>nul
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Tcpip\Parameters" /v "NV Hostname" /t reg_sz /d %name% /f >nul 2>nul
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Tcpip\Parameters" /v Hostname /t reg_sz /d %name% /f >nul 2>nul
echo.
echo "Update pc name done"
echo.
echo AppLife.Net
wmic computersystem where Name="%COMPUTERNAME%" call JoinDomainOrWorkgroup Name="WORKGROUP"
echo "Update workgroup done"
pause>nul
echo.

