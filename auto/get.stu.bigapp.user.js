// ==UserScript==
// @name         SCEDU导出Excel信息
// @namespace    http://tampermonkey.net/
// @author       4.17
// @version      0.17
// @description  查询并导出
// @icon         https://bigapp.scbdc.edu.cn/zssx/web/assets/favicon-DcRCLhRm.png
// @match        https://bigapp.scbdc.edu.cn/zssx/web/*
// @downloadURL  https://life5211.github.io/web/auto/get.stu.bigapp.user.js
// @updateURL    https://life5211.github.io/web/auto/get.stu.bigapp.user.js
// @noframes
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

GM_registerMenuCommand("一键下载", getInfoByScript, "");

function getInfoByScript() {
  let token = sessionStorage["SZ_YSX_WEBTOKEN"] || sessionStorage["SZ_XSC_WEBTOKEN"];
  let _jhPcId = sessionStorage["SZ_YSX_WEB_planId"] || sessionStorage["SZ_XSC_WEB_planId"];
  let type = sessionStorage["SZ_YSX_WEBTOKEN"] ? "xx" : "cz";
  fetch(`/zssxapi/${type}/checks/studentList`, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/json;charset=UTF-8",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Microsoft Edge\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      token
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `{\"jhpcid\":\"${_jhPcId}\",\"condition\":\"\",\"zshpid\":\"\",\"sfbd\":-1,\"cpage\":1,\"psize\":50}`,
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
  }).then(r => r.json()).then(r => {
    const arr = r.C;
    const stuArr = [];

    (function getFun() {
      let stu = arr.pop();
      if (stu) {
        fetch(`/zssxapi/${type}/student/get_stu_audit_info?stuid=${stu.xsxxid}&jhpcid=${stu.jhpcid}&qtpc=true`, {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Microsoft Edge\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            token
          },
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": null,
          "method": "GET",
          "mode": "cors",
          "credentials": "omit"
        }).then(rsp => rsp.json()).then(rsp => {
          stuArr.push(rsp.C);
          setTimeout(getFun, 133);
        });
      }
      if (!stu) {
        console.log(document.stuArr = stuArr);

        function flatObj(obj, pre = '', result = {}) {
          Object.keys(obj).forEach(k => {
            if ("txxyq" === k) return;
            let preKey = pre ? `${pre}.${k}` : k;
            const val = obj[k];
            if ('object' === typeof val && val) flatObj(val, preKey, result);
            else if (val || val === 0 || val === false) result[preKey] = val;
          });
          return result;
        }

        let stuArrClone = JSON.parse(JSON.stringify(stuArr));
        let stuInfos = stuArrClone.map(s => {
          s.prove_info?.forEach(info => info?.pz?.txxmc?.forEach((mc, i) => info[mc] = info.wbxx[i]));
          return flatObj(s);
        });
        console.log(document.sduInfos = stuInfos);

        (async function downloadExcelStudent(fileName, objArr) {
          if (!objArr?.length) return alert("导出数据为空！");
          (await fetch("https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js")).text().then(eval)
          let workbook = XLSX.utils.book_new();
          let worksheet = XLSX.utils.json_to_sheet(objArr);
          XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
          XLSX.writeFile(workbook, `${fileName}details_${Date.now()}.xlsx`);
        })("报名学生信息", stuInfos);
      }
    })();
  });
}
