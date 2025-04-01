schtasks /delete /tn "daily1205shutdown" /f
schtasks /delete /tn "daily1215shutdown" /f
schtasks /delete /tn "daily1705shutdown" /f
schtasks /delete /tn "daily1745shutdown" /f
schtasks /delete /tn "daily2025shutdown" /f
schtasks /delete /tn "daily2105shutdown" /f

schtasks /create /tn "daily1205shutdown" /tr "shutdown /s /t 300" /sc daily /st 12:10:00 
schtasks /create /tn "daily1705shutdown" /tr "shutdown /s /t 300" /sc daily /st 17:40:00 
schtasks /create /tn "daily2025shutdown" /tr "shutdown /s /t 300" /sc daily /st 21:00:00 