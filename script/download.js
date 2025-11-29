// javascript:
(async function downloadExcelByXLSX(fileName, objArr) {
  if (!objArr?.length) return alert("导出数据为空！");
  if (!window.XLSX) await fetch("https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js").then(r => r.text()).then(eval).catch(console.log);
  let workbook = XLSX.utils.book_new();
  let worksheet = XLSX.utils.json_to_sheet(objArr);
  XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
})(`Result${new Date().toLocaleString().replaceAll(/[^\d]/g, '')}`, window.temp6 || window.temp5 || window.temp4 || window.temp3 || window.temp2 || window.temp1);
