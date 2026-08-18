// javascript:
(function () {
  const util = {
    val(val) {
      if (['number', 'string', 'boolean'].includes(typeof val)) return val;
      if (!val) return '';
      if (val instanceof Date) return val.toLocaleDateString();
      return JSON.stringify(val);
    },
    downloadCsv(arr, fileName = '导出', titles) {
      if (!arr?.length) return alert("导出数据为空");
      if (!titles?.length) titles = [...new Set(arr.flatMap(obj => Object.keys(obj)))];
      let content = arr.map(stu => titles.map(title => `"${this.val(stu[title])}"`).join(",")).join("\r\n");
      let blob = new Blob([`\ufeff${titles.map(e => `"${e}"`).join(",")}\r\n${content}`], {type: "text/csv;charset=utf-8"});
      let link = document.createElement('a');
      link.download = `${fileName}details_${new Date().toLocaleString()}.csv`;
      link.href = URL.createObjectURL(blob);
      link.click();
    },
    flatObj(obj) {
      return (function flat(obj, pre, result) {
        Object.entries(obj).forEach(([k, val]) => {
          let preKey = pre ? `${pre}.${k}` : k;
          if (val && 'object' === typeof val) flat(val, preKey, result);
          else if (val || val === 0 || val === false) result[preKey] = val;
        });
        return result;
      })(obj, '', {});
    },
    async downloadExcel(objArr, fileName = '导出') {
      if (!objArr?.length) return alert("导出数据为空！");
      if (!window.XLSX) await fetch("https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js").then(r => r.text()).then(eval).catch(console.log);
      if (!window.XLSX) return this.downloadCsv(fileName, objArr);
      let workbook = XLSX.utils.book_new();
      let worksheet = XLSX.utils.json_to_sheet(objArr);
      XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
      XLSX.writeFile(workbook, `${fileName}export${new Date().toLocaleString()}.xlsx`);
    }
  };
  let rst = Array.from({length: 100}).map((e, i) => window[`temp${100 - i}`]).find(e => e);
  util.downloadCsv(rst.map(util.flatObj))
})();
