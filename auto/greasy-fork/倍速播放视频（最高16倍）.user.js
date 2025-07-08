// ==UserScript==
// @name         倍速播放视频（最高16倍）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  倍速播放看 国家中小学智慧教育平台的视频、国家职业教育智慧平台
// @author       sunsikai
// @match        *://*.smartedu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zxx.edu.cn
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';
    // @match        http://*/*

    let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    Container.style.position = "fixed"
    Container.style.left = "20px"
    Container.style.top = "20px"
    Container.style['z-index'] = "999999"
    Container.innerHTML = `<span>倍速</span>
        <a href="#" onclick="speedUp2312(1)">×1</a>
        <a href="#" onclick="speedUp2312(2)">×2</a>
        <a href="#" onclick="speedUp2312(4)">×4</a>
        <a href="#" onclick="speedUp2312(8)">×8</a>
        <a href="#" onclick="speedUp2312(16)">×16</a>
`

    document.speedUp2312 = function (s) {
        console.log(s);
        document.querySelector('video').playbackRate = s || 1;
    };
      document.body.appendChild(Container);
      // Your code here...
  })();