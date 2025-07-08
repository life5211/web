// ==UserScript==
// @name         秒过2025年智慧中小学寒假教师研修，每个视频多点几遍，疯狂点鼠标左键
// @namespace    http://tampermonkey.net/
// @version      0.66
// @author       hydrachs
// @description  2025年智慧中小学寒假教师研修，勉强算秒过，看提示。有问题可以联系我https://space.bilibili.com/15344563。其他人均为假冒，不要相信。刷课效果可以见https://www.bilibili.com/video/BV19f421q7hA
// @license MIT
// @match        https://basic.smartedu.cn/*
// @match        https://www.smartedu.cn/*
// @match        https://teacher.vocational.smartedu.cn/*
// @match        https://core.teacher.vocational.smartedu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/486386/%E7%A7%92%E8%BF%872025%E5%B9%B4%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%EF%BC%8C%E6%AF%8F%E4%B8%AA%E8%A7%86%E9%A2%91%E5%A4%9A%E7%82%B9%E5%87%A0%E9%81%8D%EF%BC%8C%E7%96%AF%E7%8B%82%E7%82%B9%E9%BC%A0%E6%A0%87%E5%B7%A6%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/486386/%E7%A7%92%E8%BF%872025%E5%B9%B4%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%EF%BC%8C%E6%AF%8F%E4%B8%AA%E8%A7%86%E9%A2%91%E5%A4%9A%E7%82%B9%E5%87%A0%E9%81%8D%EF%BC%8C%E7%96%AF%E7%8B%82%E7%82%B9%E9%BC%A0%E6%A0%87%E5%B7%A6%E9%94%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let isPopupOpen;
    const popupState = localStorage.getItem('popupState');
    if (popupState === null) {
        isPopupOpen = true;
        localStorage.setItem('popupState', 'true');
    } else {
        isPopupOpen = popupState === 'true';
    }
    const popupMessage1 = '注意！不支持高校、职教';
    const popupMessage2 = '提示：';
    const popupMessage3 = '1.使用方法：点开视频，鼠标快速点几次空白处或者暂停/播放键，然后观察进度条是否跳转到最后几秒，如果跳过去了，等待视频播放完成即可。如果进度条还在前面，再次快速点几次空白处或者暂停/播放键，直到进度条跳转到最后几秒；';
    const popupMessage4 = '2.此脚本永久免费，以前、现在、未来都免费，谨防上当受骗；';
    const popupMessage5 = '3.右上角有弹窗开关按钮，觉得弹窗烦的可以关闭';
    const popupMessage6 = '4.有问题可以点右上角的“联系脚本作者”, 或者加入企鹅群191344570。';
    const popupMessage7 = '———hydrachs';

    // 创建弹簧
    function createPopup(message1, message2, message3, message4, message5, message6, message7) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '20%';
        modal.style.left = '20%';
        modal.style.width = '60%';
        modal.style.height = 'auto';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.borderRadius = '5px';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        modal.style.zIndex = '9999';

        const text1 = document.createElement('p');
        text1.style.color ='red';
        text1.style.fontSize = '38px';
        text1.textContent = message1;
        text1.style.textAlign = 'center';
        text1.style.marginBottom = '10px';

        const text2 = document.createElement('p');
        text2.textContent = message2;
        text2.style.fontSize = '23px';
        text2.style.marginBottom = '10px';

        const text3 = document.createElement('p');
        text3.textContent = message3;
        text3.style.fontSize = '19px';
        text3.style.marginBottom = '10px';

        const text4 = document.createElement('p');
        text4.textContent = message4;
        text4.style.fontSize = '19px';
        text4.style.marginBottom = '10px';

        const text5 = document.createElement('p');
        text5.textContent = message5;
        text5.style.fontSize = '19px';
        text5.style.marginBottom = '10px';


        const text6 = document.createElement('p');
        text6.textContent = message6;
        text6.style.fontSize = '19px';
        text6.style.marginBottom = '10px';

        const text7 = document.createElement('p');
        text7.textContent = message7;
        text7.style.textAlign = 'right';
        text7.style.fontSize = '25px';
        text7.style.marginBottom = '10px';

        const button = document.createElement('button');
        button.textContent = '我知道了';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.onclick = function () {
            modal.remove();
        };

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.marginTop = '10px';

        buttonContainer.appendChild(button);
        modal.appendChild(text1);
        modal.appendChild(text2);
        modal.appendChild(text3);
        modal.appendChild(text4);
        modal.appendChild(text5);
        modal.appendChild(text6);
        modal.appendChild(buttonContainer);

        document.body.appendChild(modal);
    }

    // 创建暗影
    function createContactButton() {
        const button = document.createElement('button');
        button.textContent = '联系作者';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '10000';
        button.style.padding = '10px 20px';
        button.style.border = 'none';
        button.style.backgroundColor = '#ff0000';
        button.style.color = '#ffd700';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.onclick = function () {
            window.open('https://space.bilibili.com/15344563', '_blank');
        };

        document.body.appendChild(button);

        const qqGroupButton = document.createElement('button');
        qqGroupButton.textContent = '加企鹅群';
        qqGroupButton.style.position = 'fixed';
        qqGroupButton.style.top = '50px';
        qqGroupButton.style.right = '10px';
        qqGroupButton.style.zIndex = '10000';
        qqGroupButton.style.padding = '10px 20px';
        qqGroupButton.style.border = 'none';
        qqGroupButton.style.backgroundColor = '#007BFF';
        qqGroupButton.style.color = '#fff';
        qqGroupButton.style.fontWeight = 'bold';
        qqGroupButton.style.cursor = 'pointer';
        qqGroupButton.onclick = function () {
            window.open('https://qm.qq.com/q/LyBXuM21Cm', '_blank');
        };

        document.body.appendChild(qqGroupButton);

        const popupControlButton = document.createElement('button');
        popupControlButton.style.position = 'fixed';
        popupControlButton.style.top = '90px';
        popupControlButton.style.right = '10px';
        popupControlButton.style.zIndex = '10000';
        popupControlButton.style.padding = '10px 20px';
        popupControlButton.style.border = 'none';
        popupControlButton.style.backgroundColor = isPopupOpen? '#28a745' : '#dc3545';
        popupControlButton.style.color = '#fff';
        popupControlButton.style.fontWeight = 'bold';
        popupControlButton.style.cursor = 'pointer';
        updatePopupControlButtonText(popupControlButton);
        popupControlButton.onclick = function () {
            isPopupOpen =!isPopupOpen;
            localStorage.setItem('popupState', isPopupOpen? 'true' : 'false');
            const existingPopup = document.querySelector('div[style*="zIndex: 9999"]');
            if (existingPopup) {
                existingPopup.remove();
            }
            if (isPopupOpen) {
                createPopup(popupMessage1, popupMessage2, popupMessage3, popupMessage4, popupMessage5, popupMessage6);
            }
            updatePopupControlButtonText(popupControlButton);
        };

        document.body.appendChild(popupControlButton);
    }

    function updatePopupControlButtonText(button) {
        if (isPopupOpen) {
            button.textContent = '已开启弹窗';
            button.style.backgroundColor = '#28a745';
        } else {
            button.textContent = '已关闭弹窗';
            button.style.backgroundColor = '#dc3545';
        }
    }

    // 弹弹弹
    if (isPopupOpen) {
        createPopup(popupMessage1, popupMessage2, popupMessage3, popupMessage4, popupMessage5, popupMessage6);
    }
    createContactButton();

    function removePopup() {
        var popup = document.querySelector('.fish - modal - confirm - btns');
        if (popup) {
            popup.parentNode.removeChild(popup);
            console.log('出现知道了按钮');
        }
    }

    function removeNewPopup() {
        var newPopup = document.querySelector('.fish - modal - content');
        if (newPopup) {
            newPopup.parentNode.removeChild(newPopup);
            console.log('移除弹窗2');
        }
    }

    function skipVideo() {
        let video = document.querySelector('video');
        if (video) {
            video.muted = true;
            video.play();
            video.pause();
            video.currentTime = video.duration;
            video.play();
            setTimeout(700);
            video.currentTime = video.duration - 3;
            video.play();
            video.currentTime = video.duration - 5;
            video.play();
        }
    }

    // 海豚音播放视频
    function skipVideo2() {
        let video = document.querySelector('video');
        if (video) {
            video.muted = true;
            video.play();
        }
    }

    function rapidSkip(times, interval) {
        let count = 0;
        const intervalId = setInterval(() => {
            if (count >= times) {
                clearInterval(intervalId);
                return;
            }
            skipVideo();
            count++;
        }, interval);
    }

    let clickTimer;

    document.addEventListener('DOMContentLoaded', function () {
        removePopup();
        removeNewPopup();
        console.log('移除弹窗');
    });

    document.addEventListener('click', function (event) {
        if (event.button === 0) {
            if (clickTimer) {
                clearInterval(clickTimer);
            }
            rapidSkip(4, 50);
            clickTimer = setInterval(() => {
                rapidSkip(4, 50);
            }, 8000);
        }
    });

})();