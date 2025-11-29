(function () {
  let time = new Date(new Date().toLocaleDateString() + " 10:00:00").getTime();
  let interval = setInterval(_ => {
    if (Date.now() >= time) {
      console.log(Date.now() - time);
      document.querySelector(".fixedBtn>.btnCon").click();
      console.log(Date.now() - time, "时间");
      clearInterval(interval);
    }
  }, 1);
})();
