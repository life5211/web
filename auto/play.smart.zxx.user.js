// ==UserScript==
// @name         中小学智慧教育平台假期研修学习脚本
// @version      v17250720
// @icon         https://basic.smartedu.cn/img/logo-icon.abf693b9.png
// @description  支持2倍速，下一视频切换
// @author       user
// @match        https://basic.smartedu.cn/*
// @downloadURL  https://life5211.github.io/web/auto/play.smart.zxx.user.js
// @updateURL    https://life5211.github.io/web/auto/play.smart.zxx.user.js
// @noframes
// @license      MIT
// ==/UserScript==

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
window.addEventListener("load", function () {
  document.userI2 = setInterval(function () {
    let b = $q("button.fish-btn");
    if (b) b.click();
  }, 555);

  function end_next_video() {
    console.log('视频播放完了')
    let i = $q("i[title=未开始]");
    if (i) i.parentElement.parentElement.parentElement.click();
  }

  document.userI = setInterval(function run() {
    let video = $q("video");
    if (!video) {
      return $log("没有video媒体");
    }

    if (!video.muted) {
      video.muted = true;
      video.autoplay = true;
      video.playbackRate = 2;
      video.addEventListener('ended', end_next_video);
      // document.querySelector("video").dispatchEvent(new Event("ended"));
    }
    $log({m: "播放进度", t: video.currentTime, l: video.duration, now: Date.now()});

    if (video.ended) end_next_video();

    if (!video.paused) return $log("正在播放……");
    if (video.paused) video.play().then($log).catch($log);
    $log("继续播放");
  }, 36666);
});


// 6、canplay：可播放监听。当浏览器能够开始播放指定的音频/视频时触发
video.addEventListener('canplay', function (e) {
  console.log('提示该视频已准备好开始播放')
  console.log(e)
})

// 7、canplaythrough：可流畅播放。当浏览器预计能够在不停下来进行缓冲的情况下持续播放指定的音频/视频时触发
video.addEventListener('canplaythrough', function (e) {
  console.log('提示视频能够不停顿地一直播放')
  console.log(e)
})

// 8、play：播放监听
video.addEventListener('play', function (e) {
  console.log('提示该视频正在播放中')
  console.log(e)
})

// 9、pause：暂停监听
video.addEventListener('pause', function (e) {
  console.log('暂停播放')
  console.log(e)
})

// 10、seeking：查找开始。当用户开始移动/跳跃到音频/视频中新的位置时触发
video.addEventListener('seeking', function (e) {
  console.log('开始移动进度条')
  console.log(e)
})

// 11、seeked：查找结束。当用户已经移动/跳跃到视频中新的位置时触发
video.addEventListener('seeked', function (e) {
  console.log('进度条已经移动到了新的位置')
  console.log(e)
})

// 12、waiting：视频加载等待。当视频由于需要缓冲下一帧而停止，等待时触发
video.addEventListener('waiting', function (e) {
  console.log('视频加载等待')
  console.log(e)
})

// 13、playing：当视频在已因缓冲而暂停或停止后已就绪时触发
video.addEventListener('playing', function (e) {
  console.log('playing')
  console.log(e)
})

// 14、timeupdate：目前的播放位置已更改时，播放时间更新
video.addEventListener('timeupdate', function (e) {
  console.log('timeupdate')
  console.log(e)
})

// 15、ended：播放结束
video.addEventListener('ended', function (e) {
  console.log('视频播放完了')
  console.log(e)
})

// 16、error：播放错误
video.addEventListener('error', function (e) {
  console.log('视频出错了')
  console.log(e)
})

// 17、volumechange：当音量更改时
video.addEventListener('volumechange', function (e) {
  console.log('volumechange')
  console.log(e)
})

// 18、stalled：当浏览器尝试获取媒体数据，但数据不可用时
video.addEventListener('stalled', function (e) {
  console.log('stalled')
  console.log(e)
})

// 19、ratechange：当视频的播放速度已更改时
video.addEventListener('ratechange', function (e) {
  console.log('ratechange')
  console.log(e)
})
