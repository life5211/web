export default {
  uuid: '__c7bv0',
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
  addCookie(key, value, {expires, path, maxAge, domain, secure}) {
    let cookie = `${key}=${value}`;
    if (path) cookie = `${cookie};path=${path}`
    if (domain) cookie = `${cookie};domain=${domain}`
    if (expires) cookie = `${cookie};expires=${new Date(new Date().getTime() + expires * 1000).toUTCString()}`;
    if (maxAge) cookie = `${cookie};max-age=${maxAge}`;
    if (secure) cookie = `${cookie};secure`;
    console.log(`document.cookie = '${cookie}'`);
    document.cookie = cookie;
  },
  getCookie(key) {
    for (let kv of document.cookie.split('; ').filter(e => e).map(e => e.split("=")))
      if (kv && kv.length && kv[0] && key === kv[0]) return kv[1];
    return null;
  },
  getCookies(key) {
    return document.cookie.split('; ').filter(e => e).map(e => e.split("=")).filter(kv => kv && kv.length && kv[0] && key === kv[0]).map(kv => kv[1]);
  },
  delCookie(key) {
    this.addCookie(key, 0, {maxAge: "0"});
  },
  exportExcel(tableEle) {
    // let sheet = XLSX.utils.table_to_sheet(tableEle);
    // var workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
    let workbook = XLSX.utils.table_to_book(tableEle);
    XLSX.writeFile(workbook, this.getDateTimeStr(new Date()) + '.xlsx');
  },
  adds: (...args) => parseFloat(args.filter(e => e).map(e => new Big(e)).reduce((a, b) => a.plus(b), new Big(0)).toString()),
  add: (a, b) => parseFloat(new Big(a || 0).plus(new Big(b || 0)).toString()),
  minus: (a, b) => parseFloat(new Big(a || 0).minus(new Big(b || 0)).toString()),
  times: (a, b) => parseFloat(new Big(a || 0).times(new Big(b || 0)).toString()),
  div: (a, b, x = 2) => parseFloat(new Big(a || 0).div(new Big(b || 1)).round(x).toString()),
  rf: (min, max) => Math.floor(1000 * (min + (max - min) * Math.random())),
  q: selector => document.querySelector(selector),
  qa: selector => Array.from(document.querySelectorAll(selector)),
  $GmGet: (key, def = {}) => JSON.parse(GM_getValue(key, JSON.stringify(def))),
  $GmSet: (key, val) => GM_setValue(key, JSON.stringify(val)),
  run: (...fun) => fun.forEach(f => f()),
  runInterval(handler, min = 40, max = 60) {
    return setInterval(_ => setTimeout(handler, this.rf(min, max)), this.rf(min, max))
  },
  $runInterval(fun, min = 60, max = 180, ids = []) {
    fun();
    ids.push(setTimeout(_ => this.$runInterval(fun, min, max, ids), $rf(min, max)));
    return ids;
  },
  runIntervalByTimeout(handler, min = this.rf(40, 50), max = this.rf(50, 60), nums = []) {
    handler();
    nums.push(setTimeout(_ => this.runIntervalByTimeout(handler, min, max, nums), this.rf(min, max)));
    return nums;
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
    $localSet(k, log);
  },
  parseJWT(token) {
    const base64Url = token.split('.')[1]; // 获取载荷部分
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // 替换Base64字符
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    let jwt = JSON.parse(jsonPayload);
    this.localSet("jwt", jwt);
    let exp = new Date(jwt?.exp * 1000).toLocaleString();
    this.localSet('exp', exp);
    console.log(jwt, exp);
    return jwt; // 返回JSON对象
  }
};
