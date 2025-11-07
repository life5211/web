// ==UserScript==
// @name         四川智慧教育平台学习脚本
// @version      0.17
// @icon         https://basic.smartedu.cn/img/logo-icon.abf693b9.png
// @description  支持2倍速，下一视频切换
// @author       user
// @match        https://basic.sc.smartedu.cn/*
// @downloadURL  https://life5211.github.io/web/auto/play.smart.sc.user.js
// @updateURL    https://life5211.github.io/web/auto/play.smart.sc.user.js
// @noframes
// @license      MIT
// ==/UserScript==

let $q = s => document.querySelector(s),
    $qa = s => Array.from(document.querySelectorAll(s)),
    $localGet = (k, def) => localStorage.hasOwnProperty(k) ? JSON.parse(localStorage.getItem(k)) : def,
    $localSet = (k, v) => localStorage.setItem(k, JSON.stringify(v)),
    $log = (msg) => {
      console.log(msg);
      let k = `log_${new Date().getDate()}`;
      let log = $localGet(k, []);
      if (msg instanceof Object) log.push(msg)
      else log.push(`[${new Date().toLocaleString()}]${msg}`);
      $localSet(k, log);
    };

(function () {
  document.userI = setInterval(function run() {
    let video = document.querySelector("video");

    if (!video) return $log("没有video媒体");

    // if (video.playbackRate < 16) video.playbackRate = 16;
    if (!video.muted) video.muted = true;
    if (!video.autoplay) video.autoplay = true;

    if (video.classList.contains('hide-timeline')) video.classList.remove('hide-timeline');
    $log({m: "播放进度", t: video.currentTime, l: video.duration, now: new Date().toLocaleString()});
    if (video.currentTime > 100) {
      video.currentTime = video.duration - 100;
    }
    if (!video.paused) return $log("正在播放……");

    let studying = document.querySelector("div.studying div.subsectionStudy");
    if (studying.innerText === '100%') {
      let btnArr = Array.from(document.querySelectorAll("div.subsectionStudy"));
      let idx = btnArr.indexOf(studying);
      if (btnArr[idx + 1]) {
        btnArr[idx + 1].click();
      } else {
        clearInterval(document.userI);
        $log("学习结束");
      }
    }
    if (video.paused) video.play().then($log).catch($log);
    $log("继续播放");
  }, 36666);
})();
