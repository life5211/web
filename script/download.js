javascript:(async function downloadExcel(fileName, objArr) {
  if (!objArr?.length) return alert("导出数据为空！");
  (await fetch("https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"))
      .text().then(eval).then(js => {
    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.json_to_sheet(objArr);
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  })
})(`Result${new Date().toLocaleString().replaceAll(/[^\d]/g, '')}`, temp2);
