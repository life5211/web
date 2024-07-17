export default {
    uuid: '__c7bv0',
    alert: function (text) {
        alert(text);
        return false;
    }, mathRandom() {
        return `${Math.random()}`.substr(2);
    },
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
    exportExcel: function (tableEle) {
        // let sheet = XLSX.utils.table_to_sheet(tableEle);
        // var workbook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
        let workbook = XLSX.utils.table_to_book(tableEle);
        XLSX.writeFile(workbook, this.getDateTimeStr(new Date()) + '.xlsx');
    }
};
