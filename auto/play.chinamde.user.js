// ==UserScript==
// @name         成都理工大学继续教育快速播放
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  成都理工大学多课程自动连续播放
// @icon         https://enclosure-file.oss-cn-zhangjiakou.aliyuncs.com/2115192812559196224/20240624/2024%E6%96%B0%E7%89%88%E6%88%90%E9%83%BD%E7%90%86%E5%B7%A5.png
// @match        https://sczj.chinamde.cn/play*
// @downloadURL  https://life5211.github.io/web/auto/play.chinamde.user.js
// @updateURL    https://life5211.github.io/web/auto/play.chinamde.user.js
// @noframes
// ==/UserScript==

window.addEventListener("load", function play() {
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

  document.userI = setInterval(function run() {
    let video = $q("video");
    if (!video) return $log("没有video媒体");
    video.muted = true;
    if (video.playbackRate < 16) video.playbackRate = 16;

    $qa("img[alt=展开]").forEach(e => e.click());
    let curr = $q("img[src='/imgs/a.gif']")?.parentElement;
    let ls = $qa("[class^=Play_child_item]");
    let idx = ls.indexOf(curr);
    let progress = {idx, t: video.currentTime, l: video.duration};
    $log(["播放进度：", progress]);
    /*
    if (video.ended) {
      $qa("[class^=Play_child_item]").map(e => e.innerText.includes("100%"));
      let next = ls[idx + 1];
      if (!next) return $log("恭喜你，当前课程包全部学习完成！", true);
      next.click();
      setTimeout(run, 6666);
      $log("播放下一课程视频");
    }
    */
    if (!video.paused) return $log("正在播放……");
    if (video.paused) video.play().then($log).catch($log);
  }, 66666);
});




