// ==UserScript==
// @name         四川网络干部学院学习
// @version      0.17
// @icon         https://basic.smartedu.cn/img/logo-icon.abf693b9.png
// @author       user
// @match        https://web.scgb.gov.cn/*
// @downloadURL  https://life5211.github.io/web/auto/play.scgb.user.js
// @updateURL    https://life5211.github.io/web/auto/play.scgb.user.js
// @noframes
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// ==/UserScript==


(function () {
  let $q = s => document.querySelector(s),
      $qa = s => Array.from(document.querySelectorAll(s)),
      $localGet = (k, def) => localStorage.hasOwnProperty(k) ? JSON.parse(localStorage.getItem(k)) : def,
      $localSet = (k, v) => localStorage.setItem(k, JSON.stringify(v)),
      $log = (msg, k = `Log_${new Date().toLocaleDateString()}`) => {
        if (msg instanceof Object) msg.crt = new Date().toLocaleTimeString();
        else msg = {msg, crt: new Date().toLocaleTimeString()};
        console.log(msg);
        let log = $localGet(k, []);
        log.push(msg);
        $localSet(k, log);
      };

  if (document.userI) clearInterval(document.userI);
  document.userI = setInterval(function run() {
    let video = document.querySelector("video");
    if (!video) return $log("没有video元素");
    if (!video.title) {
      $log("播放器初始化设置");
      document.querySelector("video").title = "四川网络干部培训自动化";
    }
    $log({m: "播放进度", t: video.currentTime, l: video.duration});

    if (video.ended) {
      $log("当前课程学习结束");
      fetch("https://api.scgb.gov.cn/api/services/app/course/app/getCourseUserAutoLearnPage?maxResultCount=96&skipCount=0&pageIndex=1",
          {"headers": {authorization: `Bearer ${$localGet("store")?.session.accessToken}`}}
      ).then(r => r.json().result.records).then(learned => {
        $localSet("learned", learned);
        let learnedId = learned.map(e => e.id);
        let hours = learned.map(e => Math.floor((e.curTimes / 3600) * 100) / 100).reduce((prev, cur) => prev + cur, 0);
        $log(`当前共学习${hours}学时`);
        if (hours > 51) return $log("学习完成")
        let resource = $localGet("resource");
        let filter = resource.filter(e => !learnedId.includes(e.id));
        if (filter.length) {
          location.href = `/#/course?id=${filter[0].id}&className=`;
          location.reload();
        }
      });
    }
    if (video.ended) return $log("播放完毕，等待同步进度");
    if (!video.paused) return $log("正在播放……");
    if (video.paused) return video.play().then($log).catch($log);
    $log("暂停视频继续播放");
  }, 36666);

  let resourceId = GM_registerMenuCommand("学习列表采集", resourceCache);
  if (!localStorage.resource) resourceCache();

  function resourceCache() {
    fetch("https://api.scgb.gov.cn/api/services/app/course/site/getCoursePublicPage?maxResultCount=256&skipCount=0&pageIndex=41&changePageIndex=41&filterString=&contentId=&orderByType=&tagName=&year=",
        {"headers": {authorization: `Bearer ${$localGet("store")?.session.accessToken}`}}
    ).then(r => r.json()).then(r => $localSet("resource", r.result.records));
  }
})();
