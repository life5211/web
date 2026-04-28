// ==UserScript==
// @name         网络教研学习
// @namespace    http://tampermonkey.net/
// @version      3.17
// @description  自动化播放网络教研视频，支持设置学科和已经播放的课程过滤
// @match        https://wljy.scsjky.cn/a*
// @match        *wljy.scjks.net/*
// @icon         https://ascjkysvod.yscdn.top/upload/35/52970bea06a24874af80cd75492ead5e.png
// @downloadURL  https://life5211.github.io/web/auto/play.wljy.scjky.user.js
// @updateURL    https://life5211.github.io/web/auto/play.wljy.scjky.user.js
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
  window.GMSetValue = unsafeWindow.GMSetValue = GM_setValue;
  window.GMGetValue = unsafeWindow.GMGetValue = GM_getValue;

  let usrName, usrKey, user, allSubjects, needSubjects, learned_kcs, subjectId, subjectName, r, logK, logs, utils = {
    rf: (min, max) => 1000 * Math.floor(min + (max - min) * Math.random()),
    q: selector => document.querySelector(selector),
    // localGet: (k, def) => localStorage.hasOwnProperty(k) ? JSON.parse(localStorage.getItem(k)) : def,
    // localSet: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
    localGet: (key, def = {}) => JSON.parse(GMGetValue(key, JSON.stringify(def))),
    localSet: (key, val) => GMSetValue(key, JSON.stringify(val)),
    $GmGet: (key, def = {}) => JSON.parse(GMGetValue(key, JSON.stringify(def))),
    $GmSet: (key, val) => GMSetValue(key, JSON.stringify(val)),
    updateUser: _ => utils.localSet(usrKey, user),
    run: (...fun) => fun.forEach(f => f()),
    runInterval: (handler, min = 40, max = 60) => setInterval(_ => setTimeout(handler, this.rf(min, max)), this.rf(min, max)),
    getDateStr: date => {
      if (!date) return '';
      date = new Date(date);
      const [fullYear, month, day] = [date.getFullYear(), `${date.getMonth() + 1}`.padStart(2, '0'), `${date.getDate()}`.padStart(2, '0')];
      return `${fullYear}-${month}-${day}`
    },
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
    (function () {
      if (new Date().toDateString() === user.updateDate) return;
      getAllKcs();
      getAllHistory();
      user.updateDate = new Date().toDateString();
      user.scriptKcIds = [];
    })();
    utils.run(utils.updateUser, updateSubject, insertForm, showForm);
    utils.log("页面信息初始化完成");
    if (!user.state) return; // 暂停学习
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
    utils.log(subjectId, log, subjectName);
    user.scriptKcIds.push(subjectId);
    utils.updateUser();
    updateSubject();
    utils.log("页面视频播放完毕，下一条");
    let next = null;
    if (user.join_kcs?.length) next = user.join_kcs.pop();
    else if (needSubjects?.length) next = needSubjects[0];
    utils.updateUser();
    if (!next) {
      user.state = 0;
      utils.updateUser();
      utils.log("当前科目学习完成；");
    } else
      window.open(`${location.pathname.length === 4 ? '/a/' : '/a//'}#/activity/${next.id}?dingToken=${localStorage.Authorization.substring(7)}`, "_top");
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
    all_kcs.forEach(k => k.yfxs = k.his = k.zbgk = k.dbgk = k.yjxs = k.s = '');
    all_kcs.filter(k => k.name.includes("普高新课程新教材培训")).forEach(k => k.s = 1);
    all_kcs.filter(k => k.name.includes("义教新修订教材教师培训")).forEach(k => k.s = 1);
    if (user.dateStart) all_kcs.filter(k => new Date(k.crt).getTime() < new Date(`${user.dateStart} 00:00:00`).getTime()).forEach(k => k.s = 1);
    if (user.dateEnd) all_kcs.filter(k => new Date(k.crt).getTime() > new Date(`${user.dateEnd} 23:59:59`).getTime()).forEach(k => k.s = 1);
    all_kcs.filter(k => user.scriptKcIds.includes(k.id)).forEach(k => k.his = 'script');
    if (user.playHistory)
      for (let re_his = /\n(.+)\n+(总计直播观看:\s*(.+分钟)\s*总计点播观看：\s*(.+分钟))/g; !!(r = re_his.exec(user.playHistory));)
        all_kcs.filter(k => k.name === r[1]).filter(k => k.his = r[2]).forEach(k => [k.zbgk, k.dbgk] = getMin(r[3], r[4]));
    if (user.certApply)
      for (let re_cert = /\n(.+)\n+(直播观看\s*(.+分钟)\s*点播观看\s*(.+分钟)\s*预计学时\s*([\d.]+))\n/g; !!(r = re_cert.exec(user.certApply));)
        all_kcs.filter(k => k.name === r[1]).filter(k => k.his = r[2]).forEach(k => [k.zbgk, k.dbgk, k.yjxs] = getMin(r[3], r[4], r[5]));
    if (user.certApplied)
      for (let re_cert_ed = /\n(.+)\n+(已发放学时\s*([\d.]+))\n/g; !!(r = re_cert_ed.exec(user.certApplied));)
        all_kcs.filter(k => k.name === r[1]).filter(k => k.his = r[2]).forEach(k => [k.yfxs] = getMin(r[3]));
    let getVal = (obj, ...keys) => keys.map(k => obj[k]);
    if (user.hisObj)
      all_kcs.filter(k => user.hisObj[k.id]).filter(k => k.his = 'his')
          .forEach(k => [k.zbgk, k.dbgk] = getVal(user.hisObj[k.id], 'live_study_time', 'record_study_time'));
    if (user.mayApply)
      all_kcs.filter(k => user.mayApply[k.id]).filter(k => k.his = 'may')
          .forEach(k => [k.userHour, k.maxHour] = getVal(user.mayApply[k.id], 'userClassHour', 'maxClassHour'));
    if (user.awarded)
      all_kcs.filter(k => user.awarded[k.id]).filter(k => k.his = 'result')
          .forEach(k => [k.userHour, k.maxHour, k.rstHour] = getVal(user.awarded[k.id], 'userClassHour', 'maxClassHour', 'result_class_hour'));
    all_kcs.filter(k => !k.rstHour).filter(k => k.userHour).filter(k => k.userHour < k.maxHour).forEach(k => k.his = '');
    learned_kcs = all_kcs.filter(k => k.his);
    let learned_kcsIds = learned_kcs.map(k => k.id);
    allSubjects = all_kcs.filter(k => !user.subject || k.name.includes(user.subject)).filter(k => !k.s);
    needSubjects = allSubjects.filter(k => !learned_kcsIds.includes(k.id));
  }

  function insertForm() {
    if (document.getElementById('insertDiv')) return;
    const div = document.createElement("div");
    document.body.insertBefore(div, document.body.firstChild);
    div.innerHTML = `<div style="width: 100%;max-height: 720px;overflow: auto;margin-top: 66px;text-align: -webkit-center;" id="insertDiv">
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
          <button onclick="infoUp(1)">设置</button>
        </div>
      </td>
      <td>
        <div>
          <span>课程时间</span>
          <div>开始<input type="date" id="date_s" onchange="infoUp(6)"></div>
          <div>结束<input type="date" id="date_e" onchange="infoUp(7)"></div>
          <button onclick="infoUp(8)">清空时间</button>
        </div>
        <div>
          <label><input type="radio" name="study_year" onchange="infoUp(2020)">2020-2021</label>
          <label><input type="radio" name="study_year" onchange="infoUp(2021)">2021-2022</label>
          <label><input type="radio" name="study_year" onchange="infoUp(2022)">2022-2023</label>
          <label><input type="radio" name="study_year" onchange="infoUp(2023)">2023-2024</label>
        </div>
        <div>
          <label><input type="radio" name="study_year" onchange="infoUp(2024)">2024-2025</label>
          <label><input type="radio" name="study_year" onchange="infoUp(2025)">2025-2026</label>
          <label><input type="radio" name="study_year" onchange="infoUp(2026)">2026-2027</label>
          <label><input type="radio" name="study_year" onchange="infoUp(2027)">2027-2028</label>
        </div>
        <div>
          <label><input type="radio" name="study_year" onchange="infoUp(2028)">2028-2029</label>
          <label><input type="radio" name="study_year" onchange="infoUp(2029)">2029-2030</label>          
          <label><input type="radio" name="study_year" onchange="infoUp(2030)">2030-2031</label>
          <label><input type="radio" name="study_year" onchange="infoUp(2031)">2031-2032</label>
         </div>
      </td>
      <td>
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
    <hr/>
    <tr>
      <td colspan="3">
        页面运行日志
        <div>
          <pre id="_logs"></pre>
        </div>
      </td>
    </tr>
  </table>
  <table border="1" style="border-collapse: collapse;border: 2px solid rgb(140 140 140);">
    <caption>课程列表</caption>
    <thead>
    <tr>
      <th>课程时间</th>
      <th>ID</th>
      <th>课程名称</th>
      <th>直播</th>
      <th>回放</th>
      <th>用户学时</th>
      <th>最大学时</th>
      <th>已发学时</th>
      <th>记录</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody id="learnedTable"></tbody>
  </table>
</div>`;
  }

  document.infoUp = function (n) {
    if (n === 0) user.state = !user.state;
    else if (n === 1) user.subject = document.getElementById("form_subject").value;
    // 搜索
    else if (n === 4) {
      let joinTxt = document.getElementById("form_join").value;
      let kcs = all_kcs.filter(k => k.name.includes(joinTxt));
      if (kcs.length !== 1) return alert(`搜索结果数量：【${kcs.length}】`);
      user.join_kcs.push(kcs[0]);
    }
    // 课程时间筛选设置
    else if (n === 6) user.dateStart = utils.q("#date_s").value.replaceAll(/\D/g, '-');
    else if (n === 7) user.dateEnd = utils.q("#date_e").value.replaceAll(/\D/g, '-');
    else if (n === 8) user.dateStart = user.dateEnd = utils.q("#date_s").value = utils.q("#date_e").value = "";
    else if (n > 2000) {
      user.dateStart = `${n}-09-01`;
      user.dateEnd = `${n + 1}-08-31`;
    }

    utils.run(utils.updateUser, updateSubject, showForm, studyFun);
  }
  document.fNext = _ => nextProject('手动点击');
  document.downLog = _ => downloadExcel(`${usrName}网络教研`, learned_kcs);
  document.reStudyKc = id => {
    let kcs = all_kcs.filter(k => k.id === id);
    if (kcs.length !== 1) return alert(`搜索结果数量：【${kcs.length}】`);
    user.join_kcs.push(kcs[0]);
    document.infoUp();
  };

  function showForm() {
    document.getElementById("info0").innerText = ` ${needSubjects.length} / ${allSubjects.length} `;
    document.getElementById("form_subject").value = user.subject || '';
    document.getElementById("date_s").value = utils.getDateStr(user.dateStart);
    document.getElementById("date_e").value = utils.getDateStr(user.dateEnd);
    document.getElementById("date_s").max = utils.getDateStr(user.dateEnd);
    document.getElementById("date_e").min = utils.getDateStr(user.dateStart);
    document.getElementById("study_state").innerText = `${user.state ? '暂停' : '开始'}运行`;
    document.getElementById("learned").innerHTML = learned_kcs.map(k => `<option value="${k.id}">${k.name}</option>`).join('\n');
    document.getElementById("noStudy").innerHTML = needSubjects.map(k => `<option value="${k.id}">${k.name}</option>`).join('\n');
    document.getElementById("join_kcs").innerHTML = user.join_kcs?.map(k => `<option value="${k.id}">${k.name}</option>`).join('\n');
    document.getElementById("all_kcs").innerHTML = all_kcs.map(k => `<option value="${k.name}">${k.id}</option>`).join('\n');
    document.getElementById('learnedTable').innerHTML = allSubjects.map(k => `<tr>
          <td>${k.crt}</td>
          <td>${k.id}</td>
          <td>${k.name}</td>
          <td>${k.zbgk}</td>
          <td>${k.dbgk}</td>
          <td>${k.userHour || ''}</td>
          <td>${k.maxHour || ''}</td>
          <td>${k.rstHour || ''}</td>
          <td>${k.his}</td>
          <td><a href="#" onclick="reStudyKc('${k.id}')">加入学习列表</a></td>
        </tr>`).join('\n');
  }

  async function downloadExcel(fileName, objArr) {
    if (!objArr?.length) return alert("导出数据为空！");
    if (!window.XLSX) await fetch("https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js").then(r => r.text()).then(eval).catch(console.log);
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(objArr), fileName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  GM_registerMenuCommand("更新全部课程", getAllKcs, "");
  GM_registerMenuCommand("更新个人播放记录", getAllHistory, "");
  let init = {headers: {authorization: localStorage.Authorization}};

  async function getAllKcs() {
    let api = "/sd-api/event/resourcePageNew/selectTeachInfoByPage/0?catalogId=-1&gradeId=-1&labelId=-1&noteId=-1&queryType=0&resourceFamily=-1&resourceName=&resourceType=0&sortType=1&stageId=-1&subjectId=-1&versionId=-1";
    let pageNo = 1, totalPage = 1000, total = 100000, length = all_kcs.length, pageSize = length > 1000 ? 20 : 500;
    while (all_kcs.length < total && pageNo <= totalPage) {
      let rsp = await fetch(`${api}&pageSize=${pageSize}&pageNo=${pageNo++}`, init);
      if (!rsp.ok) utils.log(`"课程列表请求失败，${rsp.statusText}`, true);
      let json = await rsp.json();
      total = json.data.accumulated;
      totalPage = Math.ceil(total / pageSize);
      let subjects = json.data.resResourceList.map(e => ({id: e.id, name: e.name, crt: new Date(e.createTime).toLocaleString()}));
      let ids = all_kcs.map(k => k.id);
      for (let s of subjects) {
        if (ids.includes(s.id)) continue;
        all_kcs.push(s);
        ids.push(s.id);
      }
      all_kcs.forEach(k => k.t = new Date(k.crt).getTime());
      all_kcs.sort((a, b) => -1 * utils.compareFn(a, b, 't', 'name'));
      all_kcs.forEach(k => delete k.t);
      utils.localSet("all_kcs", all_kcs);
      utils.run(updateSubject, insertForm, showForm);
    }
    utils.log(`课程更新完成，课程数量${length} - ${all_kcs.length}`);
  }

  async function getAllHistory() {
    let api = "/sd-api/event/statistics/optimize/history.data";
    let pageNo = 1, totalPage = 1000, count = 100000, pageSize = 20;
    user.hisObj = user.hisObj || {};
    while (pageNo <= totalPage && Object.keys(user.hisObj).length < count) {
      let rsp = await fetch(`${api}?&pageSize=${pageSize}&pageNo=${pageNo++}`, init);
      if (!rsp.ok) utils.log(`播放历史记录-请求失败，${rsp.statusText}`, true);
      let json = await rsp.json();
      count = json.totalDatas;
      totalPage = Math.ceil(count / pageSize);
      for (let h of json.data) {
        if (user.hisObj[h.id]) continue;
        user.hisObj[h.id] = h;
      }
    }
    let rsp = await fetch("/sd-api/event/classHour/getMayApplyAndAwardedEventNew", init);
    let json = await rsp.json();
    if (!rsp.ok) utils.log(`证书申请列表-请求失败，${rsp.statusText}`, true);
    [user.mayApply = [], user.awarded = []] = [json.data.mayApply.reduce(fun, {}), json.data.awarded.reduce(fun, {})];
    utils.run(utils.updateUser, updateSubject, insertForm, showForm);
    utils.log(`播放历史记录-证书申请列表-更新完成`);
  }

  function fun(obj, val) {
    obj[val.event_info_id] = val;
    return obj;
  }
})();
