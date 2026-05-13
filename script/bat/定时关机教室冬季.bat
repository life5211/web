schtasks /delete /tn "daily1shutdown" /f
schtasks /delete /tn "daily2shutdown" /f
schtasks /delete /tn "daily3shutdown" /f

schtasks /create /tn "daily1shutdown" /tr "shutdown /s /t 300" /sc daily /st 12:10:00
schtasks /create /tn "daily2shutdown" /tr "shutdown /s /t 300" /sc daily /st 17:10:00
schtasks /create /tn "daily3shutdown" /tr "shutdown /s /t 300" /sc daily /st 20:20:00
