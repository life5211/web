// ==UserScript==
// @name         中小学智慧教育平台电子课本解析下载
// @version      v250707
// @description  强制显示 PDF.js 工具栏按钮
// @author       user
// @run-at       document-end
// @icon         https://basic.smartedu.cn/img/entrance.ebbe1413.png
// @match        https://basic.smartedu.cn/tchMaterial/detail*
// @license      MIT
// ==/UserScript==

// 强制显示所有工具栏按钮JS注入CSS
(function () {
  const style = document.createElement('style');
  style.textContent = `
  .toolbar, .findbar, .download, .print {
    display: block !important;
    visibility: visible !important;
  }
`;
  document.head.appendChild(style);
})();
// 添加下载事件
window.addEventListener("load", function () {
  let div = document.createElement('div');
  div.innerHTML = '<span id="down" title="点击下载电子课本" style="color: cornflowerblue;cursor: pointer">下载电子课本</span>'
  document.querySelector("div.theme-zxx-logo").parentNode.parentNode.append(div)
  // document.querySelector("span.fish-breadcrumb-link").parentNode.append(div)
  document.querySelector("#down").onclick = function downloadTextBook() {
    let viewerSrc = document.getElementById("pdfPlayerFirefox").src;
// 'https://basic.smartedu.cn/pdfjs/2.15/web/viewer.html?file=https://r1-ndr-private.ykt.cbern.com.cn/edu_product/esp/assets/ed5f6a59-0cc5-47e9-adc3-0033711700ea.pkg/义务教育教科书 物理 九年级 全一册_1725097556591.pdf&headers={"X-ND-AUTH":"MAC id=\\"7F938B205F876FC3A30551F3A4931383650FE2F51028AC11A7012EAFEE73D81CF1D19271D0CB74A75EC73EB8CC0A31C9FD26A853F92D8427\\",nonce=\\"1751897112002:EU6LTY64\\",mac=\\"RYS/ZUwKi3D4e9gbN8LfskUwADAnuNm7uR7llkKnsVo=\\""}';
    let pdfHref = viewerSrc.match(/https.+file=(https[^&]+)&headers=([^#]+)(#.*)?$/);
    let arr = /https.+file=(https[^&]+)&headers=([^#]+)(#.*)?$/.exec(viewerSrc);
    console.log(viewerSrc, arr, pdfHref);
    if (!arr?.length || !arr[1] || !arr[2]) return alert("解析失败");
    fetch(arr[1], {headers: JSON.parse(decodeURI(arr[2]))})
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
  };
});
(function () {
  const authKey = Object.keys(localStorage).find(key => key.startsWith("ND_UC_AUTH"));
  if (!authKey) return console.error("未找到 Access Token，请确保已登录！");
  const tokenData = JSON.parse(localStorage.getItem(authKey));
  const accessToken = JSON.parse(tokenData.value).access_token;
  console.log("%cAccess Token:", "color: green; font-weight: bold", accessToken);
})();