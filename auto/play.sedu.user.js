// ==UserScript==
// @name         四川继续教育自动播放
// @namespace    http://tampermonkey.net/
// @version      1.17
// @description  四川继续教育多课程自动连续播放
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

window.GMSetValue = unsafeWindow.GMSetValue = GM_setValue;
window.GMGetValue = unsafeWindow.GMGetValue = GM_getValue;

let $q = s => document.querySelector(s),
  $qa = s => Array.from(document.querySelectorAll(s)),
  $localGet = (key, def) => localStorage.hasOwnProperty(key) ? JSON.parse(localStorage[key]) : def,
  $localSet = (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  $GmGet = (key, def) => JSON.parse(GMGetValue(key, JSON.stringify(def))),
  $GmSet = (key, val) => GMSetValue(key, JSON.stringify(val)),
  $log = (msg, f) => {
    console.log(msg);
    let k = `log_${new Date().getDate()}`;
    let log = $localGet(k, []);
    log.push(`[${new Date().toLocaleString()}]${msg}`);
    $localSet(k, log);
    if (f) alert(msg);
  };

(async function redirectNext() {
  if ("#/our-course" === location.hash && "nextStudy" === $GmGet("nextStudy")) {
    $GmSet("nextStudy", "");
    // document.getElementById("tab-study").click();
    await fetch("https://xdgp-learn.sctce.cn/api/app/stuCourse/getRecordsByPage?pageIndex=1&pageSize=10&stuCourseStatus=0", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "authorization": `Bearer ${$localGet("STUDENT-TOKEN").value || $localGet("STUDENT-USER-STORE").token}`,
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site"
      },
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    }).then(r => r.json()).then(json => {
      //https://learn.ourteacher.com.cn
      //https://trplayer.sctce.cn/?token={TOKEN}&stuCourseId=41614455-3963-497e-888f-b35100b1e7e0&ts=1757226026207#/70dcb28e-7135-48da-8f73-b03b00a2b6c7/26f4b295-bcbb-f6d5-1c0c-3a03cea87741/pc/teachlearn
      if (json.totalRecordCount) {
        let urls = json.listData.map(e => e.pcStudyUrl).filter(e => e.startsWith("https://trplayer.sctce.cn"));
        setTimeout(_ => window.open(urls[0], "_top"), 662);
      } else $log("学习完成", 1);
    }).catch(err => console.log(err));
  }
})();

(function reload() {
  if ("https://www.sedu.net" === location.origin) {
    $log("定时刷新页面Key")
    document.reloadNo = setInterval(location.reload, 29 * 60000);
  }
})();

(function videoStudy() {
  if (location.href.startsWith("https://trplayer.sctce.cn/"))
    setInterval(_ => {
      let subjectPackStatus = document.querySelector("span>span.light-white").innerText;
      $log(subjectPackStatus);
      if ("完成100.00%" === subjectPackStatus) {
        $GmSet("nextStudy", "nextStudy");
        $log("100.00%下一个课程");
        return location.href = "https://www.sedu.net/student/#/our-course";
      }

      // 课程视频切换（系统自带，仅辅助）
      let videos = Array.from(document.querySelectorAll("div.video-item"));
      let curr = document.querySelector("div.video-item.active");
      let playingStatus = curr?.innerText;
      let idx = videos.indexOf(curr);
      $log(`用户脚本,当前课程学习进度${playingStatus}, 课程序号, ${idx}`);
      if (playingStatus) {
        if (document.videoText === playingStatus) {
          $log("播放进度暂停，刷新页面")
          location.reload();
        }
        document.videoText = playingStatus;
        if (playingStatus.includes("已学习100.00%") && videos[idx + 1]) videos[idx + 1].click();
      }
    }, 66600);
})();
