#!/bin/bash
folder=YunPan
cd "${folder}/"
funLog() {
  echo -e $(date "+[ %Y-%m-%d %H:%M:%S ] ") "  ==>>  " $* >>"../${folder}-run.log/"
  if [[ $1 != 0 ]]; then
    echo -e " [[ Error ]] $* " >>"../${folder}-Error.log/"error.log
    exit 1
  fi
}
svn log
funLog $? "���з��������Ӳ���"
result=$(svn status)
if [[ $result ]]; then
  funLog 0 "[Info]\\n $result"
  #  funLog 0 "Add force to svn"
  svn add . --force
  delFiles=$(svn status | grep '^\!')
  if [[ $delFiles ]]; then
    #  SVNɾ������ȱʧ�ļ�
    svn st | grep '^\!' | sed 's/^! */"/' | sed 's/$/"/g' | xargs svn del --force
    #    svn st | grep '^\!' | tr '^\!' ' ' | sed 's/^ *//' | sed 's/[ ]/\\ /g' | sed 's/[\]/\//g' | xargs svn del --force
    #    svn st | grep '^\!' | sed 's/^! *//' | sed 's/[ ]/\\ /g' | sed 's/[\]/\//g' | xargs svn del --force
    #    svn st | grep '^\!' | awk '{print $2}' | sed 's/[\]/\//g' | sed 's/[ ]/\\ /g' | xargs svn del --force
  fi
  #ͬ�������ز����ύ���ֿ�
  svn update
  svn commit . -m "�ű��Զ�ͬ��"
  funLog $? "\n�ű��Զ��ύ���汾��"
#  funLog $? "\n $(svn commit . -m "�ű��Զ�ͬ��") \n�ű��Զ��ύ���汾��"
else
  svn update
  funLog $? "����û�и���,ͬ��vs����"
fi
