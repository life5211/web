// ==UserScript==
// @name         文档在线预览
// @namespace    com.life5211.officeOnline
// @version      1.2
// @description  用于在线预览文档
// @author       life5211
// @match        *.e21cn.com/*
// @match        *.ncpta.cn/*
// @match        *.gov.cn/*
// @match        *.edu.cn/*
// @icon         https://media-cdn.microsoftstore.com.cn/media/category/office2019/icon-word.png
// ==/UserScript==

(function () {
  'use strict';
  const fileTypes2312 = ("doc,docx,wps,odt,rtf,xls,xlsx,et,ods,csv,ppt,pptx,dps,odp,pdf,ofd,txt,jpg,jpeg,gif,png,bmp,tif,tiff," +
      "mp3,m4a,mid,midi,wma,mp4,mov,zip,rar,tar,7z,dwg,dxf,dwf,xml,js,css,java,cpp,cs,sql,bat,json,conf").split(',');

  setTimeout(() => document.querySelectorAll('a').forEach(aTag => {
    if (!aTag || !aTag.href || !aTag.href.includes('.')) return;
    // http://static.e21cn.com/tools/file.ashx?id=0286726627daf08d5f34f529c24c1736.xls
    // const fileType = aTag.href.match(/\.([^.]+)$/)[1];
    // const fileType = aTag.href.split('.').pop().toLocaleLowerCase();
    // console.log(`信息========${aTag.href}`);
    if (aTag.href.includes('e21cn.com/tools/file.ashx?')) {
      nodeCloneWeb2312(aTag, `http://static.sz.e21cn.com/${aTag.href.split('id=')[1]}`);
    } else if (fileTypes2312.includes(aTag.href.match(/\.([^.]+)$/)[1])) {
      nodeCloneWeb2312(aTag, aTag.href);
    } else if (aTag.innerText && aTag.innerText.startsWith('附件')) {
      nodeCloneWeb2312(aTag, aTag.href);
    }
  }), 500);

  function nodeCloneWeb2312(aTag, href) {
    const eu = encodeURIComponent, encodeUri = eu(href), element = document.createElement("span");
    aTag.append(element);
    element.innerHTML = `
      <a target="_blank" style="color: red" href="https://api.idocv.com/view/url?url=${encodeUri}"> [[idoc]] </a>
      <a target="_blank" style="color: red" href="http://www.pfile.com.cn/api/profile/onlinePreview?url=${encodeUri}">[[pdoc]]</a>
      <a target="_blank" style="color: red" href="https://view.xdocin.com/view?src=${encodeUri}"> [[xdoc]] </a>
      <a target="_blank" style="color: green" href="https://view.officeapps.live.com/op/view.aspx?src=${encodeUri}">[microsoft]</a>
      <a target="_blank" style="color: blue" href="https://file.kkview.cn/onlinePreview?url=${eu(btoa(href))}"> [[kkView]] </a>
    `;
  }
  document.createLink2312 = () => {
    const ie = document.getElementById("crtLink2312");
    if (!ie.value) return;
    nodeCloneWeb2312(ie.parentElement, ie.value);
  }
  const div = document.createElement("div");
  div.innerHTML = `<input id="crtLink2312" onblur="createLink2312()" style="width:100%"/>`;
  document.body.insertBefore(div, document.body.firstChild);
})();
