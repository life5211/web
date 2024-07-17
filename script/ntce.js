//==============================
// 原始登录函数

//数据是否通过验证
var avail = false;
function login() {
    if (!avail) {
        alert("请先拖动滑块填充拼图完成校验!");
        return;
    }
    var account = $("#idNum").val().replace(/(^\s*)|(\s*$)/g, "").toUpperCase();
    var password = $("#password").val();
    var stamp = new Date().getTime();

    var pwd = hex_md5(account + hex_md5(password));

    var rsa = new JSEncrypt();
    rsa.setPublicKey(_rsa_key);
    // 对敏感数据进行加密
    var en = rsa.oencrypt(account);

    // 计算签名
    var sign = signatureLogin(rsa, account, pwd, 1, stamp, stamp);

    var data = JSON.stringify({
        account: en,
        mode: 1,
        hash: hash,
        offsetX: offsetX
    });


    //按钮60秒禁止
    time(document.getElementById("btnvalid"));

    $post("rest/security/identify/login2", data, {
            success: function (result) {
                avail = false;
                // console.log(result);//打印服务端返回的数据(调试用)
                localStorage.account = account;
                localStorage.accessToken = result.data.accessToken;
                // 解密key3：用3des解密，密钥为登录密码的前24位
                var key3 = des3_decrypt(pwd.substring(0, 24), result.data.key3);
                localStorage.key3 = key3;
                // 解密随机数
                localStorage.random = des3_decrypt(key3, result.data.random);
                localStorage.hash = result.data.hash;
                localStorage.teacher = JSON.stringify(result.data.teacher);
                localStorage.latestLoginTime = result.data.latestLoginTime;

                window.location.href = "desktop/index.html?t=" + Date.parse(new Date());
            },
            failure: function (code, message) {
                //avail = false;
                var msg = api_error[code] || message;
                alert(msg);
            }
        },
        sign,
        stamp
    );

}

//====================分割线================
//去除验证码并且自动重复登录的函数
//http://subsimple.com/bookmarklets/jsbuilder.html
//填好账户密码后按F12 选择console 粘贴以下代码并回车可实现自动登录

var i = 1;
function login() {
    var account = $("#idNum").val().replace(/(^\s*)|(\s*$)/g, "").toUpperCase();
    var password = $("#password").val();
    var stamp = new Date().getTime();
    var pwd = hex_md5(account + hex_md5(password));
    var rsa = new JSEncrypt();
    rsa.setPublicKey(_rsa_key);
    var en = rsa.oencrypt(account);
    var sign = signatureLogin(rsa, account, pwd, 1, stamp, stamp);
    var data = JSON.stringify({account: en, mode: 1, hash: hash, offsetX: offsetX});
    $post("rest/security/identify/login2", data, {
        success: function (result) {
            avail = false;
            console.log(result);
            localStorage.account = account;
            localStorage.accessToken = result.data.accessToken;
            var key3 = des3_decrypt(pwd.substring(0, 24), result.data.key3);
            localStorage.key3 = key3;
            localStorage.random = des3_decrypt(key3, result.data.random);
            localStorage.hash = result.data.hash;
            localStorage.teacher = JSON.stringify(result.data.teacher);
            localStorage.latestLoginTime = result.data.latestLoginTime;
            window.location.href = "desktop/index.html?t=" + Date.parse(new Date());
        }, failure: function (code, message) {
            var msg = api_error[code] || message;
            var sleep = parseInt(Math.random() * 500 + 300);
            console.log(i + " " + msg);
            i++;
            setTimeout(login, sleep);
        }
    }, sign, stamp);
}
var url = document.URL;
if (url.search("http://sso.jszg.edu.cn/") > -1 && url.search("login.html") > 0) {
    login();
} else {
    console.log("Page Error");
}


//==============================分割线========
//封装为闭包
javascript:(function () {
    var i = 1;
    function login() {
        var account = $("#idNum").val().replace(/(^\s*)|(\s*$)/g, "").toUpperCase();
        var password = $("#password").val();
        var stamp = new Date().getTime();
        var pwd = hex_md5(account + hex_md5(password));
        var rsa = new JSEncrypt();
        rsa.setPublicKey(_rsa_key);
        var en = rsa.oencrypt(account);
        var sign = signatureLogin(rsa, account, pwd, 1, stamp, stamp);
        var data = JSON.stringify({account: en, mode: 1, hash: hash, offsetX: offsetX});
        $post("rest/security/identify/login2", data, {
            success: function (result) {
                avail = false;
                console.log(result);
                localStorage.account = account;
                localStorage.accessToken = result.data.accessToken;
                var key3 = des3_decrypt(pwd.substring(0, 24), result.data.key3);
                localStorage.key3 = key3;
                localStorage.random = des3_decrypt(key3, result.data.random);
                localStorage.hash = result.data.hash;
                localStorage.teacher = JSON.stringify(result.data.teacher);
                localStorage.latestLoginTime = result.data.latestLoginTime;
                window.location.href = "desktop/index.html?t=" + Date.parse(new Date());
            }, failure: function (code, message) {
                var msg = api_error[code] || message;
                var sleep = parseInt(Math.random() * 500 + 300);
                console.log(i + " " + msg);
                i++;
                setTimeout(login, sleep);
            }
        }, sign, stamp);
    }
    var url = document.URL;
    if (url.search("http://sso.jszg.edu.cn/") > -1 && url.search("login.html") > 0) {
        login();
    } else {
        console.log("Page Error");
    }
})();

//========================分割线======
//添加浏览器书签名称自定义，链接复制以下代码
//在教师资格认定网   填好账户密码后点击书签自动登录

javascript:(function(){var i=1;function login(){var account=$("#idNum").val().replace(/(^\s*)|(\s*$)/g,"").toUpperCase();var password=$("#password").val();var stamp=new Date().getTime();var pwd=hex_md5(account+hex_md5(password));var rsa=new JSEncrypt();rsa.setPublicKey(_rsa_key);var en=rsa.oencrypt(account);var sign=signatureLogin(rsa,account,pwd,1,stamp,stamp);var data=JSON.stringify({account:en,mode:1,hash:hash,offsetX:offsetX});$post("rest/security/identify/login2",data,{success:function (result){avail=false;console.log(result);localStorage.account=account;localStorage.accessToken=result.data.accessToken;var key3=des3_decrypt(pwd.substring(0,24),result.data.key3);localStorage.key3=key3;localStorage.random=des3_decrypt(key3,result.data.random);localStorage.hash=result.data.hash;localStorage.teacher=JSON.stringify(result.data.teacher);localStorage.latestLoginTime=result.data.latestLoginTime;window.location.href="desktop/index.html?t="+Date.parse(new Date());},failure:function (code,message){var msg=api_error[code]||message;var sleep=parseInt(Math.random()*500+300);console.log(i+" "+msg);i++;setTimeout(login,sleep);}},sign,stamp);}var url=document.URL;if(url.search("http://sso.jszg.edu.cn/")>-1&&url.search("login.html")>0){login();}else{console.log("Page Error");}})()

