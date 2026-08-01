// ==UserScript==
// @name         中小学智慧教育平台假期研修学习脚本
// @version      17.2
// @icon         https://basic.smartedu.cn/img/logo-icon.abf693b9.png
// @description  支持2倍速，下一视频切换
// @author       user
// @match        https://basic.smartedu.cn/*
// @downloadURL  https://life5211.github.io/web/auto/play.smart.zxx.user.js
// @updateURL    https://life5211.github.io/web/auto/play.smart.zxx.user.js
// @run-at       document-end
// @grant none
// @license      MIT
// ==/UserScript==

(function () {
  const rf = (min, max) => Math.floor(1000 * (min + (max - min) * Math.random())),
      loop = (callback, minS, maxS) => {
        let id = 0;
        const run = () => {
          callback();
          id = setTimeout(run, rf(minS, maxS));
        }
        id = setTimeout(run, rf(minS, maxS));
        return _ => clearTimeout(id);
      },
      lf = (...args) => {
        console.log('[playing]', ...args);
      },
      localSet = (key, value) => localStorage.setItem(key, JSON.stringify(value)),
      localGet = (key, def) => localStorage.hasOwnProperty(key) ? JSON.parse(localStorage.getItem(key)) : def,
      isElementVisible = el => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        if (rect.width === 0 || rect.height === 0) return false;
        if (style.display === "none") return false;
        if (style.visibility === "hidden") return false;
        if (Number(style.opacity) <= 0) return false;
        // 遍历父级
        let p = el.parentElement;
        while (p) {
          const ps = getComputedStyle(p);
          if (ps.display === "none" || ps.visibility === "hidden" || Number(ps.opacity) <= 0) {
            return false;
          }
          p = p.parentElement;
        }
        return true;
      },
      click = el => {
        if (!el || !isElementVisible(el)) return;
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width * Math.random();
        const y = rect.top + rect.height * Math.random();
        el.dispatchEvent(new MouseEvent('mouseover', {clientX: x, clientY: y}));
        el.dispatchEvent(new MouseEvent('mousedown', {clientX: x, clientY: y}));
        el.dispatchEvent(new MouseEvent('mouseup', {clientX: x, clientY: y}));
        el.click();
      },
      keyClick = el => {
        if (!el || !isElementVisible(el)) return;
        el.focus();
        // 派发回车
        el.dispatchEvent(new KeyboardEvent('keydown', {key: 'Space', bubbles: true}));
        el.dispatchEvent(new KeyboardEvent('keyup', {key: 'Space', bubbles: true}));
      },
      getSearchParams = k => {
        let url = new URL(window.location.href);
        let searchParams = new URLSearchParams(url.search);
        return searchParams.get(k);
      }
  ;

  if (location.pathname === '/teacherTraining/courseIndex') {
    setTimeout(_ => click(document.querySelector('section a[class^=CourseIndex]')), rf(6, 16));
  }
  if (location.pathname === '/teacherTraining/courseDetail') {
    setTimeout(function () {
      loop(function () {
        click(document.querySelector("div.fish-modal-confirm-btns>button.fish-btn"));
        click(document.querySelector("button[title='Play Video']"));
      }, 2, 5.3);

      loop(function () {
        let video = document.querySelector("video");
        if (!video) return lf("没有video媒体");

        if (!video.title) {
          // video.muted = true;
          // video.autoplay = true;
          // video.playbackRate = 2;
          video.title = 'playing';
          video.addEventListener('ended', end_next_video);
          // document.querySelector("video").dispatchEvent(new Event("ended"));
        }
        lf({m: "播放进度", t: video.currentTime, l: video.duration, now: Date.now()});

        if (video.ended) end_next_video();

        if (!document.querySelector("video").paused) return lf("Playing……");
        video.play().then(e => lf('paused', e)).catch(e => lf('playErr', e));
      }, 44, 77);
    }, rf(5, 9.1));
  }

  async function end_next_video() {
    lf('视频播放完了');
    const train_courses = localGet("train_courses", []);
    const train_courses_json = localGet("train_courses_json", {});
    let train_courses_user_list = await fetch(`https:${localStorage.train_courses_user_list_url}`,
        {headers: {Authorization: window._ndAuth}}
    ).then(r => r.json());
    // const train_courses_user_list = localGet("train_courses_user_list", {});
    let phase_limit = train_courses_json.train_phase_list.reduce((o, e) => {
      o[e.id] = e.total_period_hour;
      return o;
    }, {});
    let phase_user = train_courses.filter(e => e.phase_id).reduce((o, e) => {
      o[e.phase_id] = (o[e.phase_id] || 0) + (train_courses_user_list[e.course_id] || 0);
      return o;
    }, {});
    train_courses.forEach(e => {
      e.user_period = train_courses_user_list[e.course_id];
      e.user_status = train_courses_user_list[`${e.course_id}-status`];
      if (!e.phase_id) e.user_next = e.user_period < e.max_period;
      if (e.phase_id) e.user_next = phase_user[e.phase_id] < phase_limit[e.phase_id];
    });
    localSet("train_courses", train_courses);
    let course = train_courses.find(e => e.course_id === getSearchParams('courseId'));
    if (course.user_next) {
      let next_video = document.querySelector("i[title=未开始]");
      if (!next_video) document.querySelector('div.fish-collapse-header[role=button][aria-expanded="false"]')?.click()
      next_video = document.querySelector("i[title=未开始]");
      if (next_video) setTimeout(_ => next_video.parentElement.parentElement.parentElement.click(), rf(3, 10));
    } else {
      let next_course = train_courses.find(e => e.user_next);
      if (!next_course) return alert('学习完毕');
      location.href = `/teacherTraining/courseIndex?courseId=${next_course.course_id}`;
    }
  }

})();
