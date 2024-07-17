// ==UserScript==
// @name        四川学法考试模拟AI
// @namespace   Javascript
// @match       *://xxpt.scxfks.com/*
// @version     V2.70
// @author      null
// @description 四川省，学习平台，工作人员学法考试平台，每日学习辅助，学完停止；
// @icon        http://xxpt.scxfks.com/study/static/images/favicon.ico?v1.2
// @license MIT
// ==/UserScript==
(function () {
  'use strict';
  const rf = (min, max) => 1000 * Math.floor(min + (max - min) * Math.random());
  window.setTimeout(_ => {
    if (["/study/login", "/"].includes(location.pathname)) {
      document.cookie = "study_limit=false;path=/;max-age=0";
      const checkBox = document.getElementById("know");
      if (checkBox && !checkBox.checked) checkBox.click(); // 选中登录须知
      return;
    }
    const noLimit = !getCookie("study_limit");
    if (location.pathname.startsWith("/study/course") && noLimit) {
      if (location.pathname.startsWith("/study/courses")) { // 课程列表
        const studyBtn = Array.from(document.querySelectorAll("table.list-tab>tbody>tr"))
          .filter(e => e && !["视频库", "练习题库"].includes(e.querySelector("td.tx-m").innerText))
          .map(e => e.querySelector("a")).filter(e => e && e.innerText.includes("学习"))
          .sort(() => Math.random() - 0.3);
        if (studyBtn.length) return studyBtn[0].click();
        if (location.pathname.startsWith("/study/courses/all")) return;
        location.href = "/study/courses/all";
      }
      if (!location.pathname.includes("chapter")) { // 课程章节列表
        const studyLs = Array.from(document.querySelectorAll("ul.chapter>li>table > tbody>tr>td>:nth-child(2)"))
          .filter(e => e.innerHTML.includes("&nbsp; &nbsp;"));
        if (studyLs && studyLs.length) return studyLs[0].click();
      }
      setInterval(_ => window.scrollBy({ top: window.innerHeight / 3, behavior: "smooth", }), rf(1, 2));
      if (location.pathname.includes("/chapter/")) { // 学习界面
        if (document.querySelector("div.chapter-score.limit")) return document.cookie = "study_limit=true;path=/";
        if (document.querySelector("div.chapter-score.chapter-score-suc")) return document.querySelector("button").click();
        return setInterval(() => {
          if (!document.querySelector("div.chapter-score.chapter-score-suc")) return;
          let nextBtn = document.querySelector("img.next_chapter");
          if (nextBtn) nextBtn.click();
          else document.querySelector("button").click()
        }, rf(2, 4));
      }
      location.href = "/study/courses/require";
      return;
    }
    if (location.pathname.startsWith("/study/activity/question?")) {
      // "http://xxpt.scxfks.com/study/activity/entry?id=57";
      const questionNode = document.querySelector("div.question");
      if (!questionNode) return;
      const questionText = encodeURIComponent(questionNode.innerText.substr(10));
      const searchDiv = document.createElement("div");
      searchDiv.innerHTML = `<table><tr>
        <td><a target="_blank" href="https://www.chinaso.com/newssearch/all/allResults?q=${questionText}">中国搜索</a></td>
        <td><a target="_blank" href="https://cn.bing.com/search?q=${questionText}">必应搜索</a><br/></td>
        <td><a target="_blank" href="https://www.baidu.com/s?wd=${questionText}">百度搜索</a><br/></td>
        </tr></table>`;
      questionNode.appendChild(searchDiv);
    }
    const coursesBtn = document.querySelector("header>div.nav>div>a:nth-child(2)");
    if (noLimit && coursesBtn) coursesBtn.innerText = "点击开始智能学习";
    if (location.pathname.includes("/exercise/")) { // 练习题库
      document.querySelectorAll("div.item").forEach(e => {
        const ans = e.firstElementChild.lastElementChild.innerText.substr(5);
        Array.from(e.lastElementChild.children).forEach(li => {
          if (ans.includes(li.innerText.substr(0, 1))) li.firstChild.click()
        })
      })
    }
  }, rf(0.5, 2));
})()
