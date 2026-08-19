const util = {
  uuid: '',
  alert: function (text) {
    alert(text);
    return false;
  },
  mathRandom() {
    return `${Math.random()}`.substr(2);
  },
  localSet(key, value) {
    localStorage.setItem(key + this.uuid, JSON.stringify(value));
  },
  localGet(key, def) {
    return localStorage.hasOwnProperty(key + this.uuid) ? JSON.parse(localStorage.getItem(key + this.uuid)) : def;
  },
  sessionSet(key, value) {
    sessionStorage.setItem(key + this.uuid, JSON.stringify(value));
  },
  sessionGet(key, def) {
    return sessionStorage.hasOwnProperty(key + this.uuid) ? JSON.parse(sessionStorage.getItem(key + this.uuid)) : def;
  },
  getDateStr(date = new Date()) {
    const [fullYear, month, day] = [date.getFullYear(), `${date.getMonth() + 1}`.padStart(2, '0'), `${date.getDate()}`.padStart(2, '0')];
    return `${fullYear}-${month}-${day}`;
  },
  getTimeStr(date = new Date()) {
    return date.toTimeString().substring(0, 8);
  },
  getDateTimeStr(date = new Date()) {
    return this.getDateStr(date) + ' ' + this.getTimeStr(date);
  },
  getWeekStr(date) {
    if (!date) return '';
    return `星期${["日", "一", "二", "三", "四", "五", "六"][date.getDay()]}`;
  },
  getDateWeekStr(date) {
    return this.getDateStr(date) + ' ' + this.getWeekStr(date);
  },
  formatterDate(date) {
    return (date instanceof Date) ? this.getDateStr(date) : date
  },
  isSameDay(s, e) {
    return this.getDateStr(s) === this.getDateStr(e);
  },
  getCalcDate(date = new Date(), day, month, year) {
    if (!date instanceof Date) return null;
    let dateIncrease = new Date(date);
    if (day) dateIncrease.setDate(date.getDate() + day);
    if (month) dateIncrease.setMonth(date.getMonth() + month);
    if (year) dateIncrease.setFullYear(date.getFullYear() + year);
    return dateIncrease;
  },
  importNode(src, attr = {}, tagName = 'script') {
    let ele = document.createElement(tagName);
    Object.entries(attr).forEach(([k, v]) => ele[k] = v);
    ele.src = src;
    document.head.appendChild(ele);
  },
  addCookie(key, value, {expires, path, maxAge, domain, secure}) {
    let cookie = `${key}=${value}`;
    if (path) cookie = `${cookie};path=${path}`
    if (domain) cookie = `${cookie};domain=${domain}`
    if (expires) cookie = `${cookie};expires=${new Date(Date.now() + expires * 1000).toUTCString()}`;
    if (maxAge) cookie = `${cookie};max-age=${maxAge}`;
    if (secure) cookie = `${cookie};secure`;
    console.log(`document.cookie = '${cookie}'`);
    document.cookie = cookie;
  },
  getCookie(key) {
    for (let [k, v] of document.cookie.split('; ').filter(e => e).map(e => e.split("=")))
      if (v && key === k) return v;
    return null;
  },
  getCookies(key) {
    return document.cookie.split('; ').filter(e => e).map(e => e.split("=")).filter(kv => kv && kv.length && kv[0] && key === kv[0]).map(kv => kv[1]);
  },
  delCookie(key) {
    this.addCookie(key, 0, {maxAge: "0"});
  },
  getSearchParams(k) {
    let url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    return searchParams.get(k);
  },
  flatObj(obj) {
    return (function flat(obj, pre, result) {
      Object.entries(obj).forEach(([k, val]) => {
        let preKey = pre ? `${pre}.${k}` : k;
        if (val && 'object' === typeof val) flat(val, preKey, result);
        else if (val || val === 0 || val === false) result[preKey] = val;
      });
      return result;
    })(obj, '', {});
  },
  val(val) {
    if (['number', 'string', 'boolean'].includes(typeof val)) return val;
    if (!val) return '';
    if (val instanceof Date) return val.toLocaleDateString();
    return JSON.stringify(val);
  },
  /**
   * 导出csv文件
   * @param arr 对象数组
   * @param fileName 文件名
   * @param titles 导出标题
   */
  downloadCsv(arr, fileName = '导出', titles) {
    if (!arr?.length) return alert("导出数据为空");
    if (!titles?.length) titles = [...new Set(arr.flatMap(obj => Object.keys(obj)))];
    let content = arr.map(stu => titles.map(title => `"${this.val(stu[title])}"`).join(",")).join("\r\n");
    let blob = new Blob([`\ufeff${titles.map(e => `"${e}"`).join(",")}\r\n${content}`], {type: "text/csv;charset=utf-8"});
    let link = document.createElement('a');
    link.download = `${fileName}details_${new Date().toLocaleString()}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
  },
  async downloadExcel(objArr, fileName = '导出') {
    if (!objArr?.length) return alert("导出数据为空！");
    if (!window.XLSX) await fetch("https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js").then(r => r.text()).then(eval).catch(console.log);
    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.json_to_sheet(objArr);
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
    XLSX.writeFile(workbook, `${fileName}details_${new Date().toLocaleString()}.xlsx`);
  },
  exportExcel(tableEle, fileName = '导出') {
    let workbook = XLSX.utils.table_to_book(tableEle);
    XLSX.writeFile(workbook, `${fileName}details_${new Date().toLocaleString()}.xlsx`);
  },
  getTableHtml(arr, titles = [{label: '', prop: ''}]) {
    let ths = titles.map(e => `<th>${e.label}</th>`).join('');
    let tds = d => titles.map(e => `<td>${this.val(d[e.prop])}</td>`).join('');
    let trs = arr.map(d => `<tr>${tds(d)}</tr>`);
    return `<table style="border-collapse: collapse;border: 2px solid rgb(140 140 140);">
      <thead><tr>${ths}</tr></thead>
      <tbody>${trs}</tbody>
      </table>`;
  },
  adds: (...args) => parseFloat(args.filter(e => e).map(e => new Big(e)).reduce((a, b) => a.plus(b), new Big(0)).toString()),
  add: (a, b) => parseFloat(new Big(a || 0).plus(new Big(b || 0)).toString()),
  minus: (a, b) => parseFloat(new Big(a || 0).minus(new Big(b || 0)).toString()),
  times: (a, b) => parseFloat(new Big(a || 0).times(new Big(b || 0)).toString()),
  div: (a, b, x = 2) => parseFloat(new Big(a || 0).div(new Big(b || 1)).round(x).toString()),
  rf: (min, max) => Math.floor(1000 * (min + (max - min) * Math.random())),
  q: (selector, ele = document) => ele.querySelector(selector),
  qa: (selector, ele = document) => Array.from(ele.querySelectorAll(selector)),
  $GmGet: (key, def = {}) => JSON.parse(GM_getValue(key, JSON.stringify(def))),
  $GmSet: (key, val) => GM_setValue(key, JSON.stringify(val)),
  run: (...fun) => fun.forEach(f => f()),
  runInterval(handler, min = 40, max = 60) {
    return setInterval(_ => setTimeout(handler, this.rf(min, max)), this.rf(min, max))
  },
  $runInterval(fun, min = 60, max = 180, ids = []) {
    fun();
    ids.push(setTimeout(_ => this.$runInterval(fun, min, max, ids), this.rf(min, max)));
    return ids;
  },
  compareFn(a, b, ...fields) {
    const fnc = (m, n) => m === undefined ? -1 : n === undefined ? 1 : m.localeCompare ? m.localeCompare(n) : m > n ? 1 : m < n ? -1 : 0;
    if (!fields?.length) return fnc(a, b);
    for (let f of fields) if (f && a[f] !== b[f]) return fnc(a[f], b[f]);
    return 0;
  },
  log(msg, k = `log_${new Date().getDate()}`) {
    console.log(msg);
    let log = this.localGet(k, []);
    log.unshift(`[${new Date().toLocaleString()}]${msg}`);
    this.localSet(k, log);
  },
  clearCookie() {
    GM_cookie.list({}, cookies => {
      if (!cookies.length) return util.log(`当前无Cookie`);
      cookies.forEach(cookie => {
        GM_cookie.delete({
          url: location.origin,
          name: cookie.name,
          domain: cookie.domain,
          path: cookie.path
        }, delErr => {
          if (delErr) console.warn('删除失败：', cookie.name, delErr);
          else console.log('已删除：', cookie.name);
        });
      });
    });
  },
  parseJWT(token) {
    const base64Url = token.split('.')[1]; // 获取载荷部分
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // 替换Base64字符
    let jwt = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
    // const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    // let jwt = JSON.parse(jsonPayload);
    this.localSet("jwt", jwt);
    let exp = new Date(jwt?.exp * 1000).toLocaleString();
    this.localSet('exp', exp);
    console.log(jwt, exp);
    return jwt; // 返回JSON对象
  },
  print(selector, ele) {
    this.q(selector, ele).style.visibility = "visible"
    document.body.style.visibility = "hidden"
  }
};
export default util;
