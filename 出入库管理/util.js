const util = {
  uuid: '_bound_',
  getIncrease() {
    const id = 1 + this.localGet("id", 1);
    this.localSet("id", id);
    return id;
  }, alert(text) {
    alert(text);
    return false;
  },
  /**
   * 生成一个增长不重复ID
   * @param { Number } randomLength
   */
  getUuid: (randomLength) => Number(Date.now() - 1695345040467 + Math.random().toString().substr(2, randomLength)).toString(36),
  mathRandomStr: _ => `${Math.random()}`.substr(2),
  getKeys: jsonArr => [...new Set(jsonArr.flatMap(s => Object.keys(s)))],
  adds: (...args) => parseFloat(args.filter(e => e).map(e => new Big(e)).reduce((a, b) => a.plus(b), new Big(0)).toString()),
  add: (a, b) => parseFloat(new Big(a).add(new Big(b)).toString()),
  minus: (a, b) => parseFloat(new Big(a).minus(new Big(b)).toString()),
  times: (a, b) => parseFloat(new Big(a).times(new Big(b)).toString()),
  div: (a, b) => parseFloat(new Big(a).div(new Big(b)).round(3).toString()),
  localSet(key, value) {
    localStorage.setItem(key + this.uuid, JSON.stringify(value));
  }, localGet(key, def) {
    const item = localStorage.getItem(key + this.uuid);
    if (item === null) return def;
    return JSON.parse(item);
  }, localGetParseDate(key, def) {
    return this.localGet(key, def)?.map(e => {
      // if (e.入库时间) e.入库时间 = new Date(e.入库时间);
      Object.keys(e).forEach(k => {
        if (k?.includes('时间') || k?.includes('日期')) e[k] = new Date(e[k]);
      })
      return e;
    });
  }, getDateStr(date) {
    if (!date) return '';
    const [fullYear, month, day] = [date.getFullYear(), `${date.getMonth() + 1}`.padStart(2, '0'), `${date.getDate()}`.padStart(2, '0')];
    return `${fullYear}-${month}-${day}`;
  }, getTimeStr(date) {
    if (!date) return '';
    return date.toTimeString().substring(0, 8);
  }, getDateTimeStr(date) {
    return this.getDateStr(date) + ' ' + this.getTimeStr(date);
  }, getWeekStr(date) {
    if (!date) return '';
    return `星期${["日", "一", "二", "三", "四", "五", "六"][date.getDay()]}`;
  }, getDateWeekStr(date) {
    return this.getDateStr(date) + ' ' + this.getWeekStr(date);
  },
  /**
   * @return yyyy年[春/秋]季学期
   * 判断学期
   * @param date {Date}
   */
  getSemester(date) {
    if (!date) return '';
    if (!date instanceof Date) return '';
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    if (m > 7) return `${y}年秋季学期`;
    if (m > 1) return `${y}年春季学期`;
    return `${y - 1}年秋季学期`;
  },
  formatter(e) {
    return (e instanceof Date) ? this.getDateStr(e) : e
  },
  isSameDay(s, e) {
    return this.getDateStr(s) === this.getDateStr(e);
  },
  getCalcDate(date, day, month, year) {
    if (!date instanceof Date) return null;
    let dateIncrease = new Date(date);
    if (day) dateIncrease.setDate(date.getDate() + day);
    if (month) dateIncrease.setMonth(date.getMonth() + month);
    if (year) dateIncrease.setFullYear(date.getFullYear() + year);
    return dateIncrease;
  },
  compareFn(a, b, ...fields) {
    const fnc = (m, n) => m === n ? 0 : m === undefined ? -1 : n === undefined ? 1 : m.localeCompare ? m.localeCompare(n) : m > n ? 1 : -1;
    if (!fields?.length) return fnc(a, b);
    for (let f of fields) if (f) return fnc(a[f], b[f]);
    return 0;
  },
  exportTableExcel: function (tableEle, filename) {
    // let sheet = XLSX.utils.table_to_sheet(tableEle);
    // var workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
    let workbook = XLSX.utils.table_to_book(tableEle);
    XLSX.writeFile(workbook, `${filename} ${this.getDateTimeStr(new Date())}.xlsx`);
  },
  exportJsonExcel: function (jsonArr, filename) {
    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.json_to_sheet(jsonArr);
    XLSX.utils.book_append_sheet(workbook, worksheet, filename);
    XLSX.writeFile(workbook, `${filename} ${this.getDateTimeStr(new Date())}.xlsx`);
  }
};
