// ==UserScript==
// @name         媒体资源嗅探及下载(支持下载m3u8和mp4视频和音频)
// @namespace    http://tampermonkey.net/
// @version      1.981
// @description  功能包含：1、自动嗅探页面上的视频、音频资源，列出链接，并提供播放、复制和下载功能（提供 mp3、mp4 和 m3u8 资源下载）；2、录屏；3、解除页面复制限制。
// @author       geigei717
// @license      Copyright geigei717
// @antifeature  ads
// @match        https://*/*
// @match        http://*/*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/fc67t00gsk98w7pbhs97xr94g1hl
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.27.1/DPlayer.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.14/layui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.13/hls.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.6.2/flv.js

// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js

// @resource     LayuiCss  https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.14/css/layui.css
// @resource     qbMediaRecorderJS https://quickblox.github.io/javascript-media-recorder/qbMediaRecorder.js
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_getResourceText
// @grant        GM_webRequest
// @connect      *
// @supportURL  【Greasy Fork 脚本技术交流】：http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=IkMlupLSzK9E2MheU0ngdDHHnnzojNYx&authKey=v1p%2BI3vfp3Bw60DIGgWxTtQSQ0NAz4ib%2FC6lTF0LjIi8dteVCtihitq5zID%2FoM0N&noverify=0&group_code=674604829
// @downloadURL https://update.greasyfork.org/scripts/470154/%E5%AA%92%E4%BD%93%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2%E5%8F%8A%E4%B8%8B%E8%BD%BD%28%E6%94%AF%E6%8C%81%E4%B8%8B%E8%BD%BDm3u8%E5%92%8Cmp4%E8%A7%86%E9%A2%91%E5%92%8C%E9%9F%B3%E9%A2%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/470154/%E5%AA%92%E4%BD%93%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2%E5%8F%8A%E4%B8%8B%E8%BD%BD%28%E6%94%AF%E6%8C%81%E4%B8%8B%E8%BD%BDm3u8%E5%92%8Cmp4%E8%A7%86%E9%A2%91%E5%92%8C%E9%9F%B3%E9%A2%91%29.meta.js
// ==/UserScript==

