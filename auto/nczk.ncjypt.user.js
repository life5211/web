// ==UserScript==
// @name         南充中考成绩采集
// @icon         https://zk.ncedu.net.cn/nczk/png/logo-zk.png
// @namespace    nczk
// @version      3.17
// @description  高效、快捷、批量成绩查询与采集
// @downloadURL  https://life5211.github.io/web/auto/nczk.ncjypt.user.js
// @updateURL    https://life5211.github.io/web/auto/nczk.ncjypt.user.js
// @match        https://zk.ncedu.net.cn/*
// @match        *zk.ncedu.net.cn/*
// @match        https://zk.ncedu.net.cn/nczk/zk/queryscoreby2img.asp
// @match        https://zk.ncedu.net.cn/nczk/zk/queryscoreby2img.asp*
// @match        https://zk.ncedu.net.cn/
// @include      https://zk.ncedu.net.cn/
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==
const util = {
  uuid: '_nczk',
  mathRandom() {
    return `${Math.random()}`.substr(2);
  },
  localSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    GM_setValue(key, JSON.stringify(value))
  },
  localGet(key, def) {
    return localStorage.hasOwnProperty(key) ? JSON.parse(localStorage.getItem(key)) : def;
  },
  // localGet: (key, def = {}) => JSON.parse(GM_getValue(key, JSON.stringify(def))),
  // localSet: (key, val) => GM_setValue(key, JSON.stringify(val)),
  getDateStr(date = new Date()) {
    const [fullYear, month, day] = [date.getFullYear(), `${date.getMonth() + 1}`.padStart(2, '0'), `${date.getDate()}`.padStart(2, '0')];
    return `${fullYear}-${month}-${day}`;
  },
  getTimeStr(date = new Date()) {
    return date.toTimeString().substring(0, 8);
  },
  getDateTimeStr(date = new Date()) {
    return this.getDateStr(date) + ' ' + this.getTimeStr(date);
  },
  getSearchParams(k) {
    let url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    return searchParams.get(k);
  },
  rf: (min, max) => Math.floor(1000 * (min + (max - min) * Math.random())),
  q: (selector, ele = document) => ele.querySelector(selector),
  qa: (selector, ele = document) => Array.from(ele.querySelectorAll(selector)),
  $GmGet: (key, def = {}) => JSON.parse(GM_getValue(key, JSON.stringify(def))),
  $GmSet: (key, val) => GM_setValue(key, JSON.stringify(val)),
  clearCookie() {
    GM_cookie.list({}, cookies => {
      if (!cookies.length) return util.log(`当前无Cookie`);
      cookies.push("UserToken");
      cookies.forEach(cookie => {
        GM_cookie.delete({
          url: location.origin,
          name: cookie.name,
          domain: cookie.domain,
          path: cookie.path
        }, delErr => {
          if (delErr) console.warn('删除失败：', cookie.name, delErr);
          else console.log('已删除：', cookie.name);
        });
      });
    });
  },
  log(msg, k = `log_${new Date().getDate()}`) {
    console.log(msg);
    let log = this.localGet(k, []);
    log.unshift(`[${new Date().toLocaleString()}]${JSON.stringify(msg)}`);
    this.localSet(k, log);
  }
};

window.GM_cookie = GM_cookie;

