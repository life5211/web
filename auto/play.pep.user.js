// ==UserScript==
// @name         人教教材培训播放
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  自动采集和记录
// @icon         https://wp.pep.com.cn/favicon.ico
// @match        https://wp.pep.com.cn/web/index.php*
// @match        https://bjpep.gensee.com/webcast/site/vod/*
// @downloadURL  https://life5211.github.io/web/auto/play.pep.user.js
// @updateURL    https://life5211.github.io/web/auto/play.pep.user.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

(function () {
  window.GMSetValue = unsafeWindow.GMSetValue = GM_setValue;
  window.GMGetValue = unsafeWindow.GMGetValue = GM_getValue;

  let $q = s => document.querySelector(s),
      $qa = s => Array.from(document.querySelectorAll(s)),
      $localGet = (key, def) => localStorage.hasOwnProperty(key) ? JSON.parse(localStorage[key]) : def,
      $localSet = (key, val) => localStorage.setItem(key, JSON.stringify(val)),
      $GmGet = (key, def) => JSON.parse(GMGetValue(key, JSON.stringify(def))),
      $GmSet = (key, val) => GMSetValue(key, JSON.stringify(val)),
      $path = location.pathname,
      $curr = GMGetValue("userSubject", "temp"),
      $play,
      $playGet = _ => $play = $GmGet($curr, {his: {}, ended: {}, urlPath: {}}),
      $playSet = _ => $GmSet($curr, $play),
      $log = (msg, f) => {
        console.log(msg);
        let k = `log_${new Date().getDate()}`;
        let log = $localGet(k, []);
        if (msg instanceof Object) log.push(msg)
        else log.push(`[${new Date().toLocaleString()}]${msg.m || msg}`);
        $localSet(k, log);
        if (f) alert(msg);
      };
  $playGet();

  let playId = GM_registerMenuCommand("一键开始学习", nextVideo, "");
  let subjectId = GM_registerMenuCommand("学习列表采集", collect, "");

  function collect() {
    // 课程学习采集界面
    if ($q("div.con_table_pxkc_gztb2020b>table")) {
      let userName = $q("div.container_user_gztb2020b>h4").innerText;
      let grade = $q("select#stage>[selected]").innerText;
      let subject = $q("select#sid>[selected]").innerText;
      $curr = `user_${userName}${grade}${subject}`;
      GMSetValue("userSubject", $curr);
      $playGet();
      let studyLinks = $qa("div.con_table_pxkc_gztb2020b>table")
          .filter(e => !e.innerText.includes("不计学时"))
          .flatMap(t => Array.from(t.querySelectorAll("td.txt_pxrk a")));
      $play.urls = studyLinks.map(a => a.href);
      studyLinks.forEach(link => {
        let ele = document.createElement("div");
        ele.innerHTML = `<a href="javascript:#" onclick="studyFun('${link.href}')">脚本学习</a>`;
        link.parentElement.appendChild(ele);
      });
      $playSet();
    }
  }

  document.studyFun = function (url, target = "_blank") {
    $play.urlTemp = url;
    $playSet();
    setTimeout(_ => window.open(url, target), 300);
  };

  function nextVideo(target) {
    let next = $play.urls.filter(a => !$play.ended[$play.urlPath[a]])[0];
    if (!next) {
      location.href = "/web/index.php"
      return $log("学习完成，没有下一课程", true);
    }
    $log(`播放下一课程"${next}`);
    document.studyFun(next, target);
  }

  function endNext() {
    $play.ended[$path] = `${document.title}-${new Date().toLocaleString()}`;
    $playSet();
    $log($play.ended);
    $log("播放结束，查询下一课程继续播放；")
    nextVideo("_top");
  }

  if (location.origin !== "https://bjpep.gensee.com") return;
  document.videoI = setInterval(runVideo, 30123);
  runVideo();

  function runVideo() {
    let video = $q("video");
    if (!video) return $log("没有video媒体");

    if ($play.urlTemp) {
      $play.urlPath[$play.urlTemp] = $path;
      $play.urlPath[$path] = $play.urlTemp;
      $play.urlTemp = "";
      $playSet();
    }

    if (!video.title) {
      video.muted = true;
      video.autoplay = true;
      video.title = "脚本运行中";
      // if ($play.his[$path]) video.currentTime = $play.his[$path].currentTime;
      video.addEventListener('ended', endNext);
      video.onended = endNext;
    }
    $play.his[$path] = {currentTime: video.currentTime, length: video.duration};
    $playSet();

    $log({
      t: video.currentTime,
      title: document.title,
      l: video.duration,
      m: "播放进度",
      path: $path,
      url: $play.urlPath[$path],
      time: new Date().toLocaleString()
    });

    let panel = $q("div.stop-reporting-bg");
    if (panel && panel.style.display === 'block') {
      if (panel.innerText.includes("本视频已播放结束")) {
        $q("button.stop-reporting-btn").click();
        clearInterval(document.videoI);
        return endNext();
      }
      if (panel.innerText.includes("请重新进入继续观看")) {
        return nextVideo("_top");
      }
    }
    if ($q("a#videoStartBtn")?.style.display === 'block') $q("a#videoStartBtn")?.click();
    if (video.paused) video.play().then($log).catch($log);
    if (!video.paused) return $log("正在播放……");
    $log("继续播放");
  }
})();
