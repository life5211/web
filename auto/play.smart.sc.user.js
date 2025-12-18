// ==UserScript==
// @name         四川智慧教育平台学习脚本
// @version      1.17
// @description  try to take over the world!
// @icon         https://basic.smartedu.cn/img/logo-icon.abf693b9.png
// @author       user
// @match        https://basic.sc.smartedu.cn/*
// @downloadURL  https://life5211.github.io/web/auto/play.smart.sc.user.js
// @updateURL    https://life5211.github.io/web/auto/play.smart.sc.user.js
// @noframes
// @license      MIT
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
      video.title = "自动化脚本";
      $log("播放器初始化设置");
    }
    if (!localStorage.normal) {
      videoAttrSet();
      if (video.currentTime > 30 && video.currentTime < video.duration - 200) video.currentTime = video.duration - 133;
    }
    $log({m: "播放进度", t: video.currentTime, l: video.duration});
    let studying = document.querySelector("div.studying div.subsectionStudy");
    if (studying.innerText === '100%') {
      $log("当前课程学习结束");
      let btnArr = Array.from(document.querySelectorAll("div.subsectionStudy"));
      let idx = btnArr.indexOf(studying);
      if (btnArr[idx + 1]) {
        $log(`开始下一课程${idx}-${idx + 1}`);
        return btnArr[idx + 1].click();
      } else {
        clearInterval(document.userI);
        return $log(`学习结束${idx}`);
      }
    }
    if (video.ended) return $log("播放完毕，等待同步进度");
    if (!video.paused) return $log("正在播放……");
    if (video.paused) return video.play().then($log).catch($log);
    $log("暂停视频继续播放");
  }, 56666);

  function videoAttrSet() {
    let video = document.querySelector("video");
    if (!video.controlsList) return;
    // if (!video.muted) video.muted = true;
    // if (!video.autoplay) video.autoplay = true;
    // if (video.playbackRate < 4) video.playbackRate = 4;
    video.removeAttribute("disableremoteplayback")
    video.removeAttribute("disablePictureInPicture")
    video.removeAttribute("controlsList")
    video.removeAttribute("preload")
    video.classList.remove('hide-timeline');
    video.classList.remove('hide-speed-control');
  }

  (function registerMenu() {
    window.menu_id = GM_registerMenuCommand(`快速学习已${localStorage.normal ? '关闭' : '开启'}`, function () {
      localStorage.normal = localStorage.normal ? '' : 'normal'
      GM_unregisterMenuCommand(window.menu_id);
      if (!localStorage.normal) videoAttrSet();
      registerMenu();
    });
  })();
})();
