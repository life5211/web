// ==UserScript==
// @name        在川招生各专业类录取分数统计AI
// @namespace   Javascript
// @match       *://zydwf.sceeic.cn/*
// @version     V0.1
// @author      null
// @description 在川招生各专业类录取分数统计报表；
// @license MIT
// ==/UserScript==

(async function () {
  'use strict';

  async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  let zyCodeRsp = await fetch("/yxzydwf/")
  Object.entries(zyCodeRsp.json().data).flatMap(([kl, klo]) => {
    return Object.entries(klo).flatMap(([cc, cco]) => {
      return Object.entries(cco).flatMap(([dl, zyls]) => {
        return zyls.map(zyl => {
          zyl.dl = dl;
          zyl.cc = cc;
          zyl.kl = kl;
          return zyl;
        })
      })
    })
  })

  const rf = (min, max) => 1000 * Math.floor(min + (max - min) * Math.random());

  const zydms = ["4101", "4102", "4103", "4104", "4201", "4202", "4203", "4204", "4205", "4207", "4208", "4209", "4301", "4302", "4303", "4304", "4305", "4306", "4307", "4401", "4402", "4403", "4404", "4405", "4406", "4407", "4501", "4502", "4504", "4601", "4602", "4603", "4604", "4605", "4606", "4607", "4701", "4702", "4801", "4802", "4803", "4804", "4901", "4902", "5001", "5002", "5003", "5004", "5006", "5007", "5101", "5102", "5103", "5104", "5201", "5202", "5203", "5204", "5205", "5206", "5207", "5208", "5209", "5301", "5302", "5303", "5304", "5305", "5306", "5307", "5308", "5401", "5402", "5501", "5502", "5503", "5504", "5601", "5602", "5701", "5702", "5703", "5801", "5802", "5803", "5804", "5805", "5806", "5807", "5901", "5902", "5903", "5904"]
      .sort(e => Math.random() - 0.3);
  document.zyls = [];
  let idx = 0;
  (function queryLqsj() {
    const zyldm = zydms[idx++];
    fetch('/yxzydwf/', {
          method: 'post',
          body: JSON.stringify({kelei: "理科", cc: "专科", zyldm}),
          headers: {"Content-Type": "application/json"}
        }
    ).then(r => r.json()).then(rsp => {
      console.log(JSON.stringify(rsp))
      document.zyls = document.zyls.concat(rsp.data.map(e => {
        e.zyldm = zyldm;
        e.zylmc = rsp.zylmc;
        return e
      }));
      if (idx < zydms.length) setTimeout(queryLqsj, rf(1, 3));
    })
  })()

  const paramsBk = ["0000", "0101", "0201", "0202", "0203", "0204", "0301", "0302", "0303", "0305", "0306", "0401", "0402", "0501", "0502", "0503", "0601", "0701", "0702", "0703", "0704", "0705", "0706", "0707", "0708", "0709", "0710", "0711", "0712", "0801", "0802", "0803", "0804", "0805", "0806", "0807", "0808", "0809", "0810", "0811", "0812", "0813", "0814", "0815", "0816", "0817", "0818", "0819", "0820", "0821", "0822", "0823", "0824", "0825", "0826", "0827", "0828", "0829", "0830", "0831", "0901", "0902", "0903", "0904", "0905", "0906", "0907", "1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008", "1009", "1010", "1011", "1101.0", "1201", "1202", "1203", "1204", "1205", "1206", "1207", "1208", "1209", "1301", "1302", "1303", "1304", "1305", "2001"]
      .map(e => ({kelei: "理科", cc: "本科", zyldm: e})).sort(e => Math.random() - 0.3);
  (function qryF() {
    const param = paramsBk[idx++];
    axios({method: 'post', url: '/yxzydwf/', data: param}).then(async rsp => {
      if (rsp.data.code === 200) {
        rsp.data.data.forEach(e => {
          e.zyldm = param.zyldm;
          e.zylmc = rsp.data.zylmc;
        });
        document.zyls = document.zyls.concat(rsp.data.data);
      }
    })
    if (idx < zydms.length) setTimeout(qryF, rf(1, 3));
  })()

  (async function downloadExcel(fileName, objArr) {
    if (!objArr?.length) return alert("导出数据为空！");
    (await fetch("https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js")).text().then(eval).then(js => {
      let workbook = XLSX.utils.book_new();
      let worksheet = XLSX.utils.json_to_sheet(objArr);
      XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
      XLSX.writeFile(workbook, `${fileName}details_${new Date().getTime()}.xlsx`);
    })
  })("理科本二批院校", document.yxs);


  (function downloadCsv(fileName, objArr) {
    let tableCols = [...new Set(objArr.flatMap(s => Object.keys(s)))];
    let contentString = objArr.map(rol => tableCols.map(col => `${rol[col]}`).join(",")).join("\n");
    let blob = new Blob([`\ufeff${tableCols.join(",")}\n${contentString}`], {type: "text/csv;charset=utf-8"});
    let csvUrl = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.download = `${fileName}details_${new Date().getTime()}.csv`;
    link.href = csvUrl;
    link.click();
  })("理科本科录取数据", []);

})()

(async function () {
  let page = 1;
  document.yxs = [];
  (function queryYuanxiao() {
    if (page > 93) return alert("完成");
    fetch('/zyfz/chaxun/yuanxiao/', {
          method: 'post',
          body: JSON.stringify({
            "pc": "本科二批",
            "gjc": "",
            "diyu": [],
            "leixin": [],
            "bxxz": [],
            "dwf": [],
            "weici1": [],
            "weici": [],
            "is985": false,
            "is211": false,
            "issyl": false,
            "hzbx": false,
            "yema": page,
            "jfx": 0
          }),
          headers: {"Content-Type": "application/json"}
        }
    ).then(r => r.json()).then(rsp => {
      document.yxs = document.yxs.concat(rsp.data.list);
      fetch('/zyfz/tongji/', {
        method: 'post',
        body: JSON.stringify({"weizhi": "院校查询", "xuexiao": "院校查询"}),
        headers: {"Content-Type": "application/json"}
      });
      page++;
      setTimeout(queryYuanxiao, 511);
    }).catch(r => alert(r));
  })();
})();