(function() {
    "use strict";
    // # 功能设置： 0 关闭，1 开启； 注：此处设置值如果改为（0 or 1）以外的值，会导致相应功能关闭（油猴脚本菜单中的选项也不会起效）
    // 此处的设置主要考虑到手机端使用时没有油猴脚本菜单可以 开启/关闭 功能，故添加于此。
    var set = [];
    set['auto_n']   = 0    // 默认不会在嗅探出资源后自动打开列表
    set['ffmpeg_n'] = 0    // 默认不会在浏览器下载完m3u8视频后进行视频转码 （解码需要浏览器开启特定功能并且会占用大量资源）
    set['ad_n']     = 1    // 默认会在下载m3u8视频时自动过滤其中夹杂的广告，但注意 有些广告使用了混淆 会导致视频片段会被误当做广告而去除，下载的视频不完整，这种情况关闭此功能即可。
    set['checked_n']= 1    // 默认解除特殊网站对文本选中的限制，对开启此功能但仍无法解除选择限制的网站 可以提交网站给作者进行相应优化。 解除限制后可以进行复制等操作（1.70新加功能）。

    //正文
    var xcNum = 15
    if (window.self == window.top) {
        //console.log("当前页面不在iframe子页面内部 在最顶层父页面")
        GM_addElement('script', {
            textContent:  GM_getResourceText('qbMediaRecorderJS') });
        GM_addStyle( GM_getResourceText("LayuiCss").toString()
                    .replace(/([^.@-]+{[^}]*}\s*)*/im , '')
                    .replaceAll(/@font-face\s*\{\s*font-family:\s*layui-icon;[^}]*}/img,
                                "@font-face { "+
                                "font-family: layui-icon; "+
                                "src: url(https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/font/iconfont.eot); "+
                                "src: url(https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/font/iconfont.eot) format('embedded-opentype'),"+
                                "     url(https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/font/iconfont.woff2) format('woff2'),"+
                                "     url(https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/font/iconfont.woff) format('woff'),"+
                                "     url(https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/font/iconfont.ttf) format('truetype'),"+
                                "     url(https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/font/iconfont.svg) format('svg')}") );
        unsafeWindow.GM = GM;
        try {
            unsafeWindow.$('body')
        } catch(err) {
            //console.log(err)
            unsafeWindow.$ = $;
        }
    } else {
        // console.log("当前页面位于iframe子页面");

    }
    var userAgent = navigator.userAgent.toLowerCase();
    var platform,weight,weight1,offset;
    if(userAgent == null || userAgent == ''){
        platform = 'pc' ;
    }else{
        if(userAgent.indexOf("android") != -1 ){
            platform = 'phone';
        }else if(userAgent.indexOf("ios") != -1 || userAgent.indexOf("iphone") != -1 || userAgent.indexOf("ipad") != -1){
            platform = 'phone';
        }else if(userAgent.indexOf("windows phone") != -1 ){
            platform = 'phone';
        }else{
            platform = 'pc' ;
        }
    }
    if(platform == 'pc'){
        var menuList = []
        var info = ['❌ 已禁用','✅ 已启用']
        mkMenu([
            { No : 0 , key: "✅支持作者，你的支持就是作者的动力",    keyName : "me()"},
            { No : 1 , key: "嗅探到新资源时自动打开窗口：",           keyName : "auto_n"},
            { No : 2 , key: "是否转码(需满足先决条件)：",             keyName : "ffmpeg_n"},
            { No : 3 , key: "是否在视频下载中去除m3u8中插的广告（测试版）：", keyName : "ad_n"},
            { No : 4 , key: "解除个别网站文本无法选中的限制：", keyName : "checked_n"},
        ])
    }
    var w = window.innerWidth;
    var h = window.innerHeight;
    if(platform == 'pc'&& w > 800 && h >600){
        weight = ['800px', '600px'];
        weight1 = ['550px', '700px'];
        offset = (h-600)/2+"px"
    }else{
        if(w < 490){
            var z = w/490;
            GM_addStyle( '#MyUpDown{zoom: '+z+';-moz-transform: scale('+z+');-moz-transform-origin:right top;;} '+
                        '#MyUrls{zoom: '+z+';-moz-transform: scale('+z+');-moz-transform-origin:right top;;} '+
                        '#Allurl{zoom: '+z+';-moz-transform: scale('+z+');-moz-transform-origin: right top;;}; ')
        }
        if(platform == 'pc'){
            offset = w < h ? (h-w)/2+"px" : 0.1*h+"px";
            weight = w < h ? [0.8*w+"px", 0.8*w+"px"] : [0.8*h+"px", 0.8*h+"px"];
            weight1 = w < h ? [0.8*w+"px",0.8*w+94+"px"] : [0.8*h+"px",0.8*h+94+"px"];
        }else{
            offset = w < h ? (h-w)/2+"px" : 0.01*h+"px";
            weight = w < h ? [0.98*w+"px", 0.98*w+"px"] : [0.98*h+"px", 0.98*h+"px"];
            weight1 = w < h ? [0.98*w+"px",0.98*w+94+"px"] : [0.98*h+"px",0.98*h+94+"px"];
        }
    }
    let URLAs = [],videos=[],play = 0,hzh = false;;
    var firstVideo = 0, mn = -1;
    unsafeWindow.GM_D = [];
    var href = location.href;
    var origin = location.origin
    $("body").attr("id","Top")
        .append(["<div id='MyUrls' class='jianBian' style='    text-align: left;font-family: \"Times New Roman\",Georgia,Serif !important;;width: 490px;background-color: rgb(149 228 246);color: black;position: fixed;top: 1px;right: 1px;z-index: 999999999999999;border-radius: 4px;display: none;'>" +
                 "   <div style='display: inline-block; width: 40%;height: 30px;font-size: 20px;text-align: left;line-height: 30px;'>&nbsp&nbsp&nbsp&nbsp&nbsp资源链接：</div>"+
                 "   <div id='Allurl' style=''>" +
                 "      <i id='LupinStart'  title='录屏'         style=''             ><svg width='25' height='25' xmlns='http://www.w3.org/2000/svg'><path d='m17.12494,2.35175a2.14127,2.60003 0 0 1 2.13699,2.42947l0.00428,0.17056l0,1.96666l2.11386,-1.16169a2.14127,2.60003 0 0 1 3.0209,2.19754l0.00428,0.17056l0,9.12922a2.14127,2.60003 0 0 1 -3.02176,2.37019l-0.1319,-0.07904l-1.98538,-1.29377l0,2.3005a2.14127,2.60003 0 0 1 -2.0008,2.59483l-0.14047,0.0052l-14.56063,0a2.14127,2.60003 0 0 1 -2.13699,-2.42947l-0.00428,-0.17056l0,-15.60017a2.14127,2.60003 0 0 1 2.0008,-2.59483l0.14047,-0.0052l14.56063,0zm-0.42825,3.12003l-13.70412,0l0,14.56016l13.70412,0l0,-4.16005l0.00343,-0.1092a1.28476,1.56002 0 0 1 1.7764,-1.5569l0.1122,0.06344l3.24702,2.11538l0,-7.45376l-3.32325,1.82938a1.28476,1.56002 0 0 1 -1.64449,-0.64273l-0.05567,-0.1352a1.27877,1.55274 0 0 1 -0.11135,-0.75401l-0.00428,-0.11648l0,-3.64004zm-7.70857,2.60003l3.76863,3.43204a1.28476,1.56002 0 0 1 0.09764,2.39827l-0.09764,0.09776l-3.76863,3.43204a0.85651,1.04001 0 0 1 -1.19911,-0.208l-0.5139,-0.83201a0.85651,1.04001 0 0 1 0.1713,-1.45602l2.39736,-2.18402l-2.39822,-2.18402a0.85651,1.04001 0 0 1 -0.17044,-1.45602l0.5139,-0.83201a0.85651,1.04001 0 0 1 1.19911,-0.208z'></path></svg></i>" +
                 "      <i id='LupinStop'   title='停止录屏'     style='display:none;'><svg width='25' height='25' xmlns='http://www.w3.org/2000/svg'><path fill='#ff0000' d='m15.46936,16.26799l-5.93873,0c-0.44387,0 -0.81122,-0.36612 -0.81122,-0.80852l0,-5.91894c0,-0.4424 0.36734,-0.80852 0.81122,-0.80852l5.92342,0c0.44387,0 0.81122,0.36612 0.81122,0.80852l0,5.90369c0.01531,0.45765 -0.35204,0.82377 -0.79591,0.82377z'></path><path d='m12.5,3.01138c5.24996,0 9.52034,4.25615 9.52034,9.48862s-4.27038,9.48862 -9.52034,9.48862s-9.52034,-4.25615 -9.52034,-9.48862s4.27038,-9.48862 9.52034,-9.48862m0,-2.71539c-6.76525,0 -12.24481,5.46129 -12.24481,12.20401s5.47955,12.20401 12.24481,12.20401s12.24481,-5.46129 12.24481,-12.20401s-5.47955,-12.20401 -12.24481,-12.20401z'></path></svg></i>" +
                 "      <i id='Alldownload' title='下载全部资源' style=''             ><svg width='25' height='25' xmlns='http://www.w3.org/2000/svg'><path d='m14.12784,16.18481l0.12927,-0.11217l7.107,-6.62524a0.9944,0.927 0 0 0 0,-1.31077l-0.70304,-0.65539a0.9944,0.927 0 0 0 -1.31261,-0.07694l-0.09347,0.07694l-5.26437,4.90752l0.00099,-11.01271a0.9944,0.927 0 0 0 -0.9944,-0.927l-0.9944,0a0.9944,0.927 0 0 0 -0.9944,0.927l-0.00099,11.01086l-5.26238,-4.90566a0.9944,0.927 0 0 0 -1.31261,-0.07694l-0.09347,0.07694l-0.70304,0.65539a0.9944,0.927 0 0 0 0,1.31077l7.106,6.62524a2.48601,2.31749 0 0 0 3.38594,0.11217zm7.81899,8.36614a2.48601,2.31749 0 0 0 2.48103,-2.16546l0.00497,-0.15203l0,-3.24449a0.9944,0.927 0 0 0 -0.9944,-0.927l-0.9944,0a0.9944,0.927 0 0 0 -0.9944,0.927l0,2.78099l-17.89925,0l0,-2.78099a0.9944,0.927 0 0 0 -0.9944,-0.927l-0.9944,0a0.9944,0.927 0 0 0 -0.9944,0.927l0,3.24449a2.48601,2.31749 0 0 0 2.32292,2.31286l0.16308,0.00463l18.89365,0z'></path></svg></i>" +
                 "      <i id='Allcopy'     title='复制全部链接' style=''             ><svg width='25' height='25' xmlns='http://www.w3.org/2000/svg'><path d='m21.99501,0.72222a2.28276,2.30057 0 0 1 2.2782,2.14965l0.00457,0.15092l0,13.61937a2.28276,2.30057 0 0 1 -2.13301,2.29597l-0.14975,0.0046l-2.28276,0l0,3.40484a2.28276,2.30057 0 0 1 -2.13301,2.29597l-0.14975,0.0046l-14.60969,0a2.28276,2.30057 0 0 1 -2.28276,-2.30057l0,-14.72365a2.28276,2.30057 0 0 1 2.28276,-2.30057l3.37849,-0.00092l0,-2.29965a2.28276,2.30057 0 0 1 2.13301,-2.29597l0.14975,-0.0046l13.51396,0zm-5.02208,7.3609l-13.69658,0l0,13.80342l13.69658,0l0,-13.80342zm4.56553,-4.60022l-12.60085,0l0,1.83954l8.49188,0.00092a2.28276,2.30057 0 0 1 2.2782,2.14965l0.00457,0.15092l0,8.55812l1.82621,0l0,-12.69915z'></path></svg></i>" +
                 "      <i id='Alldel'      title='清除列表'     style=''             ><svg width='25' height='25' xmlns='http://www.w3.org/2000/svg'><path d='m15.45918,0.40816a0.98639,0.93014 0 0 1 0.98639,0.93014l0,1.86028l6.90476,0a0.98639,0.93014 0 0 1 0.98639,0.93014l0,0.93014a0.98639,0.93014 0 0 1 -0.98639,0.93014l-0.98639,0l0,16.27747a2.46599,2.32535 0 0 1 -2.30422,2.3207l-0.16177,0.00465l-14.79591,0a2.46599,2.32535 0 0 1 -2.46599,-2.32535l0,-16.27747l-0.98639,0a0.98639,0.93014 0 0 1 -0.98639,-0.93014l0,-0.93014a0.98639,0.93014 0 0 1 0.98639,-0.93014l6.90476,0l0,-1.86028a0.98639,0.93014 0 0 1 0.98639,-0.93014l5.91837,0zm3.94558,5.58085l-13.80952,0l0,15.8124l13.80952,0l0,-15.8124zm-8.38435,3.25549l0,9.30141l-2.95918,0l0,-9.30141l2.95918,0zm5.91837,0l0,9.30141l-2.95918,0l0,-9.30141l2.95918,0z'></path></svg></i>" +
                 "   </div>"+
                 "   <hr style='border-color: black;margin: 5px;height: 2px;background: black;border-width: 0;'>" +
                 "   <div class='MyUrls' style='background-color: #ffffff;border-radius: 4px;margin: 10px 10px;max-height: 500px;text-align: left;'>" +
                 "      <div  class='MyBT' style='height: 35px;display: -webkit-flex;display: flex;-webkit-justify-content: space-around;;justify-content: space-around;;'>"+
                 "         <div id='MyVideo'  class='jianBian'>视频<div >视频</div></div>"+
                 "         <div id='MyAudio'  class='jianBian'>音频<div >音频</div></div>"+
                 "      </div> "+
                 "      <div class='MyNR'>"+
                 "         <div class='MyVideo'></div>  <div class='MyAudio'></div>"+
                 "      </div> "+
                 "   </div>" +
                 "</div>"][0])
        .append(["<div id='MyUpDown' class='jianBian' style='width: 30px;height: 30px;color: black;background-color:rgb(149, 228, 246);position: fixed;top: 1px;right: 1px;z-index: 1000009999999999999;font-size: 20px;line-height: 30px;text-align: center;cursor: pointer;border-radius: 30px;'>" +
                 "   <div id='redPoint' style='width: 5px;height: 5px;position: fixed;top: -25px;right: 30px;font-size: 50px;color: red;font-weight: 400;display:none; '>.</div>"+
                 "   <div id='downIcon' style='width: 30px!important;height: 30px!important;line-height: 30px!important;font-size: 20px !important;font-family: Helvetica!important;'>➕</div>"+
                 "</div>"][0])
        .append()
        .append(["<a href='#Top' id='GoTop' target='_self'  style='text-decoration: none;display: none; width: 30px;height: 30px;color: black;background-color:rgb(149, 228, 246);position: fixed; bottom: 50px;right: 1px;z-index: 9999999100000;font-size: 20px;line-height: 30px;text-align: center;cursor: pointer;border-radius: 30px;'>" +
                 "   <div id='GoTopIcon' style='width: 30px!important;height: 30px!important;line-height: 30px!important;font-size: 25px !important;font-family: Helvetica!important;' title='回到顶部'>⇡</div>"+
                 "</a>"][0])

    GM_addStyle(['@keyframes mymove { '+
                 '     0%   { background-color: #11eada; }  25%  { background-color: #1bcfdf; }  50%  { background-color: #25b7e4; }  75%  { background-color: #1bcfdf; }  100% { background-color: #11eada; } '+
                 ' } '+
                 '@-webkit-keyframes mymove {  '+
                 '     0%   { background-color: #11eada; }  25%  { background-color: #1bcfdf; }  50%  { background-color: #25b7e4; }  75%  { background-color: #1bcfdf; }  100% { background-color: #11eada; } '+
                 ' } '+
                 '#downIcon img               { width: 90%!important; height: 90%!important; margin: 5%!important; padding: 0!important; line-height: 90%!important;}'+
                 '#Allurl                     { position: relative; right: -100px; bottom: -7px; display: inline-block; width: 150px; height: 40px; color: black; font-size: 14px; text-align: center; cursor: pointer;}'+
                 '#Allurl>i                   { margin: 0 1px!important;display: inline-block; line-height: 30px;width: 30px;height: 30px; }'+
                 '#MyUrls div,#MyUrls input   { box-sizing: content-box!important;line-height: 100%; }'+
                 '.MyUrls hr                  { background: #837b7b; border-color: #837b7b; border-width: 0;height: 1px;margin: 0; padding: 0; border: none !important; }'+
                 '.jianBian                   { animation: mymove 10s infinite;-webkit-animation: mymove 10s infinite;}'+
                 '.MyBT>div                   { text-align: center;margin: 1px 0;border-radius: 5px;font-size: 17px;cursor: pointer;text-align: center;width: 49%; margin-top: 1px;padding-top: 2px;    line-height: 31px !important;}'+
                 '.MyBT>div>div               { width: 225px;margin: 0px 3px;height: 24px; background-color: white;border-radius: 5px;position: relative;top: -29px;opacity: 0; line-height: 25px !important;}'+
                 '.MyNR                       { max-height: 465px; overflow-y: auto; }'+
                 '.MyNR>div                   { display: none }'+
                 '.MyNR div[class^=No-isUrl]  { width: 30px;text-align: right;display: inline-block; height: 30px;line-height: 30px !important;}'+
                 '.MyNR input[class^=downUrl] {     pointer-events: auto !important; opacity: 1 !important; cursor: text !important;font-size: 12px;width: 145px;display: inline-block;margin: 0px;height: 22px;border: 1px solid black;border-radius: 5px;padding: 0 5px;background: white;color: #000000 !important;}'+
                 '.MyNR input[class^=downName]{ font-size: 12px;width: 35px;display: inline-block;margin: 0px;height: 22px;border: 1px solid black;border-radius: 5px;padding: 0 5px;background: white;color:black;}'+
                 '.But                        { margin-left: 5px;height:20px;width: 40px;padding: 0;border: none;background: #ffba46;border-radius:10px;cursor: pointer;line-height: 20px!important;font-size: 10px;text-align: center; }'+
                 '.MyNR div[class^=rmUrl]     { display: inline-block;cursor: pointer;color:red; width: 30px; height: 30px;line-height: 30px !important; }'+
                 '#giegei717dplayer .dplayer-controller button{ background: black; }'+
                 '.dplayer-controller .dplayer-bar-wrap .dplayer-bar { height: 15px!important;top: -10px!important;}'+
                 '.dplayer-controller .dplayer-bar-wrap .dplayer-bar>[class^=dplayer-] { height: 15px!important;}'+
                 '.dplayer-controller .dplayer-bar-wrap .dplayer-bar .dplayer-played .dplayer-thumb { height: 22px!important; width: 22px!important;}'
                ][0]);

    $(".MyNR div").append(["<div class='urlnone' style='height: 22px;color: red;padding: 9px 0 0 20px;font-size: 15px;'> 暂时没有嗅探到资源</div>"+
                           "<div class='downloadUrl' style='height: 31px; line-height: 30px;'>"+
                           "<hr    class='urlnone' > " +
                           "<div   class='No-isUrl'> 0、</div>"+
                           "<input class='downUrl'         autocomplete='on'   placeholder='请输入要下载的资源链接：' title='自定义资源下载项'> "+
                           "<input class='downName'        style=' width: 125px;'  placeholder='请输入文件名(下载用)' title='默认文件名为当前页面标题'>"+
                           "<div   class='But SaveUrl'     style='display: inline-block; '>下载</div>"+
                           "<div   class='But StopSaveUrl' style='display: none;         '>0%</div>"+
                           "<div   class='But playUrl'     style='display: inline-block; '>播放</div>&nbsp"+
                           "<div   class='rmUrl_input'     title='清空'                   >&nbspx&nbsp</div>"+
                           "</div>"][0])
    //<button class='SaveUrl' style='margin-left: 5px;height: 20px;width: 40px;padding: 0;border: none;background: white;border-radius:10px;cursor: pointer;color:black;font-size: 10px;'>下载</button><button class='StopSaveUrl' style='position: relative;top: -2px;display: none;margin-left: 5px;height: 20px;width: 40px;padding: 0;border: none;background: white;border-radius:10px;cursor: pointer;'>0%</button></div>")
    var ad = 0,angle = 0;
    $("#MyUpDown").click(function () {
        var that = $(this)
        //$("#Allurl").slideToggle("slow");
        $("#MyUrls").slideToggle("slow",function(){
            if (mn=="1"||mn==1){
            }else {
                $("#redPoint").css("display","none")
                //$("#Allurl").css("display","block")
                that.css("background-color", "transparent").removeClass('jianBian')
            };        mn = -mn;
        });
        if (mn=="1"||mn==1){
            //$("#Allurl").css("display","none")
            that.addClass('jianBian')
        }
        var a = angle
        var setXZ = setInterval(function(){
            a = a + 1;
            $("#MyUpDown #downIcon").css( 'transform', 'rotate('+a+'deg)');
            if ( a>=angle+45 ){ stop_XZ() }
        },5);
        function stop_XZ(){ clearInterval(setXZ); angle += 45 };
        if(ad==0){
            FirstOpen()
            ad = 99;
        }
    })
    $(window).click(function (e) {
        //console.log(e.target)
        var x =$(e.target).is('#MyUrls *,#MyUpDown *,#GoTop *,#MyUrls,#MyUpDown,#GoTop')
        //console.log(x)
        if( !x && $("#MyUrls").css("display")!="none" && $("#MyUpDown").css('pointer-events') != 'none'){
            $("#MyUpDown").click()
            $("#MyUpDown").css( 'pointer-events','none')
            setTimeout(function(){ $("#MyUpDown").css( 'pointer-events','all') },500)
        }
    })
    $(".MyBT>div").click(function (){
        $('.MyBT>div>div').css('opacity', 0);
        $(this).find("div").css('opacity', 1)
        $('.MyNR>div').css('display', 'none').attr('id','')
        $('.MyNR .'+$(this).attr('id')).css('display', 'block').attr('id','My_VorA')
    })
    $(".MyBT #MyVideo")[0].click()

    //全部下载
    $("#Alldownload").click(function (){
        $('#My_VorA .isUrl').each(function(){
            $(this).find("div.But:nth-last-of-type(4)").click()
        })
        layer.msg("开始下载")
    })
    //全部复制
    $("#Allcopy").click(function (){
        var urlss ="";
        $('#My_VorA .isUrl').each(function(){
            urlss = urlss + $(this).find("[class^=downUrl]").attr('title').trim()+ "\n\n"
        })
        GM_setClipboard(urlss);
        //var aux = document.createElement("input");
        //aux.setAttribute("value", urlss);
        //document.body.appendChild(aux);
        //aux.select();
        //document.execCommand("copy");
        //document.body.removeChild(aux);
        layer.msg("已复制")
    })
    window.onload = ()=>{
        if(GM_getValue("checked_n", 1) == set['checked_n']){
            $('body :not(body)').css('user-select','auto') // 解除选中限制
            $('body #MyUrls[class=jianbian]').css('user-select', 'none') // 解除选中限制
            document.onselectstart = function(){
                event.returnValue = true;
                return true;
            }
            document.oncopy = function(){
                event.returnValue = true;
                return true;
            }
            document.onbeforecopy = function(){
                event.returnValue = true;
                return true;
            }
            document.onkeydown = function(){
                event.returnValue = true;
                return true;
            }
            document.onkeyup = function(){
                event.returnValue = true;
                return true;
            }
            document.onkeypress = function(){
                event.returnValue = true;
                return true;
            }
            function MyCopy(event){
                var text = window.getSelection().toString()
                if ( text != undefined && text != null && text.trim() != '') {
                    //GM_setClipboard( text );
                    navigator.clipboard.writeText(text)
                        .then(() => { layer.msg("已复制");console.log("已复制，由 copy 触发") })
                        .catch((error) => {  GM_setClipboard( text );})
                }
            }
            function MyKeydown(event){
                var text = window.getSelection().toString()
                if ( (event.keyCode == 67 || event.keyCode == 88) && event.ctrlKey && text != undefined && text != null && text.trim() != '') {
                    //_setClipboard( text );
                    navigator.clipboard.writeText(text)
                        .then(() => { layer.msg("已复制");console.log("已复制，由 keydown 触发") })
                        .catch((error) => {  GM_setClipboard( text );})
                }
            }
            $(window).keydown( MyKeydown(event) ).on("copy", function(event){ MyCopy(event)} )
            var set$ = setInterval(function(){
                try {
                    //unsafeWindow.$ = $;
                    $("body").append('<script  type="text/javascript">$("body :not(button,input[type=button])").unbind("keypress keyup keydown copy").off( "keypress keyup keydown copy")</script>');stopSet()
                } catch(err) {
                    unsafeWindow.$ = $; //console.log(err)
            }},1000);
            function stopSet(){ clearInterval(set$); };
        }
    }
    //全部清除
    $("#Alldel").click(function (){
        $('#My_VorA .isUrl').remove()
        //URLs = []
        GM_D.forEach(function(item){
            item.forEach(function(i){
                i.abort()
            })
        })
        layer.msg("已清除")
    })
    //录屏
    $("#LupinStart").click( function (){
        var constraints ={
            //audio: true,
            audio:{
                echoCancellation: true,
                autoGainControl: true,
                noiseSuppression:true
            },
            surfaceSwitching: "include",
            video: {
                frameRate: { ideal: 30},
                width: { ideal: 1920 },
                height: { ideal: 1080 },
            }
        };
        var time = 0;
        var opts = {
            onstart: function onStart() { // Use named function.
                time = new Date().getTime()
                console.log('Recorder is started'+"\n"+'开始录屏');
                $("#LupinStart").css('display','none')
                $("#LupinStop").css('display','inline-block')
            },
            onstop: function onStop(blob) {
                time = new Date().getTime() - time;
                console.log('Recorder is stop'+"\n"+'录屏结束'+'\n'+'时长：'+time);
                stream.getTracks().forEach((track) => track.stop());

                var link = document.createElement("a");
                link.href = window.URL.createObjectURL(new Blob([blob]))
                link.download = "录屏 "+ new Date().toLocaleString().replaceAll("/",'-').replaceAll(":",'-') +".mp4";
                link.click();
                link.remove();

                $("#LupinStop").css('display','none')
                $("#LupinStart").css('display','inline-block')
            },
            mimeType:  "video/webm; codecs=h264"
        };
        try {
            window.rec = new QBMediaRecorder(opts);
        } catch(err) {
            //layer.msg("当前页面不被允许录屏");
            console.log(err)
        }
        navigator.mediaDevices.getDisplayMedia(constraints).then((stream) => {
            window.stream = stream
            rec.start(stream);
        });
    })
    $("#LupinStop").click(function (){
        rec.stop()
    })

    //自带下载项功能
    $(".downUrl").on( 'input' ,function (){
        //console.log($(this).val())
        $(this).attr("title",$(this).val())
    })
    $(".downName").on( 'input' ,function (){
        //console.log($(this).val())
        $(this).attr("title",$(this).val())
    })
    $(".rmUrl_input").click(function (){
        $(this).prevAll("input").val('')
        $(this).prevAll(".downUrl").attr("title","自定义视频下载项")
        $(this).prevAll(".downName").attr("title","默认文件名为当前页面标题")
    })

    GoTop()
    window.onscroll = function(){ GoTop()}
    function GoTop(){
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        if( t >= 100 ) {
             $("#GoTop").css("display","block")
        } else {
             $("#GoTop").css("display","none")
        }
    }
    //播放链接
    $(".MyNR  .playUrl").click(function (){
        var url = $(this).prevAll(".downUrl").attr("title")
        var type = $(this).prevAll(".downUrl").data('type')
        if(url == undefined || url.trim()=="" || url.trim().length == 0 || url.trim().split(".").filter(function(item){return item.trim() != "";}).length < 2){
            layer.msg("无有效链接")
        }else{
            dplayerUrl(url,0,type)
            $(".But:nth-last-of-type(2)").text('播放')
            $(this).text("播放中")
        }
    })

    //functionAll("");functionAll("","MyAudio")
    function functionAll(u,VorA="MyVideo"){
        //跳转链接
        $(".MyNR ."+VorA+" .GoUrl"+u).click(function (){
            var url = $(this).prevAll(".downUrl"+u).attr("title")
            var link = document.createElement('a');
            link.href = url;
            link.target="_blank";
            link.click();
            link.remove();
        })
        //复制链接
        $(".MyNR ."+VorA+" .CopyUrl"+u).click(function (){
            var url = $(this).prevAll(".downUrl"+u).attr("title")
            GM_setClipboard(url);
            var aux = document.createElement("input");
            aux.setAttribute("value", url);
            document.body.appendChild(aux);
            aux.select();
            document.execCommand("copy");
            document.body.removeChild(aux);
            $(this).text("已复制")
        })
        //播放链接
        $(".MyNR ."+VorA+" .playUrl"+u).click(function (){
           var url = $(this).prevAll(".downUrl"+u).attr("title")
           var type = $(this).prevAll(".downUrl"+u).data('type')
           if(url == undefined || url.trim()=="" || url.trim().length == 0 || url.trim().split(".").filter(function(item){return item.trim() != "";}).length < 2){
               layer.msg("无有效链接")
           }else{
               var ui = u==''? 0 : u
               dplayerUrl(url,ui,type)
               $(".But:nth-last-of-type(2)").text('播放')
               $(this).text("播放中")
           }
        })
        //删除此条
        $(".MyNR ."+VorA+" .rmUrl"+u).click(function (){
            var num = $(this).prevAll('.StopSaveUrl'+u).data('num')
            if(num != undefined){
                GM_D[num].forEach(function(item){
                    item.abort()
                })
            }
            $(this).parent(".isUrl").remove()
            var list = $('.isUrl')
            list.each(function(i){
                $(this).children("#No-isUrl").text(i+1+'、')
            })
        })
        $(".MyNR ."+VorA+" .downName"+u).on( 'input' ,function (){
            $(this).attr("title",$(this).val())
        })
        $(".MyNR input").dblclick( function () {
            this.select()
        })
        //下载链接
        $(".MyNR ."+VorA+" .SaveUrl"+u).click(function (){
            //$(obj).attr("disabled","disabled")
            var that = $(this)
            var url = $(that).prevAll(".downUrl"+u).val()
            if(url==undefined||url.trim()==''){
                url = $(that).prevAll(".downUrl"+u).attr('title')
                if(url==undefined||url.trim()==''||url.trim()=="自定义资源下载项"){
                    layer.msg("无有效链接");
                    return;
                }
            }
            var name = $(that).prevAll(".downName"+u).val()
            if(name==undefined||name.trim()==""){
                name = $('title').text()
                if(name==undefined||name.trim()==""){
                    name = url.split("/").pop().split("?")[0]
                    if(name==undefined||name.trim()==""){
                        name = "文件未命名"
                    }
                }
            }
            //if(! /\.[\w]+$/.test(name)&& ! /(\.com$ | \.cn)/.test(name)){ name = name + ".mp4"}
            name = name.replaceAll(/\s+/ig," ").trim().replace(/(\.mp4)*$/igm,"")
            if( $(that).parents('.MyNR>div').find('.isUrl').length>5){
                name = $(that).prevAll(".No-isUrl").text().trim() + name
            }
            //console.log(name,url)
            $(that).css("display","none").next('.StopSaveUrl'+u).css("display","inline-block").text("解析中");
            var request = [];
            var head_i = $(that).data('head_i')
            var head = $(that).data('head')
            console.log(head)
            //head = JSON.parse(head);
            delete head['Range'];
            delete head['Cache-Control']
            var blob = [];
            var loadSize = [];
            var xhrs = 0
            var num = -1
            var href = $(that).data('head_href')
            var origin = head_i == 1 ? location.origin : $(that).data('head_origin')
            var Length =$(that).data('length')
            var Headers = $(that).data('headers')
            var Type = $(that).data('type')
            if(VorA == "MyVideo"){
                name = name+".mp4"
                if( Length==null||Length==undefined||Length==""||Length<=0 && Type !="hls"){
                        console.log("mp4视频单线程下载中ing。")
                        mp4Download(url)
                        return;
                }
                if( Type == "hls"){
                    m3u8Download(url)
                }else{
                    console.log("mp4视频多线程下载中ing。")
                    var RangeSize = parseInt((Length/ xcNum).toFixed(0))
                    //console.log(RangeSize)
                    for(var i=0,z=0;i<Length;i=i+RangeSize,z++){
                        var range_start=i,range_end=i+RangeSize-1;
                        if (range_end + 1 >=Length) {range_end = Length}
                        //console.log(range_start,range_end)
                        DownloadThread( z , range_start , range_end)
                    }
                    //console.log(request)
                    num =GM_D.push(request)
                    $(that).next('.StopSaveUrl'+u).data('num',num-1)
                    function DownloadThread( z, range_start , range_end){
                        //console.log(z, range_start , range_end)
                        function onprogress (event){
                            loadSize[z] = event.loaded;
                            var all_length =0;
                            loadSize.forEach( function(item){
                                all_length = all_length + item
                            });
                            var loaded = ( parseFloat( all_length / Length * 100)).toFixed(1);
                            if(loaded <= 100){
                                $(that).next(".StopSaveUrl"+ u ).text( loaded +"%");
                                console.log(u+"、线程 "+z+" ： 已下载"+ event.loaded +" 总" +event.total);
                            }
                        }
                        head.Range = "bytes=" +range_start +"-"+ range_end;
                        request[z] = GM_xmlhttpRequest({
                            method: "GET",
                            url: url,
                            fetch: false,
                            responseType: "arraybuffer",
                            headers: head ,
                            //headers: head_i==0 ? { "Range":"bytes=" +range_start +"-"+ range_end} : { 'Referer': href,'Origin': origin, "Range":"bytes=" +range_start +"-"+ range_end},
                            onprogress: onprogress ,
                            onload: function(response) {
                                //console.log(response.response);
                                blob[z] = new Blob([response.response]);
                                //     console.log(blob);
                                var x=0,y=0;
                                //所有下载中线程的文件大小
                                loadSize.forEach(function(item){
                                    x = x + item
                                });
                                //所有已下载完成线程的文件大小
                                blob.forEach(function(item){
                                    y = y + item.size
                                });
                                console.log(u +"、线程 "+z+" ： 下载结束 下完线程的文件大小："+ y +" 已下载的文件大小："+ x +" 总："+ Length);
                                if (y >= Length) {
                                    var link = document.createElement("a");
                                    link.href = window.URL.createObjectURL(new Blob(blob));
                                    link.download = name;
                                    link.click();
                                    link.remove();
                                    $(that).text("已下载").css("display","inline-block").attr("title","下载").next(".StopSaveUrl"+ u).css("display","none").text("0%");console.warn(u +"、文件下载完成：" +name)
                                }
                            },
                            onabort: function(){
                                // $(that).text("继续").css("display","inline-block").next(".StopSaveUrl1").css("display","none").text("0%");
                                console.log("abort！");
                            },
                            onerror: function(x) {
                                // $(that).text("错误").css("display","inline-block").next(".StopSaveUrl  u  ").css("display","none").text("0%");
                                console.log("error！更换线路ing");
                                request.forEach(function(item){
                                    item.abort()
                                });
                                mp4Download(url);
                                var numi = parseInt( $(that).next(".StopSaveUrl"+u ).data("num") );
                                GM_D[numi] = request;
                            },
                        });
                    }
                }
            }else if(VorA == "MyAudio"){
                name = name+".mp3"
                mp4Download(url)
            }

            function mp4Download(url){
                console.log("资源单线程下载中ing。")
                head['If-Modified-Since'] = '0';
                request.push(GM_download({
                    url: url,
                    name: name,
                    headers: head,
                    //headers: head_i==0 ? { 'If-Modified-Since': '0'} : {'Referer': href, 'If-Modified-Since': '0'},
                    onprogress : function (event) {
                        //console.log(event)
                        if (event!=null) {
                            var loaded = parseFloat(event.loaded / event.total * 100).toFixed(2);
                            if(loaded >= 100){
                                $(that).text("已下载").css("display","inline-block").attr("title","下载").next(".StopSaveUrl"+u).css("display","none");
                            }else{
                                $(that).css("display","none").next(".StopSaveUrl"+u).css("display","inline-block").text(loaded+"%");
                                console.log(u+"、单线程： 已下载"+event.loaded+" 总"+event.total+ " 比 "+loaded +"%");
                            }
                        }
                    },
                    onload : function () {
                        $(that).text("已下载").css("display","inline-block").attr("title","下载").next(".StopSaveUrl"+u).css("display","none").text("0%");
                        console.warn(u+"、文件下载完成："+name)
                    },
                    onerror : function (x) {
                        console.log(x)
                        $(that).text("错误").css("display","inline-block").attr("title","下载出错。").next(".StopSaveUrl"+u).css("display","none").text("0%");
                    }
                }))
                num =GM_D.push(request)
                $(that).next('.StopSaveUrl'+u).data('num',num-1);
            }

            function m3u8Download(url){
                console.log("m3u8解析下载中ing。")
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: head,
                    //headers: head_i==0 ? { } : {'Referer': href,'Origin': origin}, //,'If-Modified-Since': '0'},
                    onerror: function(x) {
                        console.log("m3u8 GET出错onerror")
                        $(that).text("错误").css("display","inline-block").attr("title","下载出错。").next(".StopSaveUrl"+u).css("display","none").text("0%");
                    },
                    onload: function(response) {
                        var err = []
                        var tsNum=0
                        var tsS = 0
                        var tsi =0
                        var tsLength
                        var list0
                        var IV="",keyData=null;
                        async function syncRequest(url) {
                            var r = '';
                            head['If-Modified-Since'] = '0'
                            await GM.xmlHttpRequest({
                                method: "GET",
                                url: url ,
                                headers: head,
                                //headers: head_i==0 ? { 'If-Modified-Since': '0' } : {'Referer': href, 'If-Modified-Since': '0'},
                                responseType: "arraybuffer",
                                }).then((value) => {console.log(value);r = value.response; }).catch(e => {console.error(e);return null});
                            return r;
                        }
                        function jiemi(pwdBlob){
                            // 引入CryptoJS库
                            //console.log('解密中')
                            // 密钥和向量
                            IV = IV==null ? keyData : IV ;
                            return aesDecryptArrayBuffer(keyData, IV, pwdBlob)//aesEncrypt(keyData, pwdBlob, IV);
                            function aesDecryptArrayBuffer(key, iv, encryptedArrayBuffer) {
                                // 转换加密的ArrayBuffer为WordArray
                                var encryptedWords = CryptoJS.lib.WordArray.create(encryptedArrayBuffer);
                                if (typeof iv === 'string') { iv = stringToArrayBuffer(iv) }
                                if (typeof key === 'string') { key = stringToArrayBuffer(key) }
                                iv = CryptoJS.lib.WordArray.create(iv);
                                key = CryptoJS.lib.WordArray.create(key);
                                // 使用CryptoJS进行AES解密
                                var decryptedWords = CryptoJS.AES.decrypt(
                                    { ciphertext: encryptedWords },
                                    key,
                                    {
                                        iv: iv,
                                        mode: CryptoJS.mode.CBC,
                                        padding: CryptoJS.pad.Pkcs7
                                    }
                                );
                                // 获取解密后的字节数组
                                var decryptedBytes = CryptoJS.enc.Base64.stringify(decryptedWords);
                                // 转换解密后的字节数组为ArrayBuffer
                                var decryptedArrayBuffer = base64ToArrayBuffer(decryptedBytes);
                                return decryptedArrayBuffer;
                            }
                            function pad(key) {
                                // 使用PKCS#7填充
                                var x = 0b0
                                while (key.length % 16 !== 0) {
                                    key += 0b0;
                                }
                                return key;
                            }
                            function base64ToArrayBuffer(base64) {
                                var binaryString = window.atob(base64);
                                var len = binaryString.length;
                                var bytes = new Uint8Array(len);
                                for (var i = 0; i < len; i++) {
                                    bytes[i] = binaryString.charCodeAt(i);
                                }
                                return bytes.buffer;
                            }
                            function arrayBufferToBase64(buffer) {
                                var binary = '';
                                var bytes = new Uint8Array(buffer);
                                var len = bytes.byteLength;
                                for (var i = 0; i < len; i++) {
                                    binary += String.fromCharCode(bytes[i]);
                                }
                                // 对二进制字符串进行Base64编码
                                return btoa(binary);
                            }
                            function stringToArrayBuffer(str) {
                                let encoder = new TextEncoder();
                                return encoder.encode(str).buffer;
                            }
                        }
                        function downTs(list,tsUrl,i,status){
                            //console.log(tsUrl)
                            head['If-Modified-Since'] = '0';
                            request[i] = GM_xmlhttpRequest({
                                method: "GET",
                                url: tsUrl,
                                headers: head,
                                //headers: head_i==0 ? { 'If-Modified-Since': '0' } : {'Referer': href, 'If-Modified-Since': '0'},
                                responseType: "arraybuffer",
                                onloadstart: function(){
                                },
                                onload: function(response) {
                                    var buf = response.response
                                    //console.log(buf)
                                    blob[i] = buf
                                    if( status == "key"){
                                        var setjm = setInterval(function(){
                                            if(keyData != null ){
                                                stopjm()
                                                blob[i] = ( new Blob([jiemi(response.response)]) )
                                            }},50);
                                        function stopjm(){ clearInterval(setjm); };
                                    }else{
                                        blob[i] = ( new Blob([response.response]) )
                                    }
                                    list0.splice(list0.indexOf(tsUrl),1)
                                    if (list0.length>0) {
                                        tsNum = parseFloat(tsNum) + 1 / tsS * 100;
                                        tsNum = tsNum >100 ? 100 : parseFloat(tsNum).toFixed(2);
                                        tsi = tsi+1
                                        console.log(u+"、已下完的视频切片数："+ tsi +" 总数："+ tsS);
                                        $(that).next(".StopSaveUrl"+u).text(tsNum+"%");
                                        if(list.length > 0 ){
                                            downTs(list,list.shift(),i+1,status)
                                        }
                                    }else {
                                        $(that).next(".StopSaveUrl"+u).text("100%");
                                        var is = true;
                                        try {
                                            var sab = new SharedArrayBuffer(1);
                                        } catch(err) {
                                            console.log( err.message +"\n 浏览器不支持SharedArrayBuffer")
                                            is = false
                                        }
                                        var link = document.createElement("a");
                                        if(GM_getValue("ffmpeg_n", 1) == set['ffmpeg_n'] && is){
                                            (async () => {
                                                try {
                                                    FFmpeg;
                                                } catch(err) {
                                                    console.log( err.message +"\n 没有加载FFmpeg");
                                                    await $.ajax({
                                                        async: false,
                                                        url: "https://unpkg.com/@ffmpeg/ffmpeg@0.10.0/dist/ffmpeg.min.js",
                                                        dataType: "script"
                                                    });
                                                }
                                                $(that).next(".StopSaveUrl"+u).text("转码中");
                                                const { createFFmpeg, fetchFile } = FFmpeg;
                                                const ffmpeg = createFFmpeg({
                                                    //corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
                                                    log: true,
                                                    progress: ({ ratio }) => {
                                                        tsNum = (ratio * 100.0).toFixed(2)
                                                        $(that).next(".StopSaveUrl"+u).text(tsNum+"%").attr("title",'转码中');
                                                    },
                                                });
                                                console.log( '正在加载 ffmpeg-core.js');
                                                await ffmpeg.load();
                                                console.log('开始转码');
                                                ffmpeg.FS('writeFile', 'video.ts', await fetchFile(new Blob(blob)) );
                                                await ffmpeg.run('-i', 'video.ts' ,'output.mp4');
                                                console.log('转码完成');
                                                const data = ffmpeg.FS('readFile', 'output.mp4');
                                                $(that).text("已下载").css("display","inline-block").attr("title","下载").next(".StopSaveUrl"+u).css("display","none").attr("title","下载中");
                                                link.href = window.URL.createObjectURL(new Blob([data.buffer]));
                                                link.download = name;
                                                link.click();
                                                link.remove();
                                                ffmpeg.exit()
                                            })();
                                        }else{
                                            $(that).text("已下载").css("display","inline-block").attr("title","下载").next(".StopSaveUrl"+u).css("display","none").attr("title","下载中");
                                            link.href = window.URL.createObjectURL(new Blob(blob));
                                            link.download = name;
                                            link.click();
                                            link.remove();
                                        }
                                        console.warn(u+"、文件下载完成："+name)
                                    }
                                },
                                onabort: function(){
                                    console.log("abort！");
                                },
                                onerror: function(x) {
                                    console.log("ts GET出错onerror!")
                                    console.log(x)
                                    if (err<10){
                                        err = err+1
                                        downTs(list,tsUrl,i)
                                    }else{
                                        err = 0
                                        $(that).text("错误").css("display","inline-block").attr("title","下载出错").next(".StopSaveUrl"+u).css("display","none").text("0%");
                                        var num = $(that).next(".StopSaveUrl"+u).data("num")
                                        GM_D[num].forEach(function(item){
                                            item.abort()
                                        })
                                    }
                                }
                            });
                        }
                        var Ts = response.responseText.trim()
                        //console.log(Ts)
                        //console.log(response)
                        var TsStart = Ts.split(/(#EXTINF[^\n]*|#EXT-X-STREAM-INF[^\n]*)/)[0];
                        //console.log(TsStart )
                        if(/^#EXTM3U/.test(TsStart)){
                            console.log("m3u8解析中")
                            //layer.msg("m3u8解析中", {icon: 0});
                            //console.log(Ts)
                            var num1,num2,ad_ts
                            if(GM_getValue("ad_n", 1)== set['ad_n']){
                                while( Ts.search(/#EXT-X-DISCONTINUITY/i) != -1 ){
                                    num1 = Ts.search(/#EXT-X-DISCONTINUITY/i);
                                    Ts = Ts.replace(/#EXT-X-DISCONTINUITY/i,'这是要去除的部分')
                                    num2 = Ts.search(/#EXT-X-DISCONTINUITY/i);
                                    ad_ts = num2 != -1 ? Ts.slice( num1,num2+20) : Ts.slice(num1)
                                    Ts = Ts.replace(ad_ts,"")
                                    if( Ts.search(/#EXT-X-DISCONTINUITY/i) == -1){
                                        break
                                    }
                                }
                            }
                            Ts = Ts.replaceAll(/^#(?!(EXTINF[^\n]*|EXT-X-STREAM-INF[^\n]*))[^\n]*/img,"").trim().replaceAll(/\n#/img,'??#').split('??')
                            //console.log(Ts)
                            Ts = Ts.filter(function(item){
                                return item.trim() != "";
                            });
                            //console.log(Ts);
                            var status = "",bool = "false",mapURI = "false",keyUrl,keytext;
                            TsStart.split("\n").forEach(function(item){
                                if(/#EXT-X-KEY/.test(item.trim())){
                                    status = item.match(/METHOD=[\w-]{4,10}/im)[0]
                                    if( status!=undefined && status!= null && status!=''){
                                        status = status.replaceAll(/METHOD=/igm,'').trim()
                                        if (status=='None'||status=="NONE"||status=='none'||status==''){
                                            status = ""
                                        }else{
                                            status = "key"
                                            keytext = item.match(/URI="[^"'\s]*"/i)[0].replaceAll(/(URI="|")/ig,'').trim()
                                            keyUrl = keytext
                                            if(/[\w]*\.key/.test(keyUrl)){
                                                if( /^http[s]?:\/\/\w*\./.test(keyUrl)){    //"不完整，需要拼接"
                                                    keyUrl = keyUrl
                                                }else if( /^\/\/\w*\./.test(keyUrl) | /^\w*\.\w*/.test(keyUrl)){
                                                    keyUrl = (new URL(url)).protocol + '//'+keyUrl.replaceAll(/(^\/\/)/ig,'')
                                                }else{
                                                    tsUrl1 = url.split("?")[0].split("/");
                                                    tsUrl1.pop();
                                                    keyUrl = tsUrl1.join("/")+"/"+keyUrl.replaceAll(/\s*/img,"")
                                                }

                                            }
                                            IV = item.match(/IV=[\wx]*/i)[0]
                                            IV = IV==null|IV==undefined|IV=="" ? null : IV.replaceAll(/(IV=)/ig,'').trim()
                                        }
                                        return;
                                    }
                                }
                                if(/#EXT-X-TARGETDURATION/.test(item.trim())){
                                    bool = "true"
                                }
                                if(/#EXT-X-MAP:URI=/.test(item.trim())){
                                    mapURI = Ts[0].split("\n")[0]+"\n"+item.replaceAll('#EXT-X-MAP:URI=','').replaceAll('"','').replaceAll("'","").trim()
                                    Ts.unshift(mapURI)
                                    var list = []
                                    Ts.forEach(function(item,i){
                                        list.push(item)
                                        list.push(mapURI)
                                    })
                                    Ts = list.slice();
                                }
                            })
                            if(status == "key"){
                                if( /^(http:|https:)?(\/{0,2}([^\.\s\/]*\.){1,2}[\w]{1,8})/.test(keyUrl) ){
                                    keyData = syncRequest(keyUrl).then(val => {
                                        keyData = val
                                        console.log( "m3u8加密,启用解密")
                                    }).catch(e => {
                                        keyData = keytext
                                        //console.log("keyData出错：")
                                        console.log(e)
                                        console.log( "m3u8加密,解密困难，尝试中")
                                        //$(that).text("错误").css("display","inline-block").attr("title","m3u8加密，暂时无法解决。").next(".StopSaveUrl"+u).css("display","none").text("0%");
                                        //console.log("m3u8加密，暂时无法解决。")
                                        //layer.msg("m3u8加密，暂时无法解决。", {icon: 2});
                                        //return;
                                    })
                                }else{
                                    $(that).text("错误").css("display","inline-block").attr("title","m3u8加密，暂时无法解决。").next(".StopSaveUrl"+u).css("display","none").text("0%");
                                    console.log("m3u8加密，暂时无法解决。")
                                    layer.msg("m3u8加密，暂时无法解决。", {icon: 2});
                                    return;
                                }
                            }
                            //console.log(Ts)
                            var tsUrl,tsUrl1;
                            Ts.forEach(function(item,i){
                                if(/^(#EXTINF[^\n]*|#EXT-X-STREAM-INF[^\n]*)/.test(item.trim())){
                                    tsUrl = item.trim().match(/\n.*/img)[0].trim()
                                    //console.log(tsUrl)
                                    if(/^(http:|https:)/.test(tsUrl)){
                                        //"完整链接"
                                        tsUrl = item.trim()
                                    }else if( /^(\/{0,2}([^\.\s\/]*\.){1,3}[\w]{1,8}(:[\d]{1,5})?)\/.*/.test(tsUrl) ){

                                        tsUrl = href.trim().match(/^(http:|https:)/im)[0]+"//"+tsUrl.replace(/^(\/{0,2})/img,"")
                                    }else if( /^(\/)/.test(tsUrl)){ //"不完整，需要拼接" https://kitreply.com/60bf2929-9e66-4368-8718-c71203664836/playlist.m3u8
                                        tsUrl1 = url.replace("://",":\\"). split(/\//)[0].replace(":\\","://")
                                        tsUrl1 = tsUrl1 + tsUrl.replaceAll(/\s*/img,"")
                                        tsUrl = item.trim().replaceAll(tsUrl.trim(),tsUrl1)

                                    }else{
                                        tsUrl1 = url.split("?")[0].split("/");
                                        tsUrl1.pop();
                                        tsUrl1 = tsUrl1.join("/")+"/"+tsUrl.replaceAll(/\s*/img,"")
                                        tsUrl = item.trim().replaceAll(tsUrl.trim(),tsUrl1)
                                    }
                                    Ts[i] = tsUrl
                                    //console.log(tsUrl)
                                }
                            })
                            //console.log(Ts)
                            if(bool == "true"){
                                console.log("m3u8没有嵌套，直接解析。")
                                Ts.forEach(function(item,i){
                                    Ts[i] = item.trim().match(/\n.*/img)[0].trim();
                                });
                                //console.log(Ts)
                                tsLength = Ts.length;
                                tsS = tsLength;
                                var TssSize = parseInt( ( tsLength/ xcNum).toFixed(0) )
                                TssSize = TssSize < 1 ? 1 : TssSize;
                                //console.log(TssSize)
                                list0 = Ts.slice();
                                for(var i=0,z=0;i < tsLength; i = i+TssSize, z++){
                                    var range_start = i,range_end = i+TssSize;
                                    if (range_end > tsLength) {range_end = tsLength}
                                    //console.log(range_start+"  __  "+range_end)
                                    var tslist = Ts.slice(range_start,range_end);
                                    //console.log(tslist)
                                    downTs(tslist, tslist.shift(),i,status)
                                }
                                num =GM_D.push(request)
                                $(that).next('.StopSaveUrl'+u).data('num',num-1);
                            }else{
                                console.log("这下边嵌套了m3u8。")
                                var maxP='0x0',maxUrl='';
                                Ts.forEach(function(item,i){
                                    tsUrl = item.split("\n",2)
                                    if( /RESOLUTION=\d+\D\d+/igm.test( tsUrl[0] )){
                                        var P = tsUrl[0].match(/RESOLUTION=\d+\D\d+/igm)[0].match(/\d+\D\d+/igm)[0]
                                        if( maxP.split(/\D/).reduce(function(val1,val2){return val1*val2}) < P.split(/\D/).reduce(function(val1,val2){return val1*val2}) ){
                                            maxUrl = tsUrl[1] ;
                                            maxP = P
                                        }
                                    }else{
                                        maxUrl = tsUrl[1]
                                        return;
                                    }
                                })
                                //console.log(maxP,maxUrl)
                                //name = name.replace(/(\.mp4)*$/igm,"")+"_"+m3u8Url.split("?")[0].split("/").pop().replace(/(\.m3u8)*$/igm,"")+".mp4"
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: maxUrl,
                                    //headers: {'Referer': href },// 'If-Modified-Since': '0'},
                                    onerror: function(x) {
                                        $(that).text("错误").css("display","inline-block").attr("title","下载出错。").next(".StopSaveUrl"+u).css("display","none").text("0%");
                                        console,log(x)
                                    },
                                    onload: function(response) {
                                        url = maxUrl
                                        var Ts = response.responseText.trim()
                                        //console.log(Ts)
                                        var TsStart = Ts.split(/(#EXTINF[^\n]*)/)[0];
                                        //console.log(TsStart )
                                        if(/^#EXTM3U/.test(TsStart)){
                                            console.log("嵌套m3u8解析中")
                                            //layer.msg("嵌套m3u8解析中", {icon: 2});
                                            //console.log(Ts)
                                            var num1,num2,ad_ts
                                            if(GM_getValue("ad_n", 1)== set['ad_n']){
                                                while( Ts.search(/#EXT-X-DISCONTINUITY/i) != -1 ){
                                                    num1 = Ts.search(/#EXT-X-DISCONTINUITY/i);
                                                    Ts = Ts.replace(/#EXT-X-DISCONTINUITY/i,'这是要去除的部分')
                                                    num2 = Ts.search(/#EXT-X-DISCONTINUITY/i);
                                                    ad_ts = num2 != -1 ? Ts.slice( num1,num2+20) : Ts.slice(num1)
                                                    Ts = Ts.replace(ad_ts,"")
                                                    if( Ts.search(/#EXT-X-DISCONTINUITY/i) == -1){
                                                        break
                                                    }
                                                }
                                            }
                                            Ts = Ts.replaceAll(/^#(?!(EXTINF[^\n]*))[^\n]*/img,"").trim().replaceAll(/\n#/img,'??#').split('??')
                                            //console.log(Ts)
                                            Ts = Ts.filter(function(item){
                                                return item.trim() != "";
                                            });
                                            //console.log(Ts);
                                            var status = "",bool = "false",mapURI = "false",keyUrl,keytext;
                                            TsStart.split("\n").forEach(function(item){
                                                if(/#EXT-X-KEY/.test(item.trim())){
                                                    status = item.match(/METHOD=[\w-]{4,10}/im)[0]
                                                    if( status!=undefined && status!= null && status!=''){
                                                        status = status.replaceAll(/METHOD=/igm,'').trim()
                                                        if (status=='None'||status=="NONE"||status=='none'||status==''){
                                                            status = ""
                                                        }else{
                                                            status = "key"
                                                            keytext = item.match(/URI="[^"'\s]*"/i)[0].replaceAll(/(URI="|")/ig,'').trim()
                                                            keyUrl = keytext
                                                            if(/[\w]*\.key/.test(keyUrl)){
                                                                if( /^http[s]?:\/\/\w*\./.test(keyUrl)){    //"不完整，需要拼接"
                                                                    keyUrl = keyUrl
                                                                }else if( /^\/\/\w*\./.test(keyUrl) | /^\w*\.\w*/.test(keyUrl)){
                                                                    keyUrl = (new URL(url)).protocol + '//'+keyUrl.replaceAll(/(^\/\/)/ig,'')
                                                                }else{
                                                                    tsUrl1 = url.split("?")[0].split("/");
                                                                    tsUrl1.pop();
                                                                    keyUrl = tsUrl1.join("/")+"/"+keyUrl.replaceAll(/\s*/img,"")
                                                                }
                                                            }
                                                            IV = item.match(/IV=[\wx]*/i)[0]
                                                            IV = IV==null|IV==undefined|IV=="" ? null : IV.replaceAll(/(IV=)/ig,'').trim()
                                                        }
                                                        return;
                                                    }
                                                }
                                                if(/#EXT-X-MAP:URI=/.test(item.trim())){
                                                    mapURI = Ts[0].split("\n")[0]+"\n"+item.replaceAll('#EXT-X-MAP:URI=','').replaceAll('"','').replaceAll("'","").trim()
                                                    Ts.unshift(mapURI)
                                                    var list = []
                                                    Ts.forEach(function(item,i){
                                                        list.push(item)
                                                        list.push(mapURI)
                                                    })
                                                    Ts = list.slice();
                                                }
                                            })
                                            if(status == "key"){
                                                if( /^(http:|https:)?(\/{0,2}([^\.\s\/]*\.){1,2}[\w]{1,8})/.test(keyUrl) ){
                                                    keyData = syncRequest(keyUrl).then(val => {
                                                        keyData = val
                                                        console.log( "m3u8加密,启用解密")
                                                    }).catch(e => {
                                                        keyData = keytext
                                                        //console.log("keyData出错：")
                                                        console.log(e)
                                                        console.log( "m3u8加密,解密困难，尝试中")
                                                        //$(that).text("错误").css("display","inline-block").attr("title","m3u8加密，暂时无法解决。").next(".StopSaveUrl"+u).css("display","none").text("0%");
                                                        //console.log("m3u8加密，暂时无法解决。")
                                                        //layer.msg("m3u8加密，暂时无法解决。", {icon: 2});
                                                        //return;
                                                    })
                                                }else{
                                                    $(that).text("错误").css("display","inline-block").attr("title","m3u8加密，暂时无法解决。").next(".StopSaveUrl"+u).css("display","none").text("0%");
                                                    console.log("m3u8加密，暂时无法解决。")
                                                    layer.msg("m3u8加密，暂时无法解决。", {icon: 2});
                                                    return;
                                                }
                                            }
                                            //console.log(Ts)
                                            var tsUrl,tsUrl1;
                                            Ts.forEach(function(item,i){
                                                if(/^(#EXTINF[^\n]*|#EXT-X-STREAM-INF[^\n]*)/.test(item.trim())){
                                                    tsUrl = item.trim().match(/\n.*/img)[0].trim()
                                                    //console.log(tsUrl)
                                                    if(/^(http:|https:)/.test(tsUrl)){
                                                        //"完整链接"
                                                        tsUrl = item.trim()
                                                    }else if( /^(\/{0,2}([^\.\s\/]*\.){1,3}[\w]{1,8}(:[\d]{1,5})?)\/.*/.test(tsUrl) ){
                                                        tsUrl = href.trim().match(/^(http:|https:)/im)[0]+"//"+tsUrl.replace(/^(\/{0,2})/img,"")
                                                    }else if( /^(\/)/.test(tsUrl)){ //"不完整，需要拼接" https://kitreply.com/60bf2929-9e66-4368-8718-c71203664836/playlist.m3u8
                                                        tsUrl1 = url.replace("://",":\\"). split(/\//)[0].replace(":\\","://")
                                                        tsUrl1 = tsUrl1 + tsUrl.replaceAll(/\s*/img,"")
                                                        tsUrl = item.trim().replaceAll(tsUrl.trim(),tsUrl1)

                                                    }else{
                                                        tsUrl1 = url.split("?")[0].split("/");
                                                        tsUrl1.pop();
                                                        tsUrl1 = tsUrl1.join("/")+"/"+tsUrl.replaceAll(/\s*/img,"")
                                                        tsUrl = item.trim().replaceAll(tsUrl.trim(),tsUrl1)
                                                    }
                                                    Ts[i] = tsUrl
                                                    //console.log(tsUrl)
                                                }
                                            })
                                            //console.log(Ts)
                                            Ts.forEach(function(item,i){
                                                Ts[i] = item.trim().match(/\n.*/img)[0].trim();
                                            });
                                            tsLength = Ts.length;
                                            tsS = tsLength;
                                            var TssSize = parseInt( ( tsLength/ xcNum).toFixed(0) )
                                            TssSize = TssSize < 1 ? 1 : TssSize;
                                            list0 = Ts.slice();
                                            for(var i=0,z=0;i < tsLength; i = i+TssSize, z++){
                                                var range_start = i,range_end = i+TssSize;
                                                if (range_end > tsLength) {range_end = tsLength}
                                                //console.log(range_start+"  __  "+range_end)
                                                var tslist = Ts.slice(range_start,range_end);
                                                //console.log(tslist)
                                                downTs(tslist, tslist.shift(),i,status)
                                            }
                                            num =GM_D.push(request)
                                            $(that).next('.StopSaveUrl'+u).data('num',num-1);
                                        }else{
                                            var blob = new Blob([response.response])
                                            if( blob.size< 1024*1024/2 ){
                                                $(that).text("错误").css("display","inline-block").attr("title","URL链接异常").next(".StopSaveUrl"+u).css("display","none").text("0%");
                                                console.log("URL链接异常")
                                                layer.msg("URL链接异常，请检查链接后重试", {icon: 2});
                                                return;
                                            }
                                            var link = document.createElement("a");
                                            link.href = window.URL.createObjectURL(blob );
                                            link.download = name;
                                            link.click();
                                            link.remove();
                                            $(that).text("下载").css("display","inline-block").attr("title","下载").next(".StopSaveUrl"+u).css("display","none").text("0%");
                                        }
                                    }
                                })
                            }
                        }else{
                            var link = document.createElement("a");
                            link.href = window.URL.createObjectURL(new Blob([response.response]));
                            link.download = name;
                            link.click();
                            link.remove();
                            $(that).text("已下载").css("display","inline-block").attr("title","下载").next(".StopSaveUrl"+u).css("display","none").text("0%");
                        }
                    }
                })
            }
        })
        //停止
        $(".MyNR ."+VorA+" .StopSaveUrl"+u).click(function (){
            var num = $(this).data("num")
            GM_D[num].forEach(function(item){
                item.abort()
            })
            $(this).data("num","").css("display","none").text("0%").prev(".SaveUrl"+u).text("继续").attr("title","下载中断").css("display","inline-block");
        })
    }

    try {
        GM.webRequest()

        //嗅探
        GM_webRequest([
            { selector: '*://*/*.m3u8*', action: { redirect: { from: "(.*)", to: "$1" } } },
            { selector: '*://*/*m3u8*',  action: { redirect: { from: "(.*)", to: "$1" } } },
            //{ selector: { include: '*', exclude: 'http://exclude.me/*' }, action: { redirect: 'http://new_static.url' } },
            //{ selector: { match: '*://*/*' }, action: { redirect: { from: '([^:]+)://match.me/(.*)',  to: '$1://redirected.to/$2' } } }
        ], function(info, message, details) {
            //console.log(info, message, details);
            var z = details.url;
            if(z == $('#MyUrls .downUrl').val().trim() ){ return; }
            if(z !=undefined && z.trim()!="" ){
                addUrl( z )
            }
        });

        // 针对某音网站的视频
        if( location.host == 'www.douyin.com' ){
            GM_webRequest([

                { selector: 'https://v3-web-prime.douyinvod.com/video/*', action: { redirect: { from: "(.*)", to: "$1" } } },
                { selector: 'https://v26-web-prime.douyinvod.com/video/*', action: { redirect: { from: "(.*)", to: "$1" } } },
                { selector: 'https://www.douyin.com/aweme/v1/play/?file_id=*', action: { redirect: { from: "(.*)", to: "$1" } } },
                //{ selector: { include: '*', exclude: 'http://exclude.me/*' }, action: { redirect: 'http://new_static.url' } },
                //{ selector: { match: '*://*/*' }, action: { redirect: { from: '([^:]+)://match.me/(.*)',  to: '$1://redirected.to/$2' } } }
            ], function(info, message, details) {
                //console.log(info, message, details);
                var z = details.url.trim();
                if(z == $('#MyUrls .downUrl').val().trim() ){ return; }
                if(z !=undefined && z.trim()!="" ){
                    addUrl( z )
                }
            });
        }
    } catch(err) {
        //layer.msg("当前浏览器不支持 GM_webRequest()");
        console.log("当前浏览器不支持 GM_webRequest()");
    }

    //针对某bili
    if( location.host == 'www.bilibili.com' && ( /https:\/\/www\.bilibili\.com\/video\/BV\w*/i.test(location.href)||/https:\/\/www\.bilibili\.com\/bangumi\/play\/\w*/i.test(location.href) ) ){
        window.addEventListener("pushState", function () {
            biliVideo (1)
        });
        if (window.self == window.top) {
            //console.log("当前页面是最顶层 是iframe父");
            biliVideo (0)
        }
    }
    var bili_url = ''
    var New_bili_url=''
    function biliVideo (i){
        var set$ = setInterval(function(){
            var videoData
            switch( location.href.trim().match(/(www\.bilibili\.com\/(video|bangumi))/im)[0] )
            {
                case "www.bilibili.com/video":
                    videoData = unsafeWindow.__INITIAL_STATE__.videoData
                    var name = new URLSearchParams(window.location.search);
                    var page = name.get('p'); // 返回 'value1'
                    if(page == null||page ==undefined||page ==''){
                        page = 1
                    }
                    for (let i = 0; i < videoData.pages.length; i++) {
                        if (videoData.pages[i].page == page) {
                            New_bili_url = 'https://api.bilibili.com/x/player/playurl?avid='+ videoData.aid+'&cid='+ videoData.pages[i].cid+'&qn=120'
                            name = videoData.pages[i].part
                            if( name.trim() != $('.video-title').text().trim() ){
                                name = $('.video-title').text().trim()+" —— "+ name.trim()
                            }
                            break; // 当数字为4时退出循环
                        }
                    }
                    break;
                case "www.bilibili.com/bangumi":
                    if(i==0){
                        videoData = playurlSSRData.result.play_view_business_info.episode_info
                    }else{
                        videoData = $($.get({url:location.href,async:false}).responseText).last().text()
                        videoData = JSON.parse(videoData).props.pageProps.dehydratedState.queries[0].state.data.result.play_view_business_info.episode_info
                    }
                    New_bili_url = 'https://api.bilibili.com/x/player/playurl?avid='+ videoData.aid+'&cid='+ videoData.cid+'&qn=120'
                    name = $('[class^=mediainfo_mediaTitle__]').text()+" ["+videoData.title+"] : "+videoData.long_title
                    //console.log( videoData)
                    break;
                default:
                    break;
            }
            //console.log(New_bili_url,bili_url )
            if( location.host == 'www.bilibili.com' && ( /https:\/\/www\.bilibili\.com\/video\/BV\w*/i.test(location.href)||/https:\/\/www\.bilibili\.com\/bangumi\/play\/\w*/i.test(location.href) ) && New_bili_url!=bili_url ){
                bili_url = New_bili_url
                stopSet()
                GM_xmlhttpRequest({
                    method: "GET",
                    url: bili_url ,
                    headers: {'Referer': location.href,'If-Modified-Since': '0',"Cache-Control":"no-store"},
                    onerror: function(x) {
                        console.log("bili接口数据出错: url="+bili_url)
                        console.log(x)
                    },
                    onload: function(response) {
                        //console.log(response)
                        if( response.status>400){ return; }
                        var data = response.responseText;
                        New_bili_url = JSON.parse(data).data.durl[0].url;
                        url_lists.push( New_bili_url )
                        //console.log(url)
                        //url: 'https://api.bilibili.com/x/web-interface/wbi/view/detail?platform=web&bvid='+videoData.bvid+'&aid='+videoData.aid ,
                        addUrl(New_bili_url, name )
                    }
                })
            }
        },100);
        function stopSet(){ clearInterval(set$); };
    }
    var _wr = function(type) {
        var orig = history[type];
        return function() {
            var rv = orig.apply(this, arguments);
            var e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    unsafeWindow.history.pushState = _wr('pushState');
    unsafeWindow.history.replaceState = _wr('replaceState');

    // 覆盖console.clear函数
    //const originalClear = console.clear.bind(console);
    //unsafeWindow.console.clear = function() {
    //    console.warn('Console clear has been disabled.');
    //};
        // 覆盖console.clear函数
    //unsafeWindow.console = function() {
    //    console.warn('Console  assign() has been disabled.');
    //};

    function getNetworkRequsts(){
        return performance.getEntriesByType("resource") .filter((entry) => {
            return (entry.initiatorType === "audio"||entry.initiatorType === "video" || entry.initiatorType=== "xmlhttprequest" || entry.initiatorType=== "fetch");
        });
    }
    var observer = new PerformanceObserver(perf_observer);
    observer.observe({entryTypes: ["resource"]})
    unsafeWindow.scriptsList = []
    unsafeWindow.url_lists = []
    function perf_observer(list,observer){
        var z,m,length= 0;
        length = $('.MyUrls .isUrl').length
        var scripts =getNetworkRequsts()
        //console.log(scripts)
        scripts = scripts.filter(function(i){
            return !scriptsList.includes(i);
        } )
        if(scripts.length<1){ scripts.push('') }
        //console.log(scripts)
        scripts.forEach(function (x,i) {
            //console.log('script_foreach')
            if( x != ""){
                z = x.name.trim()
                if($('.MyNR div.downloadUrl > input.downUrl').map(function() {return $(this).val();}).get().includes(z) ){console.log('此链接是0、框里的'); return; }
                url_lists.push( z )
                //console.log(x)
                if( (/m3u8/i.test(z) && !/\.ts/i.test(z.replaceAll(/\?.*/g,''))) || /mp4\??.*/i.test(z) || /\.ogg\??.*/i.test(z) || /.*\.m4a\??.*/i.test(z) || /.*\.mp3\??.*/i.test(z) || !( /\.\w{1,5}$/i.test(z.replaceAll(/\?.*/g,'')) )){
                    if(z !=undefined && z.trim()!="" ){
                        var name = ""

                        switch( location.host )
                        {
                            case 'y.qq.com':
                                if(location.href== 'https://y.qq.com/n/ryqq/player' ){
                                    name = $('.player_music__info').text()
                                }
                                break;
                            case 'www.iwara.tv':
                                name = '['+$('a[class=username]').attr('title') +'] '+ $('title').text()
                                break;
                            case 'www.douyin.com' :
                            default:
                                break;
                        }
                        addUrl( z,name)
                    }
                }

            }
            $("video").each(function () {
                var that = $(this)
                if( that.parents("#giegei717dplayer").length!=0){  return; }
                if(!/^blob:/i.test( that.attr('src') ) ){
                    z = that.attr('src')
                    if(z !=undefined && z.trim()!="" ){
                        var name = ""
                        switch( location.host )
                        {
                            case 'buyin.jinritemai.com' :
                                if( /https\:\/\/buyin\.jinritemai\.com\/dashboard\/merch-picking-library\/merch-promoting\?/i.test( location.href ) ){
                                    var title =$(that).parents('[class^=index_module__contentCard____]').find('div[class^=index_module__authorInfo____]')
                                    name = title.find('[class^=index_module__name____]').text()
                                    var show = title.find('[class^=index_module__descLine____]').text()
                                    name = name+' --- '+show
                                    //if($('ul[class=auxo-pagination]').length!=0 && ul_li == 0){
                                    //    ul_li = 1
                                    //    $('.auxo-pagination>li:not(.auxo-pagination-item-active):not(.auxo-pagination-disabled)>a').on('click',function () {
                                    //        $('#Alldel').click()
                                    //    })
                                    //}

                                }
                                break;
                            default:
                                break;
                        }
                        addUrl( z,name)
                    }
                }
            })
            $("audio").each(function () {
                //console.log("audio")
                var that = $(this)
                z = $(this).attr('src')
                if( that.parents("#giegei717dplayer").length!=0){  return; }
                if(z !=undefined && z.trim()!="" ){
                    var name = ""
                    if( /https:\/\/y\.qq\.com\/n\/ryqq\/player/i.test(location.href) ){ name = $('.player_music__info').text() }
                    addUrl( z,name)
                }

            })
            $("source").each(function () {
                //console.log("source")
                if( $(this).parents("#giegei717dplayer").length!=0){ return; }
                if($(this).attr('src')!=undefined && $(this).attr('src').trim()!='' && !/^blob:/.test($(this).attr('src')) ){
                    if(!/^(http:|https:)/.test($(this).attr('src'))){
                        z = location.href.split("://")[0] +':'+ $(this).attr('src')
                    }else{
                        z = $(this).attr('src')
                    }
                    addUrl( z,"" )
                }
            })
        })
        scriptsList = scriptsList.concat(scripts);
        if($('.MyUrls .isUrl').length > length){
        }
    }
    var ul_li = 0



    window.addEventListener('message', function(event) {
        var url = event.data
        if( url.url== undefined || url.url == null || url.url ==""){ return; }
        addUrl(url.url, url.name , url.href)
    }, true)

    if (window.self !== window.top && ($('#MyUpDown').css("display")!="none" || $('#MyUrls').css("display")!="none") ) {
        $('#MyUpDown,#MyUrls').css("display","none")
        //console.log($('body'))
    }
    unsafeWindow.url_info = []
    unsafeWindow.urls = []
    function addUrl( url ,name='',href = location.href){
        //alert(url)
        if( url == undefined || url == null || url.length < 1){
            console.log("addurl=null, return.")
            return;
        }

        if (window.self != window.top) {
           // console.log("当前页面位于iframe子页面");
            var message = { url:url,name:name, href:location.href }; // 要传递的消息
            window.parent.postMessage(message, "*"); // *表示任意源都能收到消息
            return;
        } else {
            //console.log("当前页面不在iframe子页面内部");
            url = url.toString().trim()
            if(/^(http:|https:)/.test(url)){
                //"完整链接"
            }else if( /^(\/{0,2}([^\.\s\/]*\.){1,3}[\w]{1,8}(:[\d]{1,5})?)\/.*/.test(url) ){
                // 缺少协议
                url = href.trim().match(/^(http:|https:)/im)[0]+"//"+url.replace(/^(\/{0,2})/img,"")
            }else if( /^(\/)/.test(url)){ //"不完整，需要拼接"
                url = location.origin + url
            }
        }
        //console.log(url)
        if(! urls.includes(url.trim())){
            urls.push(url.trim())
        }else{
            return;
        }
        switch( location.host )
        {
            case 'x.com':
                if( /(\/pl\/mp4a\/|\/pl\/avc1)/i.test( url ) ){
                    return
                }
                break;
            case 'www.iwara.tv':
                if( !/(_Source\.mp4)/i.test( url ) ){
                    return
                }
                break;
            default:
                break;
        }
        //console.warn(url)
        GM_xhr( url)
        function GM_xhr( url, i=0){
            //console.warn("——————")
            //console.warn(i)
            //console.warn("——————")
            var head
            var Headers
            var Length
            var Type
            var origin= (new URL(href)).origin
            switch( i )
            {
                case 0:
                    head = {Range:"bytes=0-200", 'Cache-Control':"no-store"}
                    break;
                case 1:
                    head = {Referer: href, Range:"bytes=0-200", "Cache-Control":"no-store"}
                    break;
                case 2:
                    head = {Referer: href, Origin: origin ,Range:"bytes=0-200", "Cache-Control":"no-store"}
                    break;
                case 3:
                    href = (new URL(url)).origin+'/'
                    head = {Referer: href, Origin: origin }// ,Range:"bytes=0-200", "Cache-Control":"no-store"}
                    break;
                case 4:
                    origin = location.origin
                    head = {Referer: href, Origin: location.origin ,Range:"bytes=0-200", "Cache-Control":"no-store"}
                    break;
                case 5:
                    href = url
                    head = {Referer: url, Range:"bytes=0-200"}
                    break;
                case 6:
                default:
                    console.log("Url始终HEAD 错误，不添加列表: "+url)
                    return;
                    break;
            }

            //console.warn(1)
            var get = GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: head, //{'Referer': location.href, "Range":"bytes=0-200", "Cache-Control":"no-store"},
                onerror: function(x) {
                    //console.warn(2)
                    console.log("Url错误onerror,HEAD出错 : "+url)
                    console.log(x)
                    url_info.push( { url:url, info: "Url错误onerror,HEAD出错 ", response: x} )
                    GM_xhr( url , i+1 )
                    get.abort()
                    return;
                },
                onload: function(response) {
                    //console.warn(head)
                    if(response.status/100>=3&& response.status!=404 ){
                        console.log("Url错误onerror,HEAD 403: "+url)
                        url_info.push( { url:url, info: "Url错误onerror,HEAD 403", response: response} )
                        GM_xhr( url , i+1 )
                        return;
                    }
                    if(response.status/100>=3){
                        console.log("Url错误onerror,HEAD出错 不添加列表: "+url)
                        console.log(response)
                        url_info.push( { url:url, info: "Url错误status>400 不添加列表", response: response} )
                        get.abort()
                    }
                    //console.log(response)
                    Headers = response.responseHeaders;
                    if( Headers == undefined || Headers == null || Headers ==""||Headers.length<1 ){
                        console.log("Url:"+url+",HEAD出错: responseHeaders 为空")
                        url_info.push( { url:url, info: "HEAD出错: responseHeaders 为空", response: response} )
                        return;
                    }
                    Type = Headers.match(/content-type:\s*[\S]+\s/im)

                    //console.log(Type)
                    //console.log(Headers)
                    var VorA = "MyVideo"
                    if(Type == undefined || Type == null || Type.length<1){
                        if( /^#EXTM3U/i.test(response.responseText) ){
                            Type = 'hls'; VorA = "MyVideo"
                        }else{
                            console.log("Type为空"+url)
                            console.log(response)
                            url_info.push( { url:url, info: "Type为空", response: response} )
                            return
                        }
                    }else{
                        Type = Type[0].replace('content-type:','').trim()
                        //console.log(Type)
                        if( /.*video\/mp4.*/i.test( Type ) || ( /application\/octet-stream/i.test( Type ) && /mp4\??.*/i.test(url) ) ){
                            Length = Headers.match(/content-range:\s*bytes\s*0-[\d]+\/[\d]+\s/im)[0].replace(/.*\//img,'').trim()
                            if( Length < 1024*1024){
                                console.log("嗅探到的视频太小x1："+Length+"B ,丢弃："+url)
                                url_info.push( { url:url, info: "嗅探到的视频太小x1："+Length+"B ,丢弃", response: response} )
                                return;
                            }
                            Type = 'normal'; VorA = "MyVideo"
                        }else if( /.*\/.*mpegurl.*/i.test( Type )){
                            Type = 'hls'; VorA = "MyVideo"
                        }else if( /.*audio\/.*/i.test( Type )){
                            Type = 'auto'; VorA = "MyAudio" //音乐
                        }else if( /.*(text\/[\w]*).*/i.test( Type ) ) {
                            if( /^#EXTM3U/i.test(response.responseText) ){
                                Type = 'hls'; VorA = "MyVideo"
                            }else{
                                console.log(" 是文本 不要："+url)
                                url_info.push( { url:url, info: "是文本 不要", response: response} )
                                return;
                            }
                        }else{
                            url_info.push( { url:url, info: "Type:"+Type, response: response} )
                            console.log(Type, url)
                            return;
                        }
                    }

                    // console.warn(4)
                    //console.warn(window.self != window.top)
                    //console.log(url)
                    //console.log(Type)
                    //console.log(Length)
                    var x = $("#MyUrls .MyNR>."+VorA)
                    x.find(".urlnone").remove()
                    var num = x.find('.isUrl').length+1
                    x.append("<div class='isUrl' style='height: 31px;'>"+
                             "<hr    > " +
                             "<div   class='No-isUrl'> " +num+"、</div>"+
                             "<input disabled  data-type='"+Type+"'  class='downUrl"+num+"'   title='"+url+"' value='"+url+"'> "+
                             "<input title='"+ (name=="" ? '自定义保存文件名' : name) +"'        class='downName"+num+"'  placeholder='文件名' value='"+name+"'>"+
                             "<div   style='display: inline-block;'  class='But GoUrl"+num+"'      >访问</div>"+
                             "<div   style='display: inline-block;'  class='But CopyUrl"+num+"'    >复制</div>"+
                             "<div   style='display: inline-block;'  data-head_i='"+i+"' data-head_href='"+href+"' data-head_origin='"+origin+"' data-Headers='"+Headers+"' data-Length='"+Length+"' data-Type='"+Type+"' data-head='"+ JSON.stringify(head) +
                             "'  class='But SaveUrl"+num+"'    >下载</div>"+
                             "<div   style='display: none;        '  class='But StopSaveUrl"+num+"'> 0% </div>"+
                             "<div   style='display: inline-block;'  class='But playUrl"+num+"'    >播放</div>&nbsp"+
                             "<div   title='删除此条'                class='rmUrl"+num+"'          >&nbspx&nbsp</div>"+
                             "</div>")
                    functionAll(num,VorA)
                    if($("#MyUrls").css("display")=="none"){
                        $("#redPoint").css("display","block")
                        $(".MyBT #"+VorA).click()
                        if(GM_getValue("auto_n", 1) == set['auto_n']){
                            $("#MyUpDown").click()
                        }
                    }
                }
            })
            }
    }


    function mkMenu(list){
        list.forEach( function(menu){
            var No = menu.No
            var key = menu.key
            var keyName = menu.keyName
            var keyVal = GM_getValue( keyName, 1)
            if( No == 0 ){
                menuList[No] = GM_registerMenuCommand( key , function() { eval( keyName ) })
            }else{
                menuList[No] = GM_registerMenuCommand( key+info[ keyVal == set[keyName] ? 1 : 0 ], function() {
                    keyVal = keyVal == 1 ? 0 : 1
                    GM_setValue(keyName, keyVal);
                    mkMenu( [menu] )
                }, { id: menuList[No] } );
            }
        })
    }
    function rmMenu(id){
        GM_unregisterMenuCommand(id);
    }

    function dplayerUrl(url,i,type){
        var lay_i = unsafeWindow.dpgiegei717index;
        $('#layui-layer'+lay_i+',#layui-layer-shade'+lay_i).remove()
        var index = layer.load(2);
        var conf = {
            type: 1,
            //formType: 0,
            title: i+"、"+url,
            shadeClose: true,  //点击遮罩关闭
            offset: offset,  // 垂直位置
            fixed: true,  //层固定，不随页面滚动
            maxmin: true, //最大小化
            resize: true, //拉伸
            airplay: true, //在 Safari 中开启 AirPlay
            chromecast: true, //启用 Chromecast
            move: '.layui-layer-title', // 是否允许拖动
            moveOut: false, //是否允许拖拽到窗口外
            btn: [],
            area: weight,
            content: "<div id='giegei717dplayer' style='width: 100%;height: 100%;display:flex;align-items:center;justify-content:center;'></div>"
            ,success:  function(layero, index){
                //var
                unsafeWindow.dpgiegei717 = new DPlayer({
                    element: document.getElementById("giegei717dplayer"),
                    preload: 'auto',  //视频预加载
                    hotkey: true,     //键盘热键
                    volume: 1,        //默认音量
                    mutex: true,      //互斥 同时只有一个播放器能播放
                    loop: false,      //循环播放
                    airplay: true,    //在 Safari 中开启 AirPlay
                    playbackSpeed: [0.1,0.5, 1, 1.25, 1.5, 2], //可选的播放速率
                    screenshot: true, //开启截图
                    autoplay: true,   //自动播放
                    preventClickToggle: false, //阻止点击播放器时候自动切换播放/暂停
                    contextmenu: [
                        {
                            text: '刷新视频',
                            click: (player) => {
                                //console.log(player);
                                player.switchVideo(
                                    {
                                        url: url,
                                        type: type,
                                    },
                                );
                                player.play()
                            },
                        },
                        {
                            text: '复制链接',
                            click: (player) => {
                                GM_setClipboard(url);
                                var aux = document.createElement("input");
                                aux.setAttribute("value", url);
                                document.body.appendChild(aux);
                                aux.select();
                                document.execCommand("copy");
                                document.body.removeChild(aux);
                                layer.msg("已复制")
                            }
                        }
                    ],
                    video: {
                        url: url,
                        type: type,
                    },
                });
                dpgiegei717.video.crossOrigin=null;
                dpgiegei717.on('error', function () {
                    if( firstVideo == 0 ){
                        console.log('加载video的扩展js')
                        GM_addElement('script', { src: 'https://cdn.bootcdn.net/ajax/libs/flv.js/1.6.2/flv.min.js',type: 'text/javascript' });
                        GM_addElement('script', { src: 'https://cdn.bootcdn.net/ajax/libs/shaka-player/4.3.5/shaka-player.compiled.min.js',type: 'text/javascript' });
                        GM_addElement('script', { src: 'https://cdn.bootcdn.net/ajax/libs/dashjs/4.6.0/dash.all.min.js',type: 'text/javascript' });
                        firstVideo = 1
                        dpgiegei717.switchVideo({ url: url, type: type, });
                        dpgiegei717.play()
                    }
                });
                //dp.video.crossOrigin="anonymous";
                //$("#giegei717dplayer video").attr("crossOrigin","anonymous")
                var set = setInterval(function(){
                    if($('#giegei717dplayer>.dplayer-video-wrap>video').length>0){
                        var video = $('#giegei717dplayer>.dplayer-video-wrap> video[class^=dplayer-video]')[0]
                        stopSet()
                        //双击全屏
                        var touchtime = 0;
                        var touchtarget;
                        $('#giegei717dplayer>.dplayer-video-wrap> video[class^=dplayer-video]').on("dblclick",function () {
                            if (document.fullscreenElement == null) {
                                dpgiegei717.fullScreen.request();
                            } else {
                                dpgiegei717.fullScreen.cancel();
                            }
                        }).on('touchstart', function(event) {
                            if (touchtime == 0) {
                                touchtime = new Date().getTime();
                                touchtarget = event.target;
                            } else {
                                if (event.target == touchtarget && new Date().getTime() - touchtime < 300) {
                                    // 双击事件发生
                                    //console.log('双击事件发生');
                                    if (document.fullscreenElement == null) {
                                        dpgiegei717.fullScreen.request();
                                    } else {
                                        dpgiegei717.fullScreen.cancel();
                                    }
                                    touchtime = 0;
                                } else {
                                    touchtime = new Date().getTime();
                                    touchtarget = event.target;
                                }
                            }
                        });
                        //画中画
                        $('#giegei717dplayer .dplayer-icons-right').prepend('<div class="dplayer-icon dplayer-hzh-icon" data-balloon="画中画" data-balloon-pos="up">'+
                                                                      '<span class="dplayer-icon-content"><svg width="24" height="22" xmlns="http://www.w3.org/2000/svg">'+
                                                                      '<path  d="m19.22801,9.8748l-8.11544,0l0,5.89418l8.11544,0l0,-5.89418zm4.05772,7.85891l0,-13.77273c0,-1.0806 -0.91299,-1.94508 -2.02886,-1.94508l-18.25974,0c-1.11587,0 -2.02886,0.86448 -2.02886,1.94508l0,13.77273c0,1.0806 0.91299,1.96473 2.02886,1.96473l18.25974,0c1.11587,0 2.02886,-0.88413 2.02886,-1.96473zm-2.02886,0.01965l-18.25974,0l0,-13.80221l18.25974,0l0,13.80221z"></path>'+
                                                                      '</svg></span>'+
                                                                      '</div>')
                        $('#giegei717dplayer .dplayer-icons-right>.dplayer-hzh-icon').on('click',function(){
                            var that = this;
                            if(hzh == false && !document.pictureInPictureElement){
                                video.requestPictureInPicture();
                                video.addEventListener('enterpictureinpicture', function() {
                                    // 已进入画中画模式
                                    hzh = true;
                                });
                            }else{
                                document.exitPictureInPicture();
                                video.addEventListener('leavepictureinpicture', function() {
                                    // 已退出画中画模式
                                    hzh = false;
                                });
                            }
                        })
                        //刷新按钮
                        $('#giegei717dplayer .dplayer-icons-right').prepend('<div class="dplayer-icon dplayer-reload-icon" data-balloon="刷新" data-balloon-pos="up">'+
                                                                      '<span class="dplayer-icon-content"><svg width="24" height="22" xmlns="http://www.w3.org/2000/svg" >'+
                                                                      '<path stroke="null" d="m3.06995,10.0686a0.7572,0.7696 0 0 1 0.7572,0.7696l0,0.3848c0,4.45446 3.6853,8.08083 8.2482,8.08083c2.08458,0 4.04346,-0.7596 5.54802,-2.10102l0.19384,-0.17778l0.27638,-0.2632a0.7572,0.7696 0 0 1 1.06993,0.03694l0.51717,0.56181a0.7572,0.7696 0 0 1 -0.03559,1.08822l-0.27714,0.26243c-1.94677,1.85012 -4.53791,2.9014 -7.29185,2.9014c-3.33926,0 -6.32036,-1.53844 -8.24896,-3.94037l0,0.86195a0.7572,0.7696 0 0 1 -0.7572,0.7696l-0.7572,0a0.7572,0.7696 0 0 1 -0.7572,-0.7696l0,-7.69603a0.7572,0.7696 0 0 1 0.7572,-0.7696l0.7572,0zm8.54729,-9.23523c3.2802,0 6.2083,1.52381 8.11115,3.90342l0,-0.82501a0.7572,0.7696 0 0 1 0.7572,-0.7696l0.7572,0a0.7572,0.7696 0 0 1 0.7572,0.7696l0,7.69603a0.7572,0.7696 0 0 1 -0.7572,0.7696l-0.7572,0a0.7572,0.7696 0 0 1 -0.7572,-0.7696l0,-0.3848c0,-4.45831 -3.627,-8.08083 -8.11115,-8.08083c-2.15045,0 -4.16385,0.83579 -5.66614,2.29803l-0.17794,0.17855l-0.26502,0.27475a0.7572,0.7696 0 0 1 -1.07144,0.00924l-0.53988,-0.53872a0.7572,0.7696 0 0 1 -0.00909,-1.08899l0.26502,-0.27475a10.43424,10.60512 0 0 1 7.46449,-3.16691z"></path>'+
                                                                      '</svg></span>'+
                                                                      '</div>')
                        $('#giegei717dplayer .dplayer-icons-right>.dplayer-reload-icon').on('click',function(){
                            dpgiegei717.switchVideo({ url: url, type: type, });
                            dpgiegei717.play()
                        })
                    }
                },50);
                function stopSet(){
                    clearInterval(set);
                }
                window.onresize = function () {
                    w = window.innerWidth;
                    h = window.innerHeight;
                    $("#giegei717dplayer").parents("div[id^=layui-layer]").css({"max-width": w,"max-height": h } )
                }
            }
            ,end: function(){
                $(".But:nth-last-of-type(2)").text('播放')
            }

        }
        layer.close(index);
        unsafeWindow.dpgiegei717index = layer.open(conf)
    }

    function me(){
        var conf1 = {
            formType: 0,
            title: "支持作者,你的支持就是作者的动力！",
            move: false,  //禁止拖动
            shadeClose: true,  //点击遮罩关闭
            offset: '100px',  // 垂直位置
            resize: false,
            btn: ['点击关闭（点此关闭后以后不再自动弹出）'],
            area: weight1,
            content: "<h4 style='color:red'>注意：如果下载的视频不完整、缺少片段，可尝试在油猴扩展的脚本菜单中关闭视频下载去广告功能</h4><div id='giegei717dplayer' style='width: 500px;height: 500px;display:flex;align-items:center;justify-content:center;'><img src='data:image/jpeg;base64,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'  border='0' width='100%' height='100%' /></div>"
            ,success: function(layero, index){
                $('layui-layer-btn .layui-layer-btn0').css({'border-color': '#1e9fff !important','background-color': '#1e9fff !important','color': '#fff !important'})
            }
            ,yes: function(index, layero){
                GM_setValue("first1",99);
                layer.close(index)
            }
            ,cancel: function(index, layero, that){
                GM_setValue("first1",99);
                layer.close(index)
            }
        }
        layer.open(conf1)
        return
    }

    function FirstOpen(){
        var one = GM_getValue("first1", 0)
        if(one==0){
            me();
        };
    }

})();