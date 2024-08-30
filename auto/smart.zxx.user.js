// ==UserScript==
// @name         中小学智慧教育平台教师暑假研修学习脚本
// @version      v240731
// @description  登录中小学智慧云平台后需要快速切换需要观看的视频
// @author       user
// @match        https://basic.smartedu.cn/*
// @license      MIT
// ==/UserScript==


(function studyFun() {
  console.log("开始学习")
  document.querySelector("video").muted = true;
  document.querySelector("video").autoplay = true;
  document.querySelector("video").playbackRate = 2;
  document.querySelector("video").playbackRate = 16;
  document.querySelector("video").currentTime = document.querySelector("video").duration;
  document.querySelector("video").dispatchEvent(new Event("ended"));
  if (video.paused) document.querySelector("video").play()
  document.querySelector("video").pause();
  document.querySelector("video").play().then(r => 0);
  setTimeout(_ => {
    document.querySelector("video").play();
    console.log("完成学习")
  }, 180)
})()

video = document.getElementById('video')


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
