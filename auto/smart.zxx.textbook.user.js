// ==UserScript==
// @name         中小学智慧教育平台电子课本解析下载
// @version      17.2
// @description  强制显示 PDF.js 工具栏按钮
// @author       user
// @downloadURL  https://life5211.github.io/web/auto/smart.zxx.textbook.user.js
// @updateURL    https://life5211.github.io/web/auto/smart.zxx.textbook.user.js
// @icon         https://basic.smartedu.cn/img/entrance.ebbe1413.png
// @match        https://basic.smartedu.cn/*
// @license      MIT
// @noframes
// @match        https://basic.smartedu.cn/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

(function () {
  window._ndAuth = null;
  // Hook XMLHttpRequest
  const XHR = XMLHttpRequest.prototype;
  const originOpen = XHR.open;
  const originSend = XHR.send;
  const headerMap = new WeakMap();
  const originSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function (key, val) {
    if (['x-nd-auth', 'authorization'].includes(key.toLowerCase())) {
      window._ndAuth = val;
      console.log("✅捕获X-Nd-Auth：", key, val);
    }
    return originSetHeader.call(this, key, val);
  }
  if (/^\/training\/[\w\d-]{36}$/.test(location.pathname)) {
    // 培训页面抓取接口信息  /training/dc6d78f2-bad8-4d09-b8da-0d758803dbe4
    const train_id = location.pathname.substr(10);
    localStorage.train_url = location.href;
    localStorage.train_id = train_id;
    XHR.open = function (method, url) {
      this._reqUrl = url;
      headerMap.set(this, {});
      return originOpen.apply(this, arguments);
    };
    XHR.send = function () {
      const xhr = this;
      xhr.addEventListener("load", function () {
        const url = xhr._reqUrl;
        if (url.includes(`/teach/api_static/trains/${localStorage.train_id}/train_courses.json`)) {
          localStorage.train_courses = xhr.responseText;
        }
        if (url.includes(`/teach/api_static/trains/${localStorage.train_id}.json`)) {
          localStorage.train_courses_json = xhr.responseText;
        }
        if (url.includes(`/trains/${localStorage.train_id}/courses_period/actions/list`)) {
          localStorage.train_courses_user_list = xhr.responseText;
          localStorage.train_courses_user_list_url = url;
        }
      });
      return originSend.apply(this, arguments);
    };
  }

  if ("/tchMaterial/detail" === location.pathname) GM_registerMenuCommand("下载电子课本", downloadTextBook);

  function downloadTextBook() {
    let viewerSrc = document.getElementById("pdfPlayerFirefox").src;
//  https://basic.smartedu.cn/pdfjs/2.15/web/viewer.html?file=https://r3-ndr-private.ykt.cbern.com.cn/edu_product/esp/assets/60add6f1-e920-4c03-993d-cb18eceee02e.pkg/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%E2%80%A2%E7%94%9F%E7%89%A9%E5%AD%A6_%E4%B8%83%E5%B9%B4%E7%BA%A7_%E4%B8%8A%E5%86%8C_%E5%8C%97%E4%BA%AC%E5%87%BA%E7%89%88%E7%A4%BE_1754905851330.pdf#disablestream=true&disableAutoFetch=true&page=15
//     let arr = /https.+file=(https[^&]+)&headers=([^#]+)(#.*)?$/.exec(viewerSrc);
//     console.log(viewerSrc, arr, pdfHref);
    let api = viewerSrc.replace(/https.+file=/, '').replace(/[#&].+$/, '');
    if (!window._ndAuth) return alert("鉴权解析失败");
    fetch(api, {headers: {'x-nd-auth': window._ndAuth}})
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = document.title;
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Download failed:', error));
  }
})();
