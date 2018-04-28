!(function () {
    function $(id) {
        return document.getElementById(id);
    }
    function testUrl(url, cb) {
        // 不好
        // var img = new Image();
        // img.onerror = function name(error) {
        //     console.log(error);
        // }
        // img.onload = function name(e) {
        //     console.log(e);
        //     typeof cb === 'function' && cb();
        // }
        // img.src = url;

        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.send();
        xhr.onreadystatechange = function(e){
            if(xhr.status < 4){
                return;
            }
            if(xhr.readyState >= 200 && xhr.readyState <= 504){
                typeof cb === 'function' && cb(xhr.responseText, e);
            }
        }
        setTimeout(function(){
            xhr.abort();
            console.log(xhr.responseURL);
        },50);
        history.pushState(url,document.title, null);
    }
    function decode(val) {
        var times = 0;
        if (!val.match(/^(http(s)?:\/\/)?([a-zA-Z]+\.){2,}[a-zA-Z]+(\/)?(.)*/)) {
            alert('不合法的url');
            return val;
        }
        testUrl(val,function(e){
            console.log(e);
        });
        var data = {
            params: (val.match(/[\=]/) || []).length,
            bits: val.length,
            length: val.length,
            protocol: val.replace(/^(http|https)\.*/, '$1') || '',
            domain: val.replace(/^(http(s)?:\/\/)?(([a-zA-Z]+\.){2,}[a-zA-Z]+)(.)*/, '$2') || '',
            url: val
        }
        for (var da in data) {
            try {
                $('data-' + da).innerHTML = data[da];    
            } catch (error) {
                console.log('this dom of id is data-' + da + ' is not exzist!!');
            }
        }
        function fn(val) {
            times++;
            val = window.decodeURIComponent(val);
            // console.log(val);
            times > 2 ? '' : fn(val);
            return val;
        }
        return fn(val);
    }
    function analysis(url) {
        var obj = {};
        obj.protocol = url.replace(/^(http|https)/, '$1');
        return obj;
    }
    var txt = $('url_txt'),
        cbx = $('isClear_cbx'),
        auto = $('isAutoChangeLine_cbx'),
        cacheValue = '';
    txt.addEventListener('paste', function (e) {
        setTimeout(function () {
            cacheValue = txt.value;
            txt.value = (decode(cacheValue) || "").replace(/(\?|\&|\#)/g, '\n$1\n');
        }, 0);
    });
    txt.addEventListener('blur', function (e) {
        // console.log(cbx.value);
        if (cbx.checked) {
            txt.value = '';
        }
    })
})();
