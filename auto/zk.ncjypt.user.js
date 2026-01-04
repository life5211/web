// ==UserScript==
// @name         南充中考成绩采集
// @icon         https://zk.ncedu.net.cn/nczk/png/logo-zk.png
// @namespace    nczk
// @version      1.17
// @description  高效、快捷、批量成绩查询与采集
// @downloadURL  https://life5211.github.io/web/auto/zk.ncjypt.user.js
// @updateURL    https://life5211.github.io/web/auto/zk.ncjypt.user.js
// @match        https://www.ncjypt.com/*
// @match        *ncjypt.com/*
// @match        https://zk.ncedu.net.cn/*
// @match        *zk.ncedu.net.cn/*
// ==/UserScript==

(function () {
  let studentsGrades, titles, studentsArr, gradesObj, next;

  function getGrades() {
    studentsArr = JSON.parse(localStorage.getItem("students_info") || "[]");
    gradesObj = JSON.parse(localStorage.getItem("grades_info") || "{}");
    studentsGrades = studentsArr.map(stu => Object.assign({}, stu, gradesObj[stu.IdNo]));
    titles = ["Name", "IdNo", "ExamNo", ...new Set(Object.values(gradesObj).flatMap(grade => Object.keys(grade)))];
    next = studentsArr.filter(s => s?.IdNo && !gradesObj[s.IdNo]).pop();
    dataShow();
    console.log([studentsGrades, titles, studentsArr, gradesObj, next]);
    return [studentsGrades, titles, studentsArr, gradesObj];
  }

  function collect() {
    if (!sessionStorage.getItem("collect_state")) return;
    if (!location.pathname.startsWith("/nczk/zk/queryscoreby2img.asp")) return;
    if (document.querySelector("#showInfo>table")?.innerText?.includes("还未开通成绩查询")) return;

    let name = document.querySelector("tr.tr-02>.tdvalue")?.innerText;
    // if (!name) return alert("数据查询失败，请重试！");
    // let idNumber = nameIds.substr(-19, 18);
    let stuFilter = studentsArr?.filter(s => s?.Name?.trim() === name);
    const stuObj = stuFilter?.length ? stuFilter[0] : {};
    //单科成绩采集
    const grades = Array.from(document.querySelectorAll("div.infobox>table>tbody td")).filter(e => e && e.innerText).map(e => e.innerText);
    for (let i = 0; i < grades.length; i++) if (!(i % 2)) stuObj[grades[i]] = grades[i + 1];
    for (let i = 0; i < grades.length; i++) if (isNaN(grades[i]) && !isNaN(grades[i + 1])) stuObj[grades[i]] = grades[i + 1];
    stuObj.Name = name
    stuObj.GredeText = document.querySelector("div.infobox>table").innerText;
    gradesObj[stuObj.IdNo] = stuObj;
    localStorage.setItem("grades_info", JSON.stringify(gradesObj));
    getGrades();
    // 下一个考生成绩
    if (!studentsArr?.length) return alert("请导入考生名单");
    if (!next) return alert("采集完成");
    setTimeout(_ => location.href = `/nczk/zk/queryscoreby2img.asp?t=${next.ExamNo},${encodeURI(next.Name)},${next.IdNo}`, Math.random() * 1500 + 600);
  }

  if (window.top === window) {
    const div = document.createElement("div");
    div.innerHTML = `<div>
    <textarea id="stuInfos" rows="2" cols="30" placeholder="学生信息表.csv中内容复制粘贴后点击导入"></textarea>
    <button onclick="importStuInfo()">信息导入</button> 
    <button onclick="downloadExportCsv()">查询结果导出</button>
    <button onclick="collectionStateChange()" id="coll">开始采集</button>
    <hr/>
    <div id="result" style="max-height: 300px; overflow: auto"></div>
    <hr/>
</div>`;
    document.body.insertBefore(div, document.body.firstChild);
  }
  getGrades();
  collect();

  function getVal(obj, k, f) {
    if (obj[k] instanceof Date) return obj[k].toLocaleDateString();
    // if (f && /\d{8,}/.test(obj[k])) return `${obj[k]}`;
    if (k in obj) return obj[k];
    return "";
  }

  function dataShow() {
    document.querySelector("button#coll").innerText = sessionStorage.getItem("collect_state") ? `暂停采集` : '开始采集';
    if (!studentsGrades?.length) return;
    document.querySelector('div#result').innerHTML = `<span>查询结果：${Object.values(gradesObj)?.length}</span>/<span>${studentsArr?.length || 0}</span>
        <table border="1" style="border-collapse: collapse;border: 2px solid rgb(140 140 140);">
            <thead><tr>${titles.map(k => '<th>' + k + '</th>')}</tr></thead>
            <tbody>
            ${studentsGrades.map(stu => '<tr>' + titles.map(k => '<td>' + getVal(stu, k) + '</td>') + '</tr>').join("")}
            </tbody>
        </table>`;
  }


  document.collectionStateChange = function () {
    if (sessionStorage.getItem("collect_state")) {
      sessionStorage.removeItem("collect_state")
    } else {
      sessionStorage.setItem("collect_state", "run");
      collect();
    }
    dataShow();
  }

  document.importStuInfo = function () {
    importParse(document.getElementById("stuInfos").value);
  }

  function importParse(infoTxt) {
    if (!infoTxt?.trim()) return alert("信息為空信息为空");
    let stu = infoTxt.trim().split("\n")
        .map((s) => s.split(/\s/))
        .filter((s) => (s.length > 3) && s[5]?.length === 18)
        .map(s => ({Name: s[6], ExamNo: s[24], IdNo: s[5]}));
    localStorage.setItem("students_info", JSON.stringify(stu));
    getGrades();
  }

  document.downloadExportCsv = function () {
    // csv 导出
    if (!studentsGrades.length) return alert("无成绩数据");
    let student_string = studentsGrades.map(stu => titles.map(title => `${getVal(stu, title, true)}`).join("\t")).join("\r\n");
    (function downloadCsv(fileName, content) {
      let blob = new Blob([`\ufeff${content}`], {type: "text/csv;charset=utf-8"});
      let link = document.createElement('a');
      link.download = `${fileName}details_${new Date().toLocaleString()}.csv`;
      link.href = URL.createObjectURL(blob);
      link.click();
    })("学生中考成绩单", `${titles.join("\t")}\r\n${student_string}`);
  }


  // 学生信息采集
  if (location.pathname !== '/nczk/admin/querystudent.asp') return;
  let span = document.createElement("span");
  span.innerHTML = `<input type="button" value="自动导入基础信息" class="butquery command" id="autoSync">`;
  document.querySelector("input.butquery.command").after(span);
  span.addEventListener("click", async function (params) {
    let sid = document.getElementById("selectschoolid").value;
    let tid = document.getElementById("selecttestid").value;
    if (!tid) return alert("请选择考试名称");
    let grade = document.getElementById("schoolgrade").value;
    if (!grade) return alert("请选择年级");
    let rsp = await fetch(`/nczk/admin/asp/querystudentinfo_e.asp?tid=${tid}&grade=${grade}&cid=&sid=${sid}&class=&key=&page=1&apply=0&poor=0&timestamp=${Date.now()}`);
    if (!rsp.ok) return console.log(rsp.statusText);
    let text = await rsp.text();    // f0,temp/a8abb4bb284b5b27aa7cb790dc20f80b_学生信息表.csv
    if (!text) return console.log("未获取到下载链接0");
    let strings = text.split(",");
    if (!strings[1]) return console.log("未获取到下载链接1");
    // https://zk.ncedu.net.cn/nczk/admin/temp/a8abb4bb284b5b27aa7cb790dc20f80b_%E5%AD%A6%E7%94%9F%E4%BF%A1%E6%81%AF%E8%A1%A8.csv?timestamp=1766929664131
    let response = await fetch(`/nczk/admin/${encodeURI(strings[1])}?timestamp=${Date.now()}`);
    const decoder = new TextDecoder('gbk');
    localStorage.csv = decoder.decode(await response.arrayBuffer());
    importParse(localStorage.csv);
  });
})();
