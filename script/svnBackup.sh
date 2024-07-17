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
funLog $? "运行服务器连接测试"
result=$(svn status)
if [[ $result ]]; then
  funLog 0 "[Info]\\n $result"
  #  funLog 0 "Add force to svn"
  svn add . --force
  delFiles=$(svn status | grep '^\!')
  if [[ $delFiles ]]; then
    #  SVN删除本地缺失文件
    svn st | grep '^\!' | sed 's/^! */"/' | sed 's/$/"/g' | xargs svn del --force
    #    svn st | grep '^\!' | tr '^\!' ' ' | sed 's/^ *//' | sed 's/[ ]/\\ /g' | sed 's/[\]/\//g' | xargs svn del --force
    #    svn st | grep '^\!' | sed 's/^! *//' | sed 's/[ ]/\\ /g' | sed 's/[\]/\//g' | xargs svn del --force
    #    svn st | grep '^\!' | awk '{print $2}' | sed 's/[\]/\//g' | sed 's/[ ]/\\ /g' | xargs svn del --force
  fi
  #同步到本地并且提交到仓库
  svn update
  svn commit . -m "脚本自动同步"
  funLog $? "\n脚本自动提交到版本库"
#  funLog $? "\n $(svn commit . -m "脚本自动同步") \n脚本自动提交到版本库"
else
  svn update
  funLog $? "本地没有更新,同步vs数据"
fi
