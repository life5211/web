// ==UserScript==
// @name         四川网络干部学院学习
// @version      0.17
// @icon         https://web.scgb.gov.cn/favicon.ico
// @author       user
// @description  try to take over the world!
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
  let $q = s => document.querySelector(s);
  let $qa = s => Array.from(document.querySelectorAll(s));
  let $localGet = (k, def) => localStorage.hasOwnProperty(k) ? JSON.parse(localStorage.getItem(k)) : def;
  let $localSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  let $log = (msg, k = `Log_${new Date().toLocaleDateString()}`) => {
    if (msg instanceof Object) msg.crt = new Date().toLocaleTimeString();
    else msg = {msg, crt: new Date().toLocaleTimeString()};
    console.log(msg);
    let log = $localGet(k, []);
    log.push(msg);
    $localSet(k, log);
  };

  if (document.userI) clearInterval(document.userI);
  document.userI = setInterval(async function () {
    let video = document.querySelector("video");
    if (!video) return $log("没有video元素");
    if (!video.title) {
      $log("播放器初始化设置");
      document.querySelector("video").title = "四川网络干部培训自动化";
    }
    $log({m: "播放进度", t: video.currentTime, l: video.duration});

    if (video.ended) {
      $log("当前课程学习结束");
      if (document.userI) clearInterval(document.userI);
      let next = document.querySelector("div.tab-list div.item.active div").nextElementSibling;
      if (next) return next.click();
      let learned = await fetch("https://api.scgb.gov.cn/api/services/app/course/app/getCourseUserAutoLearnPage?maxResultCount=96&skipCount=0&pageIndex=1",
          {"headers": {authorization: `Bearer ${$localGet("store")?.session.accessToken}`}}
      ).then(r => r.json()).then(r => r.result.records);
      learned.forEach(e => e.hours = Math.floor((e.curTimes / 3600) * 100) / 100);
      let learnedObj = learned.reduce(function (prev, curr) {
        prev[curr.id] = curr;
        return prev;
      }, {});
      let resource = $localGet("resource", []).map(e => Object.assign({}, e, learnedObj[e.id]));
      $localSet("learned", learned);
      fun(resource.filter(e => ['理论教育', '党史教育'].includes(e.label)), 21)
      && fun(resource.filter(e => !['理论教育', '党史教育'].includes(e.label)), 31)
      && $log("全部学习完成啦；");

      function fun(filterRecourse, hours) {
        let reduce = filterRecourse.reduce((prev, cur) => prev + (cur.hours || 0), 0);
        $log(`当前模块学习进度${reduce}/${hours}`);
        if (reduce > hours) return true;
        let filter = filterRecourse.filter(e => !e.hours);
        if (!filter.length) return true;
        $log(filter[0]);
        location.href = `/#/course?id=${filter[0].id}&className=`;
        location.reload();
        return false;
      }
    }
    if (video.ended) return $log("播放完毕，等待同步进度");
    if (video.paused) return video.play().then($log).catch($log);
  }, 66666);

  (function parseJWT(token) {
    const base64Url = token.split('.')[1]; // 获取载荷部分
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // 替换Base64字符
    const jsonPayload = decodeURIComponent(
        atob(base64).split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    let jwt = JSON.parse(jsonPayload);
    $localSet("jwt", jwt);
    let exp = new Date(jwt?.exp * 1000).toLocaleString();
    $localSet('exp', exp);
    console.log(jwt, exp);
    return jwt; // 返回JSON对象
  })(JSON.parse(localStorage.store)?.session.accessToken);

  function resourceCache() {
    fetch("https://api.scgb.gov.cn/api/services/app/course/site/getCoursePublicPage?maxResultCount=256&skipCount=0&pageIndex=41&changePageIndex=41&filterString=&contentId=&orderByType=&tagName=&year=",
        {"headers": {authorization: `Bearer ${$localGet("store")?.session.accessToken}`}}
    ).then(r => r.json()).then(r => $localSet("resource", r.result.records));
  }

  let resourceId = GM_registerMenuCommand("学习列表采集", resourceCache);
  if (!localStorage.resource) resourceCache();
})();
