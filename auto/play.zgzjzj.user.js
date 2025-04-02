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
  let video = document.querySelector("video");
  if (!video) return logUtil("没有video媒体");
  video.muted = true;
  if (document.querySelector("div.feedBackBox")) {
    document.querySelector("div.feedBackBox h3 img").click();
    return logUtil("关闭弹窗");
  }
  if (!video.paused) {
    return logUtil("正在播放，继续等待，否者判断暂停原因");
  }
  let progress = document.querySelector(
    "#app div.main-box div.course-progress > div > div > span:nth-child(3)"
  )?.innerText;
  if (progress && video.ended) {
    logUtil("当前视频播放完成");
    if (progress !== "100%") {
      document
        .querySelector(
          "#app div.main-box div.navigate > ul > li.nextdontcheatorshit"
        )
        .click();
      logUtil("播放下一章节视频");
    } else {
      let next =
        document.querySelector(
          "#app div.course-catlog-new > div.course-swipper div.swiper-slide.swiper-slide-next img"
        ) ||
        document.querySelector(
          "#app div.course-catlog-new > div.course-swipper div.swiper-slide.swiper-slide-prev img"
        );
      if (!next) return logUtil("当前课程包学习完成！", true);
      next.click();
      logUtil("播放下一课程视频");
    }
  }
  if (video.paused) video.play().then(logUtil).catch(logUtil);
}, 66666);
