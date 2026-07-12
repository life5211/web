// ==UserScript==
// @name         中小学智慧教育平台电子课本解析下载
// @version      17.1
// @description  强制显示 PDF.js 工具栏按钮
// @author       user
// @downloadURL  https://life5211.github.io/web/auto/smart.zxx.textbook.user.js
// @updateURL    https://life5211.github.io/web/auto/smart.zxx.textbook.user.js
// @icon         https://basic.smartedu.cn/img/entrance.ebbe1413.png
// @match        https://basic.smartedu.cn/tchMaterial/detail*
// @license      MIT
// @noframes
// @match        https://basic.smartedu.cn/*
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

(function () {
  window._ndAuth = null;
  // Hook XMLHttpRequest
  const originSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function (key, val) {
    if (['x-nd-auth', 'authorization'].includes(key.toLowerCase())) {
      window._ndAuth = val;
      GM_setClipboard(val);
      console.log("✅捕获复制X-Nd-Auth：", key, val);
    }
    return originSetHeader.call(this, key, val);
  }

  if ("/tchMaterial/detail" === location.pathname) GM_registerMenuCommand("下载电子课本", downloadTextBook);

  function downloadTextBook() {
    let viewerSrc = document.getElementById("pdfPlayerFirefox").src;
// 'https://basic.smartedu.cn/pdfjs/2.15/web/viewer.html?file=https://r1-ndr-private.ykt.cbern.com.cn/edu_product/esp/assets/ed5f6a59-0cc5-47e9-adc3-0033711700ea.pkg/义务教育教科书 物理 九年级 全一册_1725097556591.pdf&headers={"X-ND-AUTH":"MAC id=\\"7F938B205F876FC3A30551F3A4931383650FE2F51028AC11A7012EAFEE73D81CF1D19271D0CB74A75EC73EB8CC0A31C9FD26A853F92D8427\\",nonce=\\"1751897112002:EU6LTY64\\",mac=\\"RYS/ZUwKi3D4e9gbN8LfskUwADAnuNm7uR7llkKnsVo=\\""}';
//  https://basic.smartedu.cn/pdfjs/2.15/web/viewer.html?file=https://r3-ndr-private.ykt.cbern.com.cn/edu_product/esp/assets/60add6f1-e920-4c03-993d-cb18eceee02e.pkg/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%E2%80%A2%E7%94%9F%E7%89%A9%E5%AD%A6_%E4%B8%83%E5%B9%B4%E7%BA%A7_%E4%B8%8A%E5%86%8C_%E5%8C%97%E4%BA%AC%E5%87%BA%E7%89%88%E7%A4%BE_1754905851330.pdf#disablestream=true&disableAutoFetch=true&page=15
//     let pdfHref = viewerSrc.match(/https.+file=(https[^&]+)&headers=([^#]+)(#.*)?$/);
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
