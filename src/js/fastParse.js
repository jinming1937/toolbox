onmessage = function (event) {
  var objAim = null,
    errorMsg = "",
    objStr = "";
  try {
    objAim = JSON.parse(event.data);
  } catch (ex) {
    errorMsg = ex.message;
    console.log('json parse faile:' + errorMsg);
  }
  objStr = JSON.stringify(objAim, null, '    ');
  postMessage({ objAim: objAim, aimStr: objStr, errorMsg: errorMsg });
};
onerror = function (event) {
  console.log('error form worker:' + event);
};