onmessage = function (event) {
  var objAim = null,
    errorMsg = "",
    level = 0,
    objStr = "";
  try {
    objAim = JSON.parse(event.data, function (k, v) {
      //console.log(k); // 输出当前的属性名，从而得知遍历顺序是从内向外的，
      // 最后一个属性名会是个空字符串。
      //{"a":1,"b":{"c":1},"d":{"e":{"f":{"g":1}}},"h":"","i":"\n1" , "k" : null }
      return v; // 返回原始属性值，相当于没有传递 reviver 参数。
    });
  } catch (ex) {
    errorMsg = ex.message;
    console.log('json parse faile:' + ex.message);
  }
  function deep(obj, use_N) {
    var len = 0;
    level++;
    switch (toString.call(obj)) {
      case '[object Object]':
        objStr += (use_N ? ("\n" + (new Array(level)).join("\t")) : '') + "{\n";
        for (var it in obj) { }
        for (var item in obj) {
          objStr += (new Array(level + 1)).join("\t") + JSON.stringify(item) + ' : ';
          if (Object.prototype.hasOwnProperty.call(obj, item)) {
            deep(obj[item]);
            level--;
            objStr += it === item ? "\n" : ",\n";
          }
        }
        objStr += (new Array(level)).join("\t") + "}";
        break;
      case '[object Array]':
        objStr += "[";
        len = obj.length;
        obj.forEach(function (item, index) {
          deep(item, typeof item === 'number' || typeof item === 'string' || typeof item === 'object');
          level--;
          objStr += (len - 1) === index ? "" : ",";
        });
        objStr += "\n" + (new Array(level)).join("\t") + "]";
        break;
      case '[object Number]':
      case '[object Boolean]':
        objStr += (use_N ? ("\n" + (new Array(level)).join("\t")) : '') + obj.toString();
        break;
      case '[object Date]':
      case '[object RegExp]':
        objStr += "\"" + obj.toString() + "\"";
        break;
      case '[object Null]':
      case '[object String]':
        objStr += (use_N ? ("\n" + (new Array(level)).join("\t")) : '') + JSON.stringify(obj);
        break;
      default:
        //[object Undefined] ,[object Function] ,[object Event]
        objStr += (obj + "");
        break;
    }
  }
  deep(objAim);
  postMessage({ objAim: objAim, aimStr: objStr, errorMsg: errorMsg });
};
onerror = function (event) {
  console.log('error form worker:' + event);
};