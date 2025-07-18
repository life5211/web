// ==UserScript==
// @name         成都大学继续教育移动端快速播放
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  成都大学多课程自动连续播放
// @icon         https://scszj.webtrn.cn/api/incoming/photo/zyjnzhpx/zyjnzhpx1717730101870-7.jpg
// @match        https://scszj.webtrn.cn/*
// @match        https://zyjnzhpx-kfkc.webtrn.cn/video/mobile*
// @match        https://zyjnzhpx-kfkc.webtrn.cn/learnspace-mobile/mobile*
// @match        https://zyjnzhpx-kfkc.webtrn.cn/*
// @downloadURL  https://life5211.github.io/web/auto/play.cdu.user.js
// @updateURL    https://life5211.github.io/web/auto/play.cdu.user.js
// ==/UserScript==

window.addEventListener("load", function () {
  let $q = s => document.querySelector(s),
      $qa = s => Array.from(document.querySelectorAll(s)),
      $localGet = (k, def) => localStorage.hasOwnProperty(k) ? JSON.parse(localStorage.getItem(k)) : def,
      $localSet = (k, v) => localStorage.setItem(k, JSON.stringify(v)),
      $log = (msg, f) => {
        console.log(msg);
        let log = $localGet("log", []);
        log.push(`[${new Date().toLocaleString()}]${msg}`);
        $localSet("log", log);
        if (f) alert(msg);
      };

  setTimeout(function () {
    let startBtn = $q(".btn.spl-startbtn");
    if (startBtn) {
      $log({m: "点击开始学习"})
      return startBtn.click();
    }
  }, 5667);

  setTimeout(function run() {
    let video = $q("video");
    if (!video) return $log("没有video媒体");
    video.muted = true;
    // if (video.playbackRate < 2) video.playbackRate = 2;
    $log({m: "播放进度", t: video.currentTime, l: video.duration, now: Date.now()});
    if (video.ended) {
      return setTimeout(function next() {
        let v2 = $q("video");
        $log([v2, v2.ended]);
        if (v2?.ended) $q("goto-btn").click();
        else setTimeout(run, 66666);
      }, 6666); // 延时校验当前课程包已结束
    }
    if (!video.paused) return $log("正在播放……");
    if (video.paused) video.play().then($log).catch($log);
    $log("继续播放");
    setTimeout(run, 66666);
  }, 6666);
});
