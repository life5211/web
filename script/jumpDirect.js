// ==UserScript==
// @name         链接直接跳转
// @namespace    com.life5211.jumpDirect
// @version      0.1
// @description  try to take over the world!
// @author       life5211
// @match        https://*.zhihu.com/*
// @match        https://*.jianshu.com/*
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  setTimeout(() => Array.from(document.getElementsByTagName('a')).forEach(aTag => {
    if (aTag && aTag.href) {
      if (aTag.href.startsWith('https://link.zhihu.com/?target=')) {
        //https://link.zhihu.com/?target=www.v2ex.com
        aTag.href = decodeURIComponent(aTag.href.replace('https://link.zhihu.com/?target=', ''));
      }
      if (aTag.href.startsWith('https://link.jianshu.com/?t=')) {
        aTag.href = decodeURIComponent(aTag.href.replace('https://link.jianshu.com/?t=', ''));
      }
      if (aTag.href.startsWith('https://weibo.cn/sinaurl?u=')) {
        aTag.href = decodeURIComponent(aTag.href.replace('https://weibo.cn/sinaurl?u=', ''));
      }
    }
  }), 500);
})();
