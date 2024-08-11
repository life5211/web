(async function () {
  (await fetch("/sd-api/event/resourcePageNew/selectTeachInfoByPage/0?catalogId=-1&gradeId=-1&labelId=-1" +
          "&noteId=-1&pageNo=3&pageSize=500&queryType=0&resourceFamily=-1&resourceName=&resourceType=0" +
          "&sortType=1&stageId=-1&subjectId=-1&versionId=-1",
          {headers: {authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcGVuQWNjb3VudElkIjoiNzE5NTM1MjMxMDEwNDc2MDMyIiwidGVuYW50SWQiOiIwIiwicGxhdGZvcm1UeXBlIjoicGMiLCJpZCI6IjcxOTUzNTIzMTA3MzM5MDU5MyIsIm9wZW5Vc2VySW5mb0lkIjoiNzE3NDMzMDE4OTE0MDUxMTA1IiwidXNlck5hbWUiOiIxNTUyMDcyMjA1MiIsImV4cCI6MTcyNTA0MDgwMCwib3JnSWQiOiI0NDYwMTIzMTI1MjA4ODg2MTAiLCJ1c2VySW5mb0lkIjoiNzE5NTM1MjMxMDczMzkwNTkyIiwiY3JlYXRlVGltZXN0YW1wIjoiMTcyMjUyMDA0NTM4MiJ9.cEEp90pSH2e47nQhYSfUjuGZYN9ZdpihmgaXZZo_7hI"}})
  ).json().then(r => {
  })


  ;
})();


(async function downloadExcel(fileName, objArr) {
  if (!objArr?.length) return alert("导出数据为空！");
  (await fetch("https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js")).text().then(eval)
  let workbook = XLSX.utils.book_new();
  let worksheet = XLSX.utils.json_to_sheet(objArr);
  XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
  XLSX.writeFile(workbook, `${fileName}details_${Date.now()}.xlsx`);
})("教科院网课", ls2);
