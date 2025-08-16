// ==UserScript==
// @name         网络教研学习自动化
// @namespace    http://tampermonkey.net/
// @version      2.17.4
// @description  自动化播放网络教研视频，支持设置学科和已经播放的课程过滤
// @match        https://wljy.scjks.net/*
// @match        *wljy.scjks.net/*
// @icon         https://ascjkysvod.yscdn.top/upload/35/52970bea06a24874af80cd75492ead5e.png
// @downloadURL  https://life5211.github.io/web/auto/play.wljy.scjky.user.js
// @updateURL    https://life5211.github.io/web/auto/play.wljy.scjky.user.js
// @require      https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js
// @noframes
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_log
// ==/UserScript==

(async function () {
  let usrName, usrKey, user, allSubjects, needSubjects, learned_kcs, subjectId, subjectName, r, logK, logs, utils = {
    rf: (min, max) => 1000 * Math.floor(min + (max - min) * Math.random()),
    localGet: (k, def) => localStorage.hasOwnProperty(k) ? JSON.parse(localStorage.getItem(k)) : def,
    localSet: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
    updateUser: _ => utils.localSet(usrKey, user),
    run: (...fun) => fun.forEach(f => f()),
    compareFn(a, b, ...fields) {
      const fnc = (m, n) => m === undefined ? -1 : n === undefined ? 1 : m.localeCompare ? m.localeCompare(n) : m > n ? 1 : m < n ? -1 : 0;
      if (!fields?.length) return fnc(a, b);
      for (let f of fields) if (f && a[f] !== b[f]) return fnc(a[f], b[f]);
      return 0;
    },
    log(msg) {
      console.log(msg);
      logs.unshift([new Date().toLocaleString(), msg, location.href.replace(location.origin, '')]);
      this.localSet(logK, logs);
      document.getElementById("_logs").innerText = logs.map(JSON.stringify).join('\n');
    }
  }, all_kcs = utils.localGet("all_kcs", []);
  logK = `log_${location.hash}`;
  logs = utils.localGet(logK, []);

  document.i_1 = setInterval(function init() {
    usrName = document.querySelector("div.login-name").innerText;
    if (!usrName) return utils.log("用户未登录");
    clearInterval(document.i_1);
    usrKey = `${usrName}_info`;
    utils.localSet("usrKey", usrKey);
    subjectId = location.hash.substring(11);
    subjectName = all_kcs.filter(k => k.id === subjectId).reduce((a, b) => b?.name, {});
    user = utils.localGet(usrKey, {scriptKcIds: [], state: 1});
    if (!user.playLog) user.playLog = {}
    if (!user.join_kcs) user.join_kcs = [];
    utils.run(updateSubject, insertForm, showForm);
    utils.log("页面信息初始化完成");
    if (!user.state) return; // 暂停学习
    if (localStorage.getItem("_redirect"))
      setTimeout(redirectPage, utils.rf(3, 8));
    if (location.hash.startsWith("#/activity/"))
      document.i_2 = setInterval(studyFun, utils.rf(60, 80));
  }, utils.rf(1, 2));

  function studyFun() {
    if (!user.state) return; // 暂停学习
    let video = document.querySelector('video');
    if (!video) return utils.log("没有video媒体"); // 没在播放界面，不处理直接退出
    let recordList = Array.from(document.querySelectorAll("div.video-list div.record-list div.recode-item"));
    if (!recordList?.length) return nextProject("没有录播列表");
    if (!video.title) {
      video.muted = true;
      video.title = "脚本运行中";
      video.scrollIntoView({behavior: 'smooth'});
      utils.log("视频播放初始化完成");
      if (user.playLog[subjectId]) return setTimeout(function jump() {
        utils.log("恢复播放记录");
        recordList[user.playLog[subjectId].currIdx].click();
        setTimeout(video.play, utils.rf(2, 4));
        setTimeout(_ => video.currentTime = user.playLog[subjectId].currentTime, utils.rf(6, 8));
      }, utils.rf(3, 5));
    }
    let currIdx = recordList.map(e => e.className.includes("current")).indexOf(true);
    utils.log({t: video.currentTime, i: currIdx, subjectId, subjectName, usrName, length: video.duration});
    if (!video.paused) {// 正在播放，break，继续等待，否者判断暂停原因
      user.playLog[subjectId] = {currIdx, currentTime: video.currentTime, length: video.duration}
      return utils.updateUser();
    }
    if (document.querySelector("div.video-list div.live.current")) return recordList[0].click();
    if (video.ended) {
      user.playLog[subjectId] = {currIdx, currentTime: video.currentTime, length: video.duration}
      utils.updateUser();
      if (recordList[currIdx + 1]) return recordList[currIdx + 1].click(); // 单页多个视频 且存在下一个视频就播放
      return nextProject('课程学习完成');
    }
    if (video.paused) video.play().then(utils.log).catch(utils.log); // 意外暂停
  }

  /**
   * 下一个视频，用户加入播放或未学习学科视频
   */
  function nextProject(log = '下一课') {
    localStorage.setItem("_redirect", log);
    if (location.hash.startsWith("#/activity/")) {
      utils.log(subjectId, log, subjectName);
      user.scriptKcIds.push(subjectId);
      utils.updateUser();
      updateSubject();
      utils.log("页面视频播放完毕，下一条");
      document.querySelector("a[title=返回门户]").click();
      return;
    }
    setTimeout(redirectPage, utils.rf(3, 5))
  }

  function redirectPage() {
    if (location.hash.startsWith("#/Layout/index")) {
      // location.href = `/a//#/newResource/res-research?dingToken=${localStorage.Authorization.substring(7)}`;
      document.querySelector("div#index-head ul li.text-overflow>div").click();
      return setTimeout(window.close, utils.rf(3, 5));
    }
    if (location.hash.startsWith("#/newResource")) {
      let next;
      if (user.join_kcs?.length) next = user.join_kcs.pop();
      else if (needSubjects?.length) next = needSubjects[0];
      utils.updateUser();
      if (!next) {
        user.state = 0;
        utils.updateUser();
        utils.log("当前科目学习完成；");
      }
      localStorage.removeItem("_redirect");
      window.open(`/a/#/activity/${next.id}?dingToken=${localStorage.Authorization.substring(7)}`);
      return setTimeout(window.close, utils.rf(10, 15));
    }
  }

  function getMin(...arr) {
    return arr.map(s => {
      if (!s || s.includes('不足1分钟')) return 0;
      if (/^\d+(\.\d+)?$/.test(s)) return s * 1;
      if (/(\d+)小时(\d+)分钟/.test(s)) {
        let hm = s.replace(/(\d+)小时(\d+)分钟/, '$1;$2').split(';');
        return hm[0] * 60 + hm[1] * 1;
      }
      if (/^(\d+)分钟$/.test(s)) return s.replace(/(\d+)分钟/, '$1') * 1;
      return 0;
    });
  }

  /**
   * 更新数据
   */
  function updateSubject() {
    all_kcs.forEach(k => k.script = k.his = k.zbgk = k.dbgk = k.yjxs = '');
    all_kcs.filter(k => k.name.includes("普高新课程新教材培训")).forEach(k => k.s = 1);
    all_kcs.filter(k => user.scriptKcIds.includes(k.id)).forEach(k => k.script = k.his = 'script');
    if (user.playHistory)
      for (let re_his = /\n(.+)\n+(总计直播观看:\s*(.+分钟)\s*总计点播观看：\s*(.+分钟))/g; !!(r = re_his.exec(user.playHistory));)
        all_kcs.filter(k => k.name === r[1]).filter(k => k.his = r[2]).forEach(k => [k.zbgk, k.dbgk] = getMin(r[3], r[4]));
    if (user.certApply)
      for (let re_cert = /\n(.+)\n+(直播观看\s*(.+分钟)\s*点播观看\s*(.+分钟)\s*预计学时\s*([\d.]+))\n/g; !!(r = re_cert.exec(user.certApply));)
        all_kcs.filter(k => k.name === r[1]).filter(k => k.his = r[2]).forEach(k => [k.zbgk, k.dbgk, k.yjxs] = getMin(r[3], r[4], r[5]));
    if (user.certApplied)
      for (let re_cert_ed = /\n(.+)\n+(已发放学时\s*([\d.]+))\n/g; !!(r = re_cert_ed.exec(user.certApplied));)
        all_kcs.filter(k => k.name === r[1]).filter(k => k.his = r[2]).forEach(k => [k.yjxs] = getMin(r[3]));
    learned_kcs = all_kcs.filter(k => k.his);
    let learned_kcsIds = learned_kcs.map(k => k.id);
    allSubjects = all_kcs.filter(k => !user.subject || k.name.includes(user.subject)).filter(k => !k.s);
    needSubjects = allSubjects.filter(k => !learned_kcsIds.includes(k.id));
  }

  function insertForm() {
    if (document.getElementById('insertDiv')) return;
    const div = document.createElement("div");
    document.body.insertBefore(div, document.body.firstChild);
    div.innerHTML = `<div style="width: 100%;max-height: 400px;overflow: auto;margin-top: 66px;text-align: -webkit-center;" id="insertDiv">
  <table>
    <tr>
      <td>
        <div>主动学习列表</div>
        <div><select id="join_kcs" style="width: 120px"></select></div>
        <div>
          <input type="text" list="all_kcs" id="form_join" placeholder="选择加入学习列表">
          <datalist id="all_kcs"></datalist>
        </div>
        <div>
          <button onclick="infoUp(4)">加入主动学习</button>
        </div>
      </td>
      <td>
        <div><label>未学习</label> <select id="noStudy" style="width: 120px"></select></div>
        <div><label>已学习</label> <select id="learned" style="width: 120px"></select></div>
      </td>
      <td>
        <input placeholder="eg:语文/高中语文" id="form_subject"/>
        <div>任教科目
          <button onclick="infoUp(1)">&nbsp;设&nbsp;置&nbsp;</button>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <textarea id="form_playHistory" rows="2" cols="30"></textarea>
        <div>观看记录
          <button onclick="infoUp(2)">&nbsp;设&nbsp;置&nbsp;</button>
        </div>
      </td>
      <td>
        <textarea id="form_certApply" rows="2" cols="30"></textarea>
        <div>证书申请(可申请)
          <button onclick="infoUp(3)">&nbsp;设&nbsp;置&nbsp;</button>
        </div>
      </td>
      <td>
        <textarea id="form_certApplied" rows="2" cols="30"></textarea>
        <div>证书申请(已获得)
          <button onclick="infoUp(5)">&nbsp;设&nbsp;置&nbsp;</button>
        </div>
      </td>
    </tr>
    <tr>
      <td style="width:8em" colspan="3">
        <div onclick="downLog()">
          <button>导出学习记录</button>
        </div>
        待学习<span id="info0">0/0</span>
        <div>
          <button id="study_state" onclick="infoUp(0)">开始运行</button>
          <button onclick="fNext()">下一课程</button>
        </div>
      </td>
    </tr>
    <tr><td colspan="3">
        <hr/>
          页面运行日志<div><pre id="_logs"></pre></div>
        <hr/>
    </td></tr>
  </table>
  <table border="1" style="border-collapse: collapse;border: 2px solid rgb(140 140 140);">
    <caption>四川省网络教研平台学习记录表</caption>
    <thead>
    <tr>
      <th>课程时间</th>
      <th>ID</th>
      <th>课程名称</th>
      <th>学时</th>
      <th>直播</th>
      <th>回放</th>
      <th>脚本</th>
      <th>记录</th>
    </tr>
    </thead>
    <tbody id="learnedTable"></tbody>
  </table>
</div>`;
  }

  document.infoUp = function (n) {
    if (n === 0) user.state = !user.state;
    else if (n === 1) user.subject = document.getElementById("form_subject").value;
    else if (n === 2) user.playHistory = document.getElementById("form_playHistory").value;
    else if (n === 3) user.certApply = document.getElementById("form_certApply").value;
    else if (n === 5) user.certApplied = document.getElementById("form_certApplied").value;
    else if (n === 4) {
      let joinTxt = document.getElementById("form_join").value;
      let kcs = all_kcs.filter(k => k.name.includes(joinTxt));
      if (kcs.length !== 1) return alert(`搜索结果数量：【${kcs.length}】`);
      user.join_kcs.push(kcs[0]);
    }
    utils.run(utils.updateUser, updateSubject, showForm, studyFun);
  }
  document.fNext = _ => nextProject('手动点击');
  document.downLog = _ => downloadExcel(`${usrName}网络教研`, learned_kcs);

  function showForm() {
    document.getElementById("info0").innerText = ` ${needSubjects.length} / ${allSubjects.length} `;
    document.getElementById("form_subject").value = user.subject || '';
    document.getElementById("form_playHistory").value = user.playHistory || '';
    document.getElementById("form_certApply").value = user.certApply || '';
    document.getElementById("form_certApplied").value = user.certApplied || '';
    document.getElementById("study_state").innerText = `${user.state ? '暂停' : '开始'}运行`;
    document.getElementById("learned").innerHTML = learned_kcs.map(k => `<option value="${k.id}">${k.name}</option>`).join('\n');
    document.getElementById("noStudy").innerHTML = needSubjects.map(k => `<option value="${k.id}">${k.name}</option>`).join('\n');
    document.getElementById("join_kcs").innerHTML = user.join_kcs?.map(k => `<option value="${k.id}">${k.name}</option>`).join('\n');
    document.getElementById("all_kcs").innerHTML = all_kcs.map(k => `<option value="${k.name}">${k.id}</option>`).join('\n');
    document.getElementById('learnedTable').innerHTML = learned_kcs
        .map(k => `<tr><td>${k.crt}</td><td>${k.id}</td><td>${k.name}</td><td>${k.yjxs}</td><td>${k.zbgk}</td><td>${k.dbgk}</td><td>${k.script}</td><td>${k.his}</td></tr>`).join('\n');
  }

  async function downloadExcel(fileName, objArr) {
    if (!objArr?.length) return alert("导出数据为空！");
    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.json_to_sheet(objArr);
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
    XLSX.writeFile(workbook, `${fileName}_${Date.now()}.xlsx`);
  }

  GM_registerMenuCommand("更新全部课程", getAllKcs, "");

  async function getAllKcs() {
    let rsp = await fetch("https://life5211.github.io/web/data/scjky.jy.json");
    if (!rsp.ok) utils.log(`"github请求失败-${rsp.statusText}`, true);
    let githubSubjects = await rsp.json();
    let length = githubSubjects.length;
    utils.localSet("_kc_github", githubSubjects);
    let ids = githubSubjects.map(k => k.id);

    let api = "/sd-api/event/resourcePageNew/selectTeachInfoByPage/0?catalogId=-1&gradeId=-1&labelId=-1&noteId=-1&queryType=0&resourceFamily=-1&resourceName=&resourceType=0&sortType=1&stageId=-1&subjectId=-1&versionId=-1";
    let init = {headers: {authorization: localStorage.Authorization}};
    let rsp2 = await fetch(`${api}&pageSize=100&pageNo=1`, init);
    if (!rsp2.ok) utils.log(`"课程列表请求失败，${rsp.statusText}`, true);
    let json = await rsp2.json();
    {
      utils.localSet("_kc_wljy", json);
      let subjects = json.data.resResourceList.map(e => ({id: e.id, name: e.name, crt: new Date(e.createTime).toLocaleString()}));
      let flag = false;
      for (let s of subjects) {
        if (ids.includes(s.id)) {
          flag = true;
          continue;
        }
        githubSubjects.push(s);
        ids.push(s.id);
      }
      all_kcs = githubSubjects;
      all_kcs.forEach(k => k.t = new Date(k.crt).getTime());
      all_kcs.sort((a, b) => -1 * utils.compareFn(a, b, 't', 'name'));
      all_kcs.forEach(k => delete k.t);
      utils.localSet("all_kcs", all_kcs);
      utils.run(updateSubject, insertForm, showForm);
    }
    utils.log(`课程更新完成，课程数量${length} - ${all_kcs.length}`);
  }
})();
