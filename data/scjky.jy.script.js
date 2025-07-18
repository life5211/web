// 获取所有课程列表
(async function () {
  let api = "/sd-api/event/resourcePageNew/selectTeachInfoByPage/0?catalogId=-1&gradeId=-1&labelId=-1&noteId=-1&queryType=0" +
      "&resourceFamily=-1&resourceName=&resourceType=0&sortType=1&stageId=-1&subjectId=-1&versionId=-1";
  return (await fetch(`${api}&pageSize=500&pageNo=1`, {headers: {authorization: localStorage.Authorization}})).json()
      .then(r => r.data.resResourceList.map(e => ({id: e.id, name: e.name, crt: new Date(e.createTime).toISOString()})));
})();

// 继续教育审批学时
fetch("https://api-credit.sctce.cn/api/app/EmployeeApply/check", {
  method: 'post',
  headers: {
    "Content-Type": "application/json",
    authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImJjODIzYjdhLTVmNjItNGI3MS1iMDBlLWIwMmQwMTA4ZTdiZCIsIlRlbmFudElkIjoiMSIsIlN5c1R5cGVzIjoiWzJdIiwiTG9naW5UZW5hbnRJZCI6IjEiLCJTdG9yZUlkIjoiIiwiVW5pdElkIjoiOTYyYzEyNWMtNTgxZS00OGE3LThlNzEtYWY0MDAxM2MzYmFlIiwiVW5pdE5hbWUiOiLljZfpg6jljr_lsI_lhYPkuaHlsI_lraYiLCJQcm92aW5jZUlkIjoiNTEiLCJQcm92aW5jZU5hbWUiOiLlm5vlt53nnIEiLCJDaXR5SWQiOiI1MTEzIiwiQ2l0eU5hbWUiOiLljZflhYXluIIiLCJDb3VudHlJZCI6IjUxMTMyMSIsIkNvdW50eU5hbWUiOiLljZfpg6jljr8iLCJBcmVhRnVsbE5hbWUiOiLlm5vlt53nnIEt5Y2X5YWF5biCLeWNl-mDqOWOvyIsIkNyZWRpdFVuaXRJZCI6IiIsIlVzZXJJZCI6ImJjODIzYjdhLTVmNjItNGI3MS1iMDBlLWIwMmQwMTA4ZTdiZCIsIlVzZXJOYW1lIjoiNTExMzIxMTAyNzIiLCJUcnVlTmFtZSI6IuWwj-WFg-S5oeWwj-WtpueuoeeQhuWRmCIsIlBob25lTnVtYmVyIjoiIiwiRW1haWwiOiIiLCJVc2VyVHlwZSI6IjQiLCJQaWMiOiIiLCJJc0RlZmF1bHRQd2QiOiJGYWxzZSIsIklzVXNlQ3JlZGl0UGxhdGZvcm0iOiJUcnVlIiwiSXNSc2oiOiJGYWxzZSIsIkxhc3RMb2dpblRpbWUiOiIyMDI0LTEwLTEzIDEwOjI1OjI5IiwiVGltZXN0YW1wIjoiMTcyODc4NjMyOTkyMSIsIlNpZ24iOiIxN2ZlOTBlNDBhNTViYzQ4ZGI4MjhlN2IwNjVmOTBkYSIsIm5iZiI6MTcyODc4NjMyOSwiZXhwIjoxNzI4ODcyNzI5LCJpc3MiOiJTY2hhbnkiLCJhdWQiOiJBbGxVc2VycyJ9.jAwfGeLoKSr0tFV1cx3SIOp8X_PlhRLudAjsLUXCPWQ"
  },
  body: JSON.stringify({
    id: "63b1eb75-57b2-485a-9516-b1dc00d13ec7",
    passed: true,
    remark: "",
    otherApplyIds: []
  })
}).then(console.log)

(async function downloadExcel(fileName, objArr) {
  if (!objArr?.length) return alert("导出数据为空！");
  (await fetch("https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js")).text().then(eval)
  let workbook = XLSX.utils.book_new();
  let worksheet = XLSX.utils.json_to_sheet(objArr);
  XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
  XLSX.writeFile(workbook, `${fileName}details_${Date.now()}.xlsx`);
})("教科院网课", ls2);
