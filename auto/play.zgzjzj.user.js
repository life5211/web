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
document.userI = setInterval((_) => {
  let video = $("video")[0];
  if (!video) return logUtil("没有video媒体");
  video.muted = true;
  if ($("div.feedBackBox").length) {
    $("div.feedBackBox h3 img")[0].click();
    logUtil("关闭弹窗");
  }
  if (
    $("div.el-message-box__wrapper i.el-message-box__close.el-icon-close")
      .length
  ) {
    $(
      "div.el-message-box__wrapper i.el-message-box__close.el-icon-close"
    )[0].click();
    logUtil("关闭弹窗");
  }
  // let minute = $("#app div.course-progress a");
  let progress = document.querySelector(
    "div.course-progress span:nth-child(3)"
  )?.innerText;
  logUtil(`课程播放进度：${progress}`);
  if (progress !== "100%" && video.ended) {
    logUtil("当前章节视频播放完成,播放下一章节视频");
    document.querySelector("#app ul > li.nextdontcheatorshit").click();
  }
  if (progress === "100%") {
    logUtil("当前课程学习完成");
    $("div.topnav>li:last-child")[0].click();
    let next =
      $("#app div.course-swipper div.swiper-slide-next img")[0] ||
      $("#app div.course-swipper div.swiper-slide-prev img")[0];
    if (!next) return logUtil("恭喜你，当前课程包全部学习完成！", true);
    next.click();
    logUtil("播放下一课程视频");
  }

  if (!video.paused) {
    return logUtil("正在播放……");
  }
  if (video.paused) video.play().then(logUtil).catch(logUtil);
}, 66666);
