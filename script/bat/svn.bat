@echo off
title svn sync

chcp 65001
set f=false
for /f "tokens=1-2 delims= " %%a in  ('svn st') do (
    f = true
    if "%%a"=="!" svn delete %%b
)
if %f% == true (
    svn add * --force
    svn update
    svn commmit -m "update by svn.bat"
) else (
    svn update
)
