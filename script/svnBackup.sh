#!/bin/bash
pth=$(pwd)
run_log="../${pth##*/}-script-run.log"
error_log="../${pth##*/}-script-error.log"
funLog() {
  echo $*
  echo -e $(date "+\r\n[ %Y-%m-%d %H:%M:%S ] ") "<<Info>> $(pwd)\r\n [[$*]]" >> ${run_log}
  if [[ $1 != 0 ]]; then
    svn status >> ${run_log}
    echo -e $(date "+\r\n[ %Y-%m-%d %H:%M:%S ] ") "<<Error>> $(pwd)\r\n [[$*]]" >> ${error_log}
    exit 1
  fi
}
svn log
funLog $? "Network Test"
svn status >> ${run_log}
result=$(svn status | grep ^[\?\!AMD])
if [[ $result ]]; then
  svn add . --force >> ${run_log}
  delFiles=$(svn status | grep '^\!')
  if [[ $delFiles ]]; then
    #  Delete local missing files by SVN
    svn st | grep '^\!' | sed 's/^! */"/' | sed 's/$/"/g' | xargs svn del --force
    #    svn st | grep '^\!' | tr '^\!' ' ' | sed 's/^ *//' | sed 's/[ ]/\\ /g' | sed 's/[\]/\//g' | xargs svn del --force
    #    svn st | grep '^\!' | sed 's/^! *//' | sed 's/[ ]/\\ /g' | sed 's/[\]/\//g' | xargs svn del --force
    #    svn st | grep '^\!' | awk '{print $2}' | sed 's/[\]/\//g' | sed 's/[ ]/\\ /g' | xargs svn del --force
  fi
  svn update >> ${run_log}
  svn commit . -m "Automatically upload to svn through script."
  funLog $? "Auto upload to svn through vs.bat."
else
  svn update >> ${run_log}
  funLog $? "No update locally, sync data by vs.bat"
fi
