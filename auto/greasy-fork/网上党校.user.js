// ==UserScript==
// @name         网上党校
// @namespace    http://tampermonkey.net/
// @version      2024-10-20
// @description  try to take over the world!
// @author       You
// @match        https://wsdx.ccps.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ccps.gov.cn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(_=>document.title=document.querySelector('h3.head-title').innerText,1000)

})();