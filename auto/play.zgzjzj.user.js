// ==UserScript==
// @name         四川专技天下自动播放
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  四川专辑天下多课程自动连续播放
// @icon         https://jyrcjypt.zgzjzj.com/static/img/heads-default.3795293.png
// @match        https://jyrcjypt.zgzjzj.com/learncenter/play*
// @downloadURL  https://life5211.github.io/web/auto/play.zgzjzj.user.js
// @updateURL    https://life5211.github.io/web/auto/play.zgzjzj.user.js
// @noframes
// ==/UserScript==

function logUtil(msg, f) {
  console.log(msg);
  let log = JSON.parse(localStorage.getItem("log") || "[]");
  log.push(`[${new Date().toLocaleString()}]${msg}`);
  localStorage.setItem("log", JSON.stringify(log));
  if (f) alert(msg);
}

let $q = s => document.querySelector(s), $qa = s => Array.from(document.querySelectorAll(s));

document.userI = setInterval(function run() {
  let video = $q("video");
  if (!video) return logUtil("没有video媒体");
  video.muted = true;
  if ($q("div.feedBackBox")) {
    $q("div.feedBackBox h3 img").click();
    logUtil("关闭弹窗");
  }
  if ($q("div.el-message-box__wrapper i.el-message-box__close.el-icon-close")) {
    $q("div.el-message-box__wrapper i.el-message-box__close.el-icon-close").click();
    logUtil("关闭弹窗");
  }
  // let minute = $q("#app div.course-progress a");
  let progress = $q("div.course-progress span:nth-child(3)")?.innerText;
  logUtil(`课程播放进度：${progress}`);
  if (progress !== "100%" && video.ended) {
    logUtil("当前章节视频播放完成,播放下一章节视频");
    $q("#app ul > li.nextdontcheatorshit").click();
    setTimeout(run, 6666);
  }
  if (progress === "100%") {
    logUtil("当前课程学习完成");
    $q("div.topnav>li:last-child").click();
    let next = $q("#app div.course-swipper div.swiper-slide img");
    if (!next) return logUtil("恭喜你，当前课程包全部学习完成！", true);
    next.click();
    setTimeout(run, 6666);
    logUtil("播放下一课程视频");
  }

  if (!video.paused) return logUtil("正在播放……");
  if (video.paused) video.play().then(logUtil).catch(logUtil);
}, 66666);