(function () {
  if (document.querySelector("iframe")) {
    return setTimeout(_ => Array.from(document.querySelectorAll("div[key=set]"))
        .forEach(e => e.parentNode.parentNode.insertAdjacentHTML('afterend', `<a href="${e.id}.asp?t=${Date.now()}" target="_blank">${e.innerText}</a>`)), 1001);
  }
  document.body.insertAdjacentHTML('afterbegin',
      `<div>
        <div>
        <textarea id="stuInfos" rows="2" cols="30" placeholder="学生信息表.csv中内容复制粘贴后点击导入"></textarea>
        <button onclick="importStuInfo()">CSV信息导入</button> 
        <button onclick="importStuInfo(1)">备份导出</button> 
        <button onclick="importStuInfo(2)">备份导入</button> 
        <button onclick="downloadExportCsv()">查询结果导出</button>
        <button onclick="collectionStateChange()" id="coll">开始采集</button>
        查询结果：<span id="s1"></span>/<span id="s2"></span>
        </div>
        <div id="result" style="max-height: 300px; overflow: auto"></div>
        <hr/>
      </div>`);


  let studentsGrades, titles, studentsArr, gradesObj, rstFlag, errInfo;

  function dateUpdateShow() {
    studentsArr = util.localGet("students_info", []);
    gradesObj = util.localGet("grades_info", {});
    rstFlag = util.localGet("rst_flag", {});
    errInfo = util.localGet("err_info", {});
    studentsGrades = studentsArr.map(stu => Object.assign({}, stu, gradesObj[stu.ExamNo]));
    titles = ["Name", "IdNo", "ExamNo", ...new Set(Object.values(gradesObj).flatMap(grade => Object.keys(grade)))];
    console.log([studentsGrades, titles, studentsArr, gradesObj]);
    //show view
    if (!document.getElementById("result")) return;
    document.querySelector("button#coll").innerText = sessionStorage.getItem("collect_state") ? `暂停采集` : '开始采集';
    if (!studentsGrades?.length) return;
    document.getElementById("s1").innerText = Object.keys(gradesObj)?.length;
    document.getElementById("s2").innerText = studentsArr?.length - Object.keys(errInfo)?.length;
    if (sessionStorage.getItem("collect_state")) return;
    document.querySelector('div#result').innerHTML = `
        <table border="1" style="border-collapse: collapse;border: 2px solid rgb(140 140 140);">
            <thead><tr>${'<th></th>' + titles.map(k => '<th>' + k + '</th>').join(" ")}</tr></thead>
            <tbody>
            ${studentsGrades.map(stu => '<tr><td><a href="/nczk/zk/queryscoreby2img.asp?t='
        + getVal(stu, 'ExamNo') + "," + getVal(stu, 'Name') + "," + getVal(stu, 'IdNo') + '">查询</a></td>'
        + titles.map(k => '<td>' + getVal(stu, k) + '</td>') + '</tr>').join(" ")}
            </tbody>
        </table>`;
  }

  function collect() {
    if (!location.pathname.startsWith("/nczk/zk/queryscoreby2img.asp")) return;
    let [ExamNo, ExamName, IdNo] = util.getSearchParams('t').split(',');
    if (document.querySelector("#showInfo>table")?.innerText?.includes("还未开通成绩查询")) {
      // '26050104919,王舒缘,511321201004089429'
      errInfo[ExamNo + IdNo] = 1;
      util.localSet("err_info", errInfo);
      util.log(`错误信息${location.search}`);
      nextStu();
    }
    let name = document.querySelector("tr.tr-02>.tdvalue")?.innerText;
    // if (!name) return alert("数据查询失败，请重试！");
    let stuFilter = studentsArr.filter(s => s.Name === ExamName && s.name === name).filter(s => s.IdNo === s.IdNo).filter(s => s.ExamNo === ExamNo);
    const stuObj = stuFilter?.length ? stuFilter[0] : {ExamNo, Name: ExamName, IdNo};
    //单科成绩采集
    const grades = Array.from(document.querySelectorAll("div.infobox>table>tbody td")).filter(e => e && e.innerText).map(e => e.innerText);
    for (let i = 0; i < grades.length; i++) if (!(i % 2)) stuObj[grades[i]] = grades[i + 1];
    for (let i = 0; i < grades.length; i++) if (isNaN(grades[i]) && !isNaN(grades[i + 1])) stuObj[grades[i]] = grades[i + 1];
    stuObj.Name = name
    stuObj.GredeText = document.querySelector("div.infobox>table").innerText;
    gradesObj[stuObj.ExamNo] = stuObj;
    rstFlag[stuObj.ExamNo] = rstFlag[stuObj.IdNo] = 1;
    util.localSet("grades_info", gradesObj);
    util.localSet("rst_flag", rstFlag);
    nextStu();
  }

  function nextStu() {
    dateUpdateShow();
    if (!sessionStorage.getItem("collect_state")) return;
    util.clearCookie();
    if (!studentsArr?.length) return alert("请导入考生名单");
    // 下一个考生成绩
    let nextStus = studentsArr.filter(s => s?.IdNo && !rstFlag[s.IdNo] && !rstFlag[s.ExamNo] && !errInfo[s.ExamNo + s.IdNo]);
    util.localSet("no_grades", nextStus);
    if (!nextStus?.length) return alert("采集完成");
    let next = nextStus[Math.floor(Math.random() * nextStus.length)]
    setTimeout(_ => location.href = `/nczk/zk/queryscoreby2img.asp?t=${next.ExamNo},${encodeURI(next.Name)},${next.IdNo}`, Math.random() * 1000 + 600);
  }

  dateUpdateShow();
  collect();

  document.collectionStateChange = function () {
    if (sessionStorage.getItem("collect_state")) sessionStorage.removeItem("collect_state")
    else sessionStorage.setItem("collect_state", "run");
    nextStu();
  }

  document.importStuInfo = function (p) {
    if (!p) importParse(document.getElementById("stuInfos").value);
    if (p === 1) {
      let out = {
        studentsArr: util.localGet("students_info", []),
        gradesObj: util.localGet("grades_info", {}),
        rstFlag: util.localGet("rst_flag", {}),
        errInfo: util.localGet("err_info", {})
      };
      document.getElementById("stuInfos").value = JSON.stringify(out);
    }
    if (p === 2) {
      let out = JSON.parse(document.getElementById("stuInfos").value);
      let studentsArr = util.localGet("students_info", []).concat(out.studentsArr);
      let gradesObj = Object.assign(util.localGet("grades_info", {}), out.gradesObj);
      let rstFlag = Object.assign(util.localGet("rst_flag", {}), out.rstFlag);
      let errInfo = Object.assign(util.localGet("err_info", {}), out.errInfo);
      util.localSet("students_info", uniqueObj(studentsArr, 'ExamNo', 'Name', 'IdNo'));
      util.localSet("grades_info", gradesObj);
      util.localSet("rst_flag", rstFlag);
      util.localSet("err_info", errInfo);
    }
  }

  function uniqueObj(arr, ...fields) {
   return  Object.values(arr.reduce((obj, b) => {
     obj[fields.map(f => b[f]).join("")] = b;
     return obj;
   }, {}));
  }

  function getVal(obj, k, val = obj[k]) {
    if (!(k in obj)) return '';
    if (['number', 'string', 'boolean'].includes(typeof val)) return val;
    if (obj[k] instanceof Date) return obj[k].toLocaleDateString();
    if (!val) return '';
    return JSON.stringify(val);
  }

  function importParse(infoTxt) {
    if (!infoTxt?.trim()) return alert("信息為空信息为空");
    let arr = infoTxt.trim().split(/\r?\n|\r/).map(s => s.split(/[\s,;]/));
    if (!arr.length) return alert("导入数据为零")
    let nameIdx = -1, idIdx = -1, examIdx = -1;
    arr[0].forEach((e, i) => {
      if (nameIdx < 0 && e.includes("姓名")) nameIdx = i;
      if (idIdx < 0 && e.includes("身份证")) idIdx = i;
      if (examIdx < 0 && e.includes("准考证号")) examIdx = i;
    });
    if (nameIdx < 0 || idIdx < 0 || examIdx < 0) return alert("姓名|身份证号|准考证号缺失");
    let stu = arr.filter(s => (s.length > 2) && s[idIdx]?.length === 18)
        .map(s => ({Name: s[nameIdx], IdNo: s[idIdx], ExamNo: s[examIdx]}));
    if (!stu.length) return alert("导入数据为零")
    util.localSet("students_info", uniqueObj(stu, 'ExamNo', 'Name', 'IdNo'));
    dateUpdateShow();
  }

  document.downloadExportCsv = function () {
    // csv 导出
    if (!studentsGrades.length) return alert("无成绩数据");
    let student_string = studentsGrades.map(stu => titles.map(title => `"${getVal(stu, title)}"`).join(",")).join("\r\n");
    (function downloadCsv(fileName, content) {
      let blob = new Blob([`\ufeff${content}`], {type: "text/csv;charset=utf-8"});
      let link = document.createElement('a');
      link.download = `${fileName}details_${new Date().toLocaleString()}.csv`;
      link.href = URL.createObjectURL(blob);
      link.click();
    })("学生中考成绩单", `${titles.join(",")}\r\n${student_string}`);
  }

  // 学生信息采集
  if (location.pathname !== '/nczk/admin/querystudent.asp') return;
  let span = document.createElement("span");
  span.innerHTML = `<input type="button" value="自动导入基础信息" class="butquery command" id="autoSync">`;
  document.querySelector("input.butquery.command").after(span);
  span.addEventListener("click", async function (params) {
    let sid = document.getElementById("selectschoolid").value;
    let tid = document.getElementById("selecttestid").value;
    if (!tid || tid === '0') return alert("请选择考试名称");
    let grade = document.getElementById("schoolgrade").value;
    let classId = document.getElementById('selectclassid').value;
    let rsp = await fetch(`/nczk/admin/asp/querystudentinfo_e.asp?tid=${tid}&grade=${grade}&cid=&sid=${sid}&class=${classId}&key=&page=1&apply=0&poor=0&timestamp=${Date.now()}`);
    if (!rsp.ok) return console.error(rsp.statusText);
    let text = await rsp.text();    // f0,temp/a8abb4bb284b5b27aa7cb790dc20f80b_学生信息表.csv
    if (!text) return console.error("未获取到下载链接0");
    let strings = text.split(",");
    if (!strings[1]) return console.error("未解析到下载链接1");
    // https://zk.ncedu.net.cn/nczk/admin/temp/a8abb4bb284b5b27aa7cb790dc20f80b_%E5%AD%A6%E7%94%9F%E4%BF%A1%E6%81%AF%E8%A1%A8.csv?timestamp=1766929664131
    let response = await fetch(`/nczk/admin/${encodeURI(strings[1])}?timestamp=${Date.now()}`);
    // const decoder = new TextDecoder('gbk');
    // localStorage.csv = decoder.decode(await response.arrayBuffer());
    let t = await response.text();
    util.localSet("csv", t);
    importParse(t);
  });
})();
