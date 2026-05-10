export default {
  uuid: '__c7bv0',
  alert: function (message, type = 'info') {
    ELEMENT.Message({message, type})
  },
  mathRandom() {
    return `${Math.random()}`.substr(2);
  },
  adds: (...args) => parseFloat(args.filter(e => e).map(e => new Big(e)).reduce((a, b) => a.plus(b), new Big(0)).toString()),
  add: (a, b) => parseFloat(new Big(a || 0).plus(new Big(b || 0)).toString()),
  minus: (a, b) => parseFloat(new Big(a || 0).minus(new Big(b || 0)).toString()),
  times: (a, b) => parseFloat(new Big(a || 0).times(new Big(b || 0)).toString()),
  div: (a, b, x = 2) => parseFloat(new Big(a || 0).div(new Big(b || 1)).round(x).toString()),
  localSet: function (key, value) {
    localStorage.setItem(key + this.uuid, JSON.stringify(value));
  },
  localGet: function (key) {
    return JSON.parse(localStorage.getItem(key + this.uuid));
  },
  getDateStr: function (date) {
    const [fullYear, month, day] = [date.getFullYear(), `${date.getMonth() + 1}`.padStart(2, '0'), `${date.getDate()}`.padStart(2, '0')];
    return `${fullYear}-${month}-${day}`;
  },
  getTimeStr: function (date) {
    return date.toTimeString().substring(0, 8);
  },
  getDateTimeStr: function (date) {
    return this.getDateStr(date) + ' ' + this.getTimeStr(date);
  },
  addCookie(key, value, {expires, path, maxAge, domain, secure}) {
    let cookie = `${key}=${value}`;
    if (path) cookie = `${cookie};path=${path}`
    if (domain) cookie = `${cookie};domain=${domain}`
    if (expires) cookie = `${cookie};expires=${new Date(new Date().getTime() + expires * 1000).toUTCString()}`;
    if (maxAge) cookie = `${cookie};max-age=${maxAge}`;
    if (secure) cookie = `${cookie};secure`;
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
  exportExcel: function (tableEle) {
    // let sheet = XLSX.utils.table_to_sheet(tableEle);
    // var workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
    let workbook = XLSX.utils.table_to_book(tableEle);
    XLSX.writeFile(workbook, "账单详情" + this.getDateTimeStr(new Date()) + '.xlsx');
  }
};
