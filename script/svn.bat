cd "/IDEA-Workspace2/У԰����"
for /f "tokens=1-2 delims= " %%a in  ('svn st') do ( if "%%a"=="!" svn delete %%b  )
svn add * --force
svn up
svn ci -m "�Զ��ύ�����ļ�������ɾ�������޸�"
pause
