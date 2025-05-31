schtasks /delete /tn "daily1205shutdown" /f
schtasks /delete /tn "daily1215shutdown" /f
schtasks /delete /tn "daily1705shutdown" /f
schtasks /delete /tn "daily1745shutdown" /f
schtasks /delete /tn "daily2025shutdown" /f
schtasks /delete /tn "daily2105shutdown" /f
schtasks /delete /tn "daily2141shutdown" /f

schtasks /create /tn "daily1215shutdown" /tr "shutdown /s /t 300" /sc daily /st 12:10:00 
schtasks /create /tn "daily1745shutdown" /tr "shutdown /s /t 300" /sc daily /st 17:40:00 
schtasks /create /tn "daily2105shutdown" /tr "shutdown /s /t 300" /sc daily /st 21:00:00 