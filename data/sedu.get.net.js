(function() {
    // 获取题库信息
    document.qas = JSON.parse(localStorage.getItem("qas")) || [];
    let id = 5959,
        run = fun => setTimeout(fun, 181 + 424 * Math.random()); //5228 5229-5959
    (function queryQues() {
        if (id < 5229) return alert("完成");
        fetch('https://api-examsys.sctce.cn/api/app/question/getById?id=' + id--).then(r => r.json()).then(data => {
            document.qas = document.qas.concat(data);
            localStorage.setItem("qas", JSON.stringify(document.qas));
            run(queryQues)
        }).catch(e => {
            console.error("数据获取异常信息", id + 1, e);
            run(queryQues)
        });
    })();
})();

function unique(arr) {
    return arr.reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], []);
}

function compareFn(a, b, ...fields) {
    const fnc = (m, n) => m === undefined ? -1 : n === undefined ? 1 : m.localeCompare ? m.localeCompare(n) : m > n ? 1 : m < n ? -1 : 0;
    if (!fields ?.length) return fnc(a, b);
    for (let f of fields)
        if (f && a[f] !== b[f]) return fnc(a[f], b[f]);
    return 0;
}

let q0 = document.qas.map(e => ({ q: e.title, a: e.questionItems.filter(i => i.isRight).map(i => i.content), n: categoryId }));
(function(){ // 问题去重排序
    let qasArr = [],
    qaScript = [];
    [...q0, ...q1, ...q2].forEach(e => {
    e.a.sort(compareFn);
    let t = `q:${e.q},a:${e.a.join()}`;
    if (!qasArr.includes(t)) qaScript.push(e);
    qasArr.push(t)
});
qaScript.sort((a, b) => compareFn(a, b, 'q'))
})()


document.excel = document.qas.map(e => ({ q: e.title, a: q.questionItems.filter(i => i.isRight).map(i => i.content).join(";\n"), n: categoryId }));
(async function downloadExcel(fileName, objArr) {
    if (!objArr ?.length) return alert("导出数据为空！");
    (await fetch("https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js")).text().then(eval).then(_ => {
        let workbook = XLSX.utils.book_new();
        let worksheet = XLSX.utils.json_to_sheet(objArr);
        XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
        XLSX.writeFile(workbook, `${fileName}_${Date.now()}.xlsx`);
    })
})("公需科目", document.excel);