// ==UserScript==
// @name         四川继续教育自动播放
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  四川继续教育自动播放
// @icon         https://www.sedu.net/apppc/login/static/jjw-bj-bf11c0d7.png
// @match        https://trplayer.sctce.cn/#/pc_palyer*
// @downloadURL  https://life5211.github.io/web/auto/play.sedu.user.js
// @updateURL    https://life5211.github.io/web/auto/plsy.sedu.user.js
// @noframes
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// ==/UserScript==


let userI = setInterval(_ => {
  let text = document.querySelector("div.scrollbar-demo-item.active span:nth-child(2)")?.innerText;
  console.log("用户脚本,当前课程学习进度：", text);
  if (text === "100.00%") {
    let ls = document.querySelectorAll("div.scrollbar-demo-item>div");
    if (ls?.length && ls.length > 1)
      return ls[2].click();
  }

  let videos = Array.from(document.querySelectorAll("div.video-item"));
  let videoText, idx = videos.map(e => e.className.includes("active")).indexOf(true);
  if (videoText = videos[idx]?.innerText) {
    if (videoText === document.videoText) location.reload();//进度不更新就刷新
    document.videoText = videoText;
    if (videoText?.includes("已学习100.00%") && videos[idx + 1])
      videos[idx + 1].click();
  }
}, 72000);

