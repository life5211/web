@echo off
title svn sync
chcp 65001

set st=false
for /f "tokens=1-2 delims= " %%a in  ('svn st') do (
  set st=true
  if "%%a"=="!" svn delete %%b
)

:: for /f "tokens=1,2 delims= " %%i in ('svn st') do (
::   if "%%i" == "?" ( svn add "%%j" )
::   else if "%%i" == "A" ( svn add "%%j" )
::   else if "%%i" == "!" ( svn del "%%j"  --force  )
::   else if "%%i" == "C" ( exit  )
:: )

if %st% == true (
    svn add * --force
    svn update
    svn commit -m "update by svn.bat"
) else (
    svn update
)
