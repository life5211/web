// ==UserScript==
// @name         四川继续教育自动播放
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  四川继续教育多课程自动连续播放
// @icon         https://www.sedu.net/apppc/login/static/jjw-bj-bf11c0d7.png
// @match        https://trplayer.sctce.cn/*
// @downloadURL  https://life5211.github.io/web/auto/play.sedu.user.js
// @updateURL    https://life5211.github.io/web/auto/play.sedu.user.js
// @noframes
// ==/UserScript==


let userI = setInterval(_ => {
  let text = document.querySelector("div.scrollbar-demo-item.active span:nth-child(2)")?.innerText;
  console.log("用户脚本,当前课程包学习进度：", text);
  if (text === "100.00%") {
    let ls = document.querySelectorAll("div.scrollbar-demo-item>div");
    if (ls?.length && ls.length > 1) return ls[1].click();
  }

  let videos = Array.from(document.querySelectorAll("div.video-item"));
  let curr = document.querySelector("div.video-item.active");
  if (curr?.innerText) {
    if (document.videoText === curr.innerText) location.reload();//进度不更新就刷新
    document.videoText = curr.innerText;
    let idx = videos.indexOf(curr);
    console.log("用户脚本,当前课程学习进度：", curr.innerText, "课程序号", idx);
    if (curr.innerText.includes("已学习100.00%") && videos[idx + 1]) videos[idx + 1].click();
  }
}, 72000);

