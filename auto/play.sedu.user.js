// ==UserScript==
// @name         四川继教网学习
// @namespace    http://tampermonkey.net/
// @version      17.2
// @description  四川继续教育多课程自动连续播放
// @author       user
// @icon         https://www.sedu.net/apppc/login/static/jjw-bj-bf11c0d7.png
// @match        https://trplayer.sctce.cn/*
// @match        https://www.sedu.net/student/*
// @downloadURL  https://life5211.github.io/web/auto/play.sedu.user.js
// @updateURL    https://life5211.github.io/web/auto/play.sedu.user.js
// @noframes
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

(async function () {
  let $q = s => document.querySelector(s),
      $qa = s => Array.from(document.querySelectorAll(s)),
      $localGet = (key, def = "") => localStorage.hasOwnProperty(key) ? JSON.parse(localStorage[key]) : def,
      $localSet = (key, val) => localStorage.setItem(key, JSON.stringify(val)),
      $GmGet = (key, def = "") => JSON.parse(GM_getValue(key, JSON.stringify(def))),
      $GmSet = (key, val) => {
        GM_setValue(key, JSON.stringify(val));
        $localSet(key, val);
      },
      $rf = (min, max) => Math.floor(1000 * (min + (max - min) * Math.random())),
      sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)),
      $runInterval = (handler, min = 40, max = 60) =>
          setInterval(_ => setTimeout(handler, $rf(min, max)), $rf(min, max)),
      $log = (msg, k = `Log_${new Date().toLocaleDateString()}`, crt = new Date().toLocaleTimeString()) => {
        console.log(msg);
        let log = $localGet(k, []);
        log.push(`[${crt}]${msg}`);
        $localSet(k, log);
      };

  if (location.href.startsWith("https://www.sedu.net/student/"))
    $GmSet("token", $localGet("STUDENT-TOKEN"));
  let token = $GmGet("token");

  $runInterval(function tokenExpireConfirmFun() {
    if (!token) return;
    $log(`当前时间【${new Date()}】，Token过期时间 【${new Date(token.expiry)}】`);
    if (token.expiry - Date.now() > 3600000) return;
    $log(`Token临近过期，主动刷新，转到学时平台`);
    $GmSet("nextStudy", "nextStudy");
    location.href = `https://www.sedu.net/student/#/wx-login-result?loginOrgId=1&token=${token.value}`;
  }, 1000, 1500);

  async function redirectNext() {
    $GmSet("nextStudy", "");
    let headers = {
      "authorization": `Bearer ${token.value}`,
      "content-type": "application/json",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site"
    };
    let home = await fetch('https://xdgp-learn.sctce.cn/api/app/Stu/GetHomeData', {headers}).then(r => r.json());
    if (home.studyingCourseList?.length) {
      await sleep(1111);
      return location.href = home.studyingCourseList[0].pcStudyUrl;
    }
    // if ("#/our-course" !== location.hash) {
    //   document.querySelector('a[href="#/our-course"]').click();
    //   await sleep(999);
    // }
    // // document.getElementById("tab-study").click();
    // let json = await fetch("https://xdgp-learn.sctce.cn/api/app/stuCourse/getRecordsByPage?pageIndex=1&pageSize=10&stuCourseStatus=0",
    //     {headers}).then(r => r.json());
    // if (json.totalRecordCount) {
    //   let next = json.listData.map(e => e.pcStudyUrl).find(e => e.startsWith("https://trplayer.sctce.cn"));
    //   await sleep(1222);
    //   return location.href = next;
    // }
    $log("学习完成");
  }

  GM_registerMenuCommand("点击下一课程", redirectNext)
  if ("nextStudy" === $GmGet("nextStudy") && location.href.startsWith("https://www.sedu.net/student/")) await redirectNext();
  if (!['trplayer.snddopen.cn', 'trplayer.sctce.cn'].includes(location.host)) return;
  $GmSet("nextStudy", ""); //以下为视频播放器程序
  let pauseTime = 0;
  $runInterval(function videoStudy() {
    let subjectPackStatus = document.querySelector("span>span.light-white").innerText;
    $log(subjectPackStatus);
    if ("完成100.00%" === subjectPackStatus) {
      $GmSet("nextStudy", "nextStudy");
      $log("当前课程包已完成100.00%，开始下一个课程");
      return location.href = "https://www.sedu.net/student/#/our-course";
    }

    let videos = Array.from(document.querySelectorAll("div.video-item"));
    let curr = document.querySelector("div.video-item.active");
    let playingStatus = curr?.innerText;
    let idx = videos.indexOf(curr);
    $log(`用户脚本,当前课程学习进度${playingStatus}, 课程序号, ${idx}`);
    if (!playingStatus) return;
    if (document.videoText === playingStatus) {
      pauseTime++;
      if (pauseTime > 8) {
        $log(`播放进度暂停${pauseTime}次，刷新页面`);
        location.reload()
      }
    } else {
      pauseTime = 0;
    }
    document.videoText = playingStatus;
    //`课程视频100%切换（系统自带，仅辅助）`);
    if (playingStatus.includes("已学习100.00%") && videos[idx + 1]) videos[idx + 1].click();
  }, 60, 120);
})();
