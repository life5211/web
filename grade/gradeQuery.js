// ==UserScript==
// @name         南充中考成绩采集
// @namespace    ncjypt
// @version      0.1
// @description  高效、快捷成绩查询与采集
// @match        https://www.ncjypt.com/*
// @match        *ncjypt.com/*
// ==/UserScript==

(function () {
  'use strict';
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
    let qryStudents = studentsInfo.filter(s => s?.身份证号 && !gradesInfo[s.身份证号]);
    if (!qryStudents?.length) return;
    location.href = `https://www.ncjypt.com/nczk/zk/queryscoreby2img.asp?t=${qryStudents[0].准考证号},${qryStudents[0].姓名},${qryStudents[0].身份证号}`
  }, 500 + Math.random() * 3000);

})();

(function (excel) {
  const students = excel.split("\n").map(stu => stu.split("\t")).sort((a, b) => Math.random() - 0.3)
    .map((stu, i) => ({ 姓名: stu[0], 身份证号: stu[1], 准考证号: stu[2], i }));
  localStorage.setItem("students_info", JSON.stringify(students));
})(`利小曼\t511321200909296786\t24050404512\t1
赵国松\t511321200808136775\t24050405224\t2
赵丽\t511321200811136784\t24050401111\t3
曾嘉怡\t51142120071119750X\t24050401220\t4
赵海周\t511321200911096775\t24050401721\t5
赵锦华\t511321200909276785\t24050401615\t6
何文涛\t511321200810106778\t24050400526\t7
何毅\t511321200902136798\t24050401809\t8
何佳涛\t511321200812216778\t24050400212\t9
岳国才\t511321200903016771\t24050404709\t10
任海瑶\t511321200709248245\t24050401917\t11
何雨馨\t511321200901296802\t24050400713\t12
闫妍\t51132120080808678X\t24050400426\t13
刘兰兰\t511321200909036781\t24050404827\t14
赵怡婷\t511321200901186785\t24050405013\t15
岳红明\t51132120090131680X\t24050400627\t16
何睿\t511321200807246796\t24050404415\t17
李玲玉\t511321200908106784\t24050405517\t18
何玉瑶\t511321200906146803\t24050405328\t19
向欣萍\t511321200806046784\t24050402022\t20
何广能\t511321200808216775\t24050400310\t21
向磊\t511321200809236794\t24050400827\t22
赵紫羽\t511321201002176780\t24050405419\t23
赵仕杰\t511321200807106777\t24050404306\t24
赵文斌\t511321200810216774\t24050405805\t25
向俊豪\t511321200904226770\t24050401002\t26
赵仙宇\t511321200807306787\t24050401321\t27
冯小凤\t511321200811246780\t24050401425\t28
向恒兵\t511321200806246778\t24050404928\t29
刘紫侗\t511321200809056777\t24050400925\t30
向一凡\t511321200812116777\t24050405905\t31
向前\t511321200902136771\t24050405730\t32
向康\t511321200806256773\t24050400102\t33
利青\t511321200702136777\t24050404609\t34
赵林\t511321200902066777\t24050405128\t35
向艺\t511321200904236776\t24050401522\t36
岳天宏\t511321200907306776\t24050405622\t37`)

javascript: (function () {
  let grades = Object.values(JSON.parse(localStorage.getItem("grades_info")) || {});
  if (!grades.length) return alert("无成绩数据");
  const titles = [...new Set(grades.flatMap(s => Object.keys(s)))];
  let studentstring = grades.map(s => titles.map(col => `"\t${s[col]}"`).join(",")).join("\n");
  (function downloadCsv(fileName, content) {
    let blob = new Blob([`\ufeff${content}`], { type: "text/csv;charset=utf-8" });
    const csvUrl = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.download = `${fileName}details_${new Date().getTime()}.csv`;
    link.href = csvUrl;
    link.click();
  })("学生成绩单", `${titles.join(",")}\n${studentstring}`);
})()

javascript: (async function downloadExcel(fileName, objArr) {
  if (!objArr?.length) return alert("导出数据为空！");
  (await fetch("https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js")).text().then(js => {
    eval(js);
    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.json_to_sheet(objArr);
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
    XLSX.writeFile(workbook, `${fileName}details_${new Date().getTime()}.xlsx`);
  })
})("理科本科录取数据", Object.values(JSON.parse(localStorage.getItem("grades_info")) || {}));