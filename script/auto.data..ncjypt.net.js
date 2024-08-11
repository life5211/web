// ==UserScript==
// @name         南充中考成绩采集
// @namespace    ncjypt
// @version      1.1
// @description  高效、快捷成绩查询与采集
// @match        https://www.ncjypt.com/*
// @match        *ncjypt.com/*
// ==/UserScript==

function collect() {
  setTimeout(_ => {
    if (document.querySelector("table.textbox>tbody")?.innerText?.includes("还未开通成绩查询")) return;
    let studentsInfo = JSON.parse(localStorage.getItem("students_info") || "[]");
    const gradesInfo = JSON.parse(localStorage.getItem("grades_info") || "{}");
    if (location.pathname.startsWith("/nczk/zk/queryscoreby2img.asp")) {
      let nameIds = document.querySelector("div#studentname")?.innerText;
      let idNumber = nameIds.substr(-19, 18);
      let stuFilter = studentsInfo?.filter(s => s?.身份证号?.trim() === idNumber);
      const stuObj = stuFilter?.length ? stuFilter[0] : {};
      //单科成绩采集
      const grades = Array.from(document.querySelectorAll("table.tabscore td")).filter(e => e && e.innerText).map(e => e.innerText);
      for (let i = 0; i < grades.length; i++) if (!(i % 2)) stuObj[grades[i]] = grades[i + 1];
      for (let i = 0; i < grades.length; i++) if (isNaN(grades[i]) && !isNaN(grades[i + 1])) stuObj[grades[i]] = grades[i + 1];
      stuObj.Name = nameIds.substring(0, nameIds.indexOf("("));
      stuObj.IdNumber = idNumber;
      stuObj.GredeText = document.querySelector("table.tabscore").innerText;
      gradesInfo[idNumber] = stuObj;
      localStorage.setItem("grades_info", JSON.stringify(gradesInfo));
    }
    dataShow();
    let qryStudents = studentsInfo.filter(s => s?.身份证号 && !gradesInfo[s.身份证号]);
    if (!qryStudents?.length) return;
    location.href = `https://www.ncjypt.com/nczk/zk/queryscoreby2img.asp?t=${qryStudents[0].准考证号},${qryStudents[0].姓名},${qryStudents[0].身份证号}`
  }, 500 + Math.random() * 3000);
}

if (sessionStorage.getItem("collect_state")) collect();

(await fetch("https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js")).text().then(eval);

const div = document.createElement("div");
div.innerHTML = `信息导入<input type="file" onchange="importStuInfo()"/> 
<button onclick="downloadExcel(false)">信息导入模板</button> 
<button onclick="downloadExcel(true)">查询结果导出</button>
<span id="num"></span>
<button onclick="collectionStateChange()" id="coll">开始采集</button>
<hr/>
`;
document.body.insertBefore(div, document.body.firstChild);

document.importStuInfo = async function () {
  const file = target.files[0];
  const wb = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = e => resolve(XLSX.read(e.target.result, {type: 'binary', cellDates: true, cellText: false}));
  });
  const xlsxArray = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {row: false, dateNF: 'yyyy/m/d'});
  localStorage.setItem("students_info", JSON.stringify(xlsxArray));
  dataShow();
}

function dataShow() {
  document.querySelector('div#num').innerHTML = `<span>查询结果：${JSON.parse(localStorage.getItem("students_info"))?.length || 0}</span>
/<span>${JSON.parse(localStorage.getItem("grades_info"))?.length || 0}</span>`
}

function collectionStateChange() {
  if (sessionStorage.getItem("collect_state")) {
    sessionStorage.removeItem("collect_state")
  } else {
    sessionStorage.setItem("collect_state", "run");
  }
  document.querySelector("button#coll").innerText = sessionStorage.getItem("collect_state") ? `暂停采集` : '开始采集';
  collect();
}

document.downloadExcel = async function (f) {
  // (await fetch("https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js")).text().then(eval);
  let fileName = f ? "学生中考成绩单" : "中考学生信息导入模板",
      objArr = f ? Object.values(JSON.parse(localStorage.getItem("grades_info")) || {}) : [{姓名: '', 身份证号: '', 准考证号: ''}];
  if (!objArr?.length) return alert("导出数据为空！");
  let workbook = XLSX.utils.book_new();
  let worksheet = XLSX.utils.json_to_sheet(objArr);
  XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
  XLSX.writeFile(workbook, `${fileName}details_${Date.now()}.xlsx`);
}

// (function (excel) {//学生信息导入
//   const students = excel.split("\n").map(stu => stu.split("\t")).sort((a, b) => Math.random() - 0.3)
//       .map((stu, i) => ({姓名: stu[0], 身份证号: stu[1], 准考证号: stu[2], i}));
//   localStorage.setItem("students_info", JSON.stringify(students));
// })(``)

// javascript: (function () {  // csv 导出
//   let grades = Object.values(JSON.parse(localStorage.getItem("grades_info")) || {});
//   if (!grades.length) return alert("无成绩数据");
//   const titles = [...new Set(grades.flatMap(s => Object.keys(s)))];
//   let studentstring = grades.map(s => titles.map(col => `"\t${s[col]}"`).join(",")).join("\n");
//   (function downloadCsv(fileName, content) {
//     let blob = new Blob([`\ufeff${content}`], {type: "text/csv;charset=utf-8"});
//     const csvUrl = URL.createObjectURL(blob);
//     let link = document.createElement('a');
//     link.download = `${fileName}details_${new Date().getTime()}.csv`;
//     link.href = csvUrl;
//     link.click();
//   })("学生成绩单", `${titles.join(",")}\n${studentstring}`);
// })()
