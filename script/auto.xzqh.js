(function () {
  let util = {
    local_push(key, ls) {
      let list = this.localGet(key, []);
      list.push(...ls)
      this.localSet(key, list);
      return list.length
    }, local_pop(key) {
      let list = this.localGet(key, []);
      if (!list?.length) return alert("队列为空，已完成")
      const rst = list.pop()
      this.localSet(key, list);
      return rst;
    },
    localGet: (k, def) => JSON.parse(localStorage.getItem(k)) || def,
    localSet: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
    getPath: (path) => path.replace("/sj/tjbz/tjyqhdmhcxhfdm/2023/", ""),
    getCode: (path) => path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.')),
    getLevel(path) {
      let len = this.getCode(path)?.length
      return len === 12 ? 5 : len === 9 ? 4 : len === 6 ? 3 : len === 4 ? 2 : len === 2 ? 1 : len === 5 ? 0 : alert(`getlevel error #{path}`)
    }
  }

  let parPath = util.getPath(location.pathname),
      parCode = util.getCode(location.pathname),
      parLevel = util.getLevel(location.pathname);
  if (parLevel === 5) {

  }
  if (parLevel === 4) {

  }
  if (parLevel === 3) {

  }
  if (parLevel === 2) {

  }
  if (parLevel === 1) {

  }
  if (parLevel === 0) {
    let ls = Array.from(document.querySelectorAll(".provincetable a")).map(a => ({
      c: util.getCode(a.pathname),
      n: a.innerText,
      l: util.getLevel(a.pathname),
      p: parCode, pp: parPath
    }))
    ls.unshift({c: parCode, n: '中国', l: 0})
    util.localSet("data", ls);
  }
})()

