#!/bin/bash
pth=$(pwd)
funLog() {
  echo $*
  echo -e $(date "+\r\n[ %Y-%m-%d %H:%M:%S ] ") "<<Info>>\r\n $*" >>"../${pth##*/}-script-run.log"
  if [[ $1 != 0 ]]; then
    echo -e $(date "+\r\n[ %Y-%m-%d %H:%M:%S ] ") "<<Error>>\r\n $*" >>"../${pth##*/}-script-error.log"
    exit 1
  fi
}
svn log
funLog $? "Network Test"
result=$(svn status)
if [[ $result ]]; then
  funLog 0 "[File Update Info]\\n $result"
  svn add . --force
  #  funLog 0 "SVN adds all modifications."
  delFiles=$(svn status | grep '^\!')
  if [[ $delFiles ]]; then
    #  Delete local missing files by SVN
    svn st | grep '^\!' | sed 's/^! */"/' | sed 's/$/"/g' | xargs svn del --force
    #    svn st | grep '^\!' | tr '^\!' ' ' | sed 's/^ *//' | sed 's/[ ]/\\ /g' | sed 's/[\]/\//g' | xargs svn del --force
    #    svn st | grep '^\!' | sed 's/^! *//' | sed 's/[ ]/\\ /g' | sed 's/[\]/\//g' | xargs svn del --force
    #    svn st | grep '^\!' | awk '{print $2}' | sed 's/[\]/\//g' | sed 's/[ ]/\\ /g' | xargs svn del --force
  fi
  svn update
  svn commit . -m "Automatically upload to svn through script."
  funLog $? "Automatically upload to svn through script."
#  funLog $? "\n $(svn commit . -m "Automatically upload to svn through script.") Automatically upload to svn through script."
else
  svn update
  funLog $? "No update locally, synchronizing data from VS."
fi
