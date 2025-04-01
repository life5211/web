cd "/IDEA-Workspace2/校园云盘"
for /f "tokens=1-2 delims= " %%a in  ('svn st') do ( if "%%a"=="!" svn delete %%b  )
svn add * --force
svn up
svn ci -m "自动提交本地文件，包括删除新增修改"
pause
