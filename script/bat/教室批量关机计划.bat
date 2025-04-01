schtasks /create /tn "daily1205shutdown" /tr "shutdown /s /t 300" /sc daily /st 12:00:00 
schtasks /create /tn "daily1215shutdown" /tr "shutdown /s /t 300" /sc daily /st 12:10:00 
schtasks /create /tn "daily1705shutdown" /tr "shutdown /s /t 300" /sc daily /st 17:00:00 
schtasks /create /tn "daily1745shutdown" /tr "shutdown /s /t 300" /sc daily /st 17:40:00 
schtasks /create /tn "daily2025shutdown" /tr "shutdown /s /t 300" /sc daily /st 20:20:00 
schtasks /create /tn "daily2105shutdown" /tr "shutdown /s /t 300" /sc daily /st 21:00:00 

@REM schtasks /change /tn "daily1205shutdown" /disable
@REM schtasks /change /tn "daily1745shutdown" /disable
@REM schtasks /change /tn "daily2105shutdown" /disable

@REM schtasks /change /tn "daily1215shutdown" /enable
@REM schtasks /change /tn "daily1705shutdown" /enable
@REM schtasks /change /tn "daily2025shutdown" /enable

@REM schtasks /change /tn "daily1215shutdown" /disable
@REM schtasks /change /tn "daily1705shutdown" /disable
@REM schtasks /change /tn "daily2025shutdown" /disable

@REM schtasks /change /tn "daily1205shutdown" /enable
@REM schtasks /change /tn "daily1745shutdown" /enable
@REM schtasks /change /tn "daily2105shutdown" /enable