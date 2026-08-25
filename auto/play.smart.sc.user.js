// ==UserScript==
// @name         四川智慧教育平台学习
// @version      1.18
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
      $rf = (min, max = min) => Math.floor(1000 * (min + (max - min) * Math.random())),
      sleep = (min, max) => new Promise(resolve => setTimeout(resolve, $rf(min, max))),
      $log = (msg, k = `Log_${new Date().toLocaleDateString()}`) => {
        if (msg instanceof Object) msg.crt = new Date().toLocaleTimeString();
        else msg = {msg, crt: new Date().toLocaleTimeString()};
        console.log(msg);
        let log = $localGet(k, []);
        log.push(msg);
        $localSet(k, log);
      };

  if (document.userI) clearInterval(document.userI);
  document.userI = setInterval(async function run() {
    let video = document.querySelector("video");
    if (!video) return $log("没有video元素");
    if (!video.title) {
      video.title = "自动化脚本";
      video.autoplay = true;
      video.muted = true;
      await sleep(1, 2);
      await document.querySelector("video").play();
      $log("播放器初始化设置");
      video.addEventListener('ended', function () {
        $log("当前课程学习结束");
        setTimeout(next, $rf(10, 30));
      });
    }
    $log(`播放进度", t: ${video.currentTime}, l: ${video.duration}`);
  }, $rf(30, 60));

  function next() {
    let studying = document.querySelector("div.studying div.subsectionStudy");
    let btnArr = Array.from(document.querySelectorAll("div.subsectionStudy"));
    let idx = btnArr.indexOf(studying);
    if (btnArr[idx + 1]) {
      $log(`开始下一课程${idx}->${idx + 1}`);
      return btnArr[idx + 1].click();
    } else {
      clearInterval(document.userI);
      $log(`学习结束${idx}`);
      clearInterval(document.userI);
      location.href = location.host;
    }
  }
})();
