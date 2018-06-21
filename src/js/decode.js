!(function () {
  function $(id) {
    return document.getElementById(id);
  }
  function decode(val) {
    var times = 0;
    // if (!val.match(/^(http(s)?:\/\/)?[a-z0-9]+(\.[a-z0-9]+)*(\/)?(.)*/i)) {
    //   console.error('不合法的url');
    //   return val;
    // }
    var data = {
      params: (val.match(/[\=]/) || []).length,
      bits: val.length,
      length: val.length,
      protocol: (val.match(/^http(s)?/) || ['未识别'])[0],
      domain: val.replace(/^(http[s]?:\/\/)?([a-z0-9]+(?:\.[a-z0-9]+)*)(.)*/i, '$2') || '',
      // url: val
    }
    for (var da in data) {
      try {
        $('data-' + da).innerHTML = data[da];
      } catch (error) {
        console.log('this dom of id is data-' + da + ' is not exzist!!');
      }
    }
    resultArea.value = val;
    if (auto.checked) {
      val = val.replace(/(\?(?!\?)|\&|\#)/g, '\n$1\n');
    }
    function fn(val) {
      times++;
      val = window.decodeURIComponent(val);
      times > 2 ? '' : fn(val);
      return val;
    }
    return fn(val);
  }
  var txt = $('url_txt'),
    cbx = $('isClear_cbx'),
    auto = $('isAutoChangeLine_cbx'),
    resultArea = $('json_result'),
    cacheValue = '';
  txt.addEventListener('paste', function (e) {
    setTimeout(function () {
      cacheValue = txt.value;
      txt.value = decode(cacheValue) || cacheValue;
    }, 0);
  });
  txt.addEventListener('blur', function (e) {
    if (cbx.checked) {
      txt.value = '';
    }
  })
})();