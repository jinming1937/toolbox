!(function ($) {
  if (typeof $ === 'undefined') { return; }
  //index.html
  /* -----------[对象属性查看 start]------------ */
  var scanObject = {
    /**
     * 对象字符串输入框
     * @type {[type]}
     */
    $txtObjectString: $(".txtObjectString"),
    /**
     * search result list window
     * @type {Dom}
     */
    $resultList: $('.txtResultList'),
    /**
     * search word
     * @type {String}
     */
    $searchTxt: $('.searchTxt'),
    /**
     * 选择结果
     * @type {Dom}
     */
    $printPropertyName: $(".printPropertyName"),
    $printPropertyValue: $(".printPropertyValue"),
    $progressRate: $(".progressRate"),
    $progressSucc: $(".progressSucc"),
    $msg_str: $('.msg_str'),
    $labCheckedAa: $('.lab-checked-Aa'),
    $labCheckedTree: $('.lab-checked-Tree'),
    $labCheckedValue: $('.lab-checked-Value'),
    /* shift键 */
    shiftIsDown: false,
    isFormating: false,
    timeFlag: 0,
    aimId: 0,
    isByValue: false,
    objStr: '',
    objAim: null,
    init: function () {
      var _this = this;
      _this.isByValue = this.$labCheckedValue.hasClass('on') ? true : false;
      _this.fastParseWorker = new Worker('./js/fastParse.js');
      _this.fastParseWorker.onmessage = function (event) {
        console.log("json parse " + (+new Date() - _this.beginTime) + ' ms');
        switch (_this.aimId) {
          case 0:
            _this.onMsg(event);
            break;
          case 1:
            _this.onSelectMsg(event);
            break;
          default:
            _this.onMsg(event);
            break;
        }
      };
      _this.fastParseWorker.onerror = function () {
        _this.aimId = 0;
        // console.log(event);
        _this.$progressSucc.hide();
        _this.$progressRate.hide();
        _this.$msg_str.show();
        _this.objAim = null;
      };
      _this.bindEvent();
    },
    onMsg: function (event) {
      var _this = this;
      if (event.data !== null && event.data.objAim !== null) {
        _this.objAim = event.data.objAim;
        _this.isFormating = true;
        _this.$txtObjectString.val(event.data.aimStr);
        _this.isFormating = false;
        _this.$msg_str.hide();
        _this.$progressRate.hide();
        _this.$progressSucc.show();
      } else {
        _this.$progressRate.hide();
        _this.$progressSucc.hide();
        _this.$msg_str.html("字符串不合法&nbsp;:&nbsp;" + (event.data.errorMsg || "未知的异常")).show();
        _this.objAim = null;
      }
    },
    onSelectMsg: function (event) {
      var _this = this;
      _this.aimId = 0;
      if (event.data !== null && event.data.objAim !== null) {
        _this.$printPropertyValue.val(event.data.aimStr);
      } else {
        alert('error!!!');
      }
    },
    bindEvent: function () {
      var _this = this;
      /* 字符串对象输入框 */
      _this.$txtObjectString.on('change', function () {
        if (!_this.isFormating) {
          _this.formatToObj();
        }
      });

      _this.$searchTxt.on("focus", function () {
        /* 关键字输入框 */
        _this.$searchTxt.on('keydown', function (e) {
          if (e.keyCode === 16) {
            _this.shiftIsDown = true;
          }
          if (!_this.isByValue) {
            /* 删除 数字 字母 下划线 */
            if (e.keyCode === 8 || (e.keyCode >= 65 && e.keyCode <= 90)) {
              "";
            } else if ((e.keyCode >= 48 && e.keyCode <= 57) && !_this.shiftIsDown) { /* 只能输入数字，不能输入数字上面的符号，尤其不能输入$ */
              "";
            } else if (e.keyCode === 189 && _this.shiftIsDown) { /* -_ : 189 ,单独触发_ ,不允许- */
              "";
            } else if (e.keyCode === 37 || e.keyCode === 39) { /* 左右 */
              "";
            } else {
              e.preventDefault();
              return;
            }
          }
        }).on("keyup", function (e) {
          // 去判断shift
          if (e.keyCode === 16) { /* shift ：左右都是16 */
            _this.shiftIsDown = false;
          }
          if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) { // 上下左右 不执行搜索
            return;
          }
          var val = $(this).val();
          clearTimeout(this.timeFlag);
          this.timeFlag = setTimeout(function () {
            _this.execCreateWin(val);
            console.log("searching!!!");
          }, 300);
        });
      }).on("blur", function () {
        _this.$searchTxt.off("keydown").off("keyup");
      });

      /* 结果弹窗鼠标事件 */
      _this.$resultList.on('click', 'li', function (e) {
        e.preventDefault();
        _this.execSelect();
        return false;
      });

      /* 鼠标移动 */
      _this.$resultList.on('mousemove', 'li', function (e) {
        e.preventDefault();
        $(this).siblings('li').removeClass('on');
        $(this).addClass("on");
        return false;
      });

      /* 弹层出现，页面禁止滚动 */
      _this.$resultList.on('focus', function () {
        $('body').css('overflow', 'hidden');
      }).on('blur', function () {
        $('body').css('overflow', 'auto');
      });

      /* 大小写是否敏感 */
      _this.$labCheckedAa.on('click', function () {
        if ($(this).hasClass('disabled')) {
          return;
        }
        if ($(this).hasClass('on')) {
          $(this).removeClass('on');
        } else {
          $(this).addClass('on');
        }
        /*重置结果列表*/
        _this.execCreateWin(_this.$searchTxt.val());
      });

      /* 是否进行深度遍历 */
      _this.$labCheckedTree.on('click', function () {
        if ($(this).hasClass('del')) {
          $(this).removeClass('del');
        } else {
          $(this).addClass('del');
        }
        /*重置结果列表*/
        _this.execCreateWin(_this.$searchTxt.val());
      });
      /* 是否按值搜索 */
      _this.$labCheckedValue.on('click', function () {
        if ($(this).hasClass('on')) {
          $(this).removeClass('on');
          _this.$labCheckedAa.removeClass('disabled');
          _this.isByValue = false;
        } else {
          _this.$labCheckedAa.addClass('disabled');
          _this.isByValue = true;
          $(this).addClass('on');
        }
        /*重置结果列表*/
        _this.execCreateWin(_this.$searchTxt.val());
      });
    },
    /**
     * 绑定小浮层键盘的上下enter事件
     * @param  {[type]} e 事件对象
     * @return {[type]}   [description]
     */
    bindWinEvent: function (e) {
      var _this = this;
      if (_this.$resultList.children().length <= 0) { return; }
      if (e.keyCode === 38 || e.keyCode === 40) { /* 上下键逻辑：如果结果弹层出现，捕捉键盘上下键，立即给使弹层获取焦点 */
        _this.$resultList[0].focus();
        var hasOnCount = _this.$resultList.find('li.on').length;
        if (e.keyCode === 40 && _this.$resultList.html().length > 0) { /* 按‘下’，如果列表没有选中的，则默认第一个选中，最后一个选中时，仍然按‘下’，不执行操作  */
          if (hasOnCount < 1) {
            _this.$resultList.children().first().addClass('on');
          } else {
            _this.$resultList.find('.on').next('li').length > 0 ? _this.$resultList.find('.on').removeClass('on').next('li').addClass('on') : "";
          }
        } else if (e.keyCode === 38 && _this.$resultList.html().length > 0) { /* 按‘上’，如果列表是第一个选中时，按'上'，则关键词输入框获取焦点 */
          if (_this.$resultList.find('.on').prev('li').length > 0) {
            _this.$resultList.find('.on').removeClass('on').prev('li').addClass('on');
          } else {
            _this.$resultList.find('.on').removeClass('on');
            _this.$searchTxt[0].focus();
          }
        }
        e.preventDefault();
      } else if (e.keyCode === 13) { /* enter 键逻辑：执行选中的逻辑 */
        if (_this.$resultList.find('li.on').length <= 0) {
          return;
        }
        _this.execSelect();
      }
    },
    /**
     * 执行选择
     * @return {[type]} [description]
     */
    execSelect: function () {
      var _this = this,
        propertyName = '',
        className = '',
        clearClassName = '',
        value = '',
        cacheValue = null;
      propertyName = _this.$resultList.find('li.on').attr('data-property');
      var getValue = function (obj, propertyName) {
        var val = '',
          pNameArray = propertyName.split('.'),
          num = pNameArray.length;
        if (num > 1) {
          val = getValue(obj[pNameArray.shift()], pNameArray.join('.'));
        } else {
          val = obj[propertyName];
        }
        return val;
      };
      className = _this.$resultList.find('li.on')[0].lastElementChild.getAttribute("data-color");
      cacheValue = getValue(_this.objAim, propertyName)
      value = JSON.stringify(cacheValue);
      clearClassName = _this.$printPropertyValue[0].className.match(/\w+\_color/g) || [""];
      _this.$printPropertyName.html(propertyName); //('&gt;&nbsp;' + propertyName);
      _this.$printPropertyValue.removeClass(clearClassName[0]).addClass(className + "_color");
      _this.$resultList.hide().html('');
      _this.$searchTxt.val('');
      _this.winActive = false;
      // ---
      if (toString.call(cacheValue) === '[object Array]' || toString.call(cacheValue) === '[object Object]') {
        _this.beginTime = +new Date();
        _this.aimId = 1;
        _this.fastParseWorker.postMessage(value);
      } else {
        _this.$printPropertyValue.val(value);
      }
    },
    /**
     * json parse string
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    formatToObj: function () {
      var _this = this;
      _this.beginTime = +new Date();
      _this.objStr = _this.$txtObjectString.val().trim();
      if (_this.objStr.length === 0) {
        return;
      }
      _this.fastParseWorker.postMessage(_this.objStr);
      _this.$progressRate.show();
      _this.$msg_str.hide();
      _this.$progressSucc.hide();
    },
    /**
     * 创建搜索结果窗口
     * @param  {String} val 检索关键词
     * @return {void}     void
     */
    execCreateWin: function (val) {
      var _this = this;
      if (_this.objAim === null || val === '') {
        return;
      }
      var time = +new Date();
      // 这里开个挂(\.)点作为一个全匹配,偷偷保留
      // 注意： - 必须用\-转义， 因为 - 会导致成为区间选择而包含.等字符
      // 而且， - 位置不能乱放，如/[:-"]/g.test('.') 是非法正则： Uncaught SyntaxError: Invalid regular expression: /[:-"]/: Range out of order in character class
      if (!this.isByValue && /[-!@#$%^&*()_+=|<>?,/\[\]\\;':"\/]/g.test(val)) {
        return;
      }
      _this.$resultList.html("");
      this.isByValue ?
        _this.mapValue(_this.objAim, val)
        :
        _this.mapKey(_this.objAim, val);
      if (_this.$resultList.children().length > 0) {
        setTimeout(function () {
          _this.$resultList.show();
          console.log("search time:" + (+new Date() - time) + " ms");
        }, 0);
      } else {
        _this.$resultList.hide();
      }
    },
    /**
     * 返回不区分大小写，匹配到的字符结果
     * @param  {[type]} str    待处理字符串
     * @param  {[type]} regStr 规则字符串
     * @return {[type]}        处理结果
     */
    loopStr: function (str, regStr) {
      var _this = this,
        indexNum = str.toLowerCase().search(new RegExp(regStr, 'i')),
        tempKeywords = '<b class="redword">{#name}</b>',
        strAim = '';
      if (indexNum > -1) {
        strAim += str.substring(0, indexNum);
        strAim += tempKeywords.replace(/\{\#name\}/g, str.substr(indexNum, regStr.length));
        strAim += _this.loopStr(str.substring(indexNum + regStr.length), regStr);
      } else {
        strAim += str;
      }
      return strAim;
    },
    /**
     * 获取属性值的dom
     * @return {[type]}     [description]
     */
    getPropertyValueDom: function (propertyValue, elasticClassName) {
      var elementSpan = document.createElement("span"),
        type = toString.call(propertyValue).replace(/\[object\s(\w+)\]/, '$1'),
        value = propertyValue,
        className = 'black';
      switch (type) {
        case 'String':
        case 'RegExp':
          className = 'red';
          break;
        case 'Number':
          className = 'blue';
          break;
        case 'Boolean':
        case 'Function':
          className = 'purple';
          break;
        case 'Object':
        case 'Array':
        case 'Date':
        case 'Event':
          className = 'black';
          break;
        case 'Undefined':
        case 'Null':
          className = 'gray';
          break;
        default:
          className = 'black';
          break;
      }

      switch (type) {
        case 'Object':
        case 'Array':
          value = JSON.stringify(value);
          break;
        case 'Undefined':
        case 'Null':
          value = propertyValue + '';
        default:
          value += '';
          break;
      }

      elementSpan.className = elasticClassName + " " + className + "_color";
      elementSpan.setAttribute('data-color', className);
      elementSpan.textContent = "|[" + type + "]:" + value;
      return elementSpan;
    },
    /**
     * 获取对象名
     * @param  {[type]} paramParentObj 对象
     * @param  {[type]} paramKeywords 属性名字符串
     * @param  {[type]} paramParentName 累计父属性名
     * @return {[type]}                dom字符串
     */
    mapKey: function (paramParentObj, paramKeywords, paramParentName) {
      var _this = this,
        tempKeywords = '<b class="redword">{#name}</b>',
        loopResultStr = _this.$resultList[0],
        lowerOrUpper,
        isUpper = _this.$labCheckedAa.hasClass('on') ? false : true,
        isDeep = _this.$labCheckedTree.hasClass('del') ? false : true;
      paramParentName = typeof paramParentName === 'undefined' ? '' : paramParentName + '.';
      lowerOrUpper = isUpper ? new RegExp(paramKeywords, 'i') : new RegExp(paramKeywords);

      /* 左序遍历树 */
      for (var item in paramParentObj) {
        if (!paramParentObj.hasOwnProperty(item)) { continue; } /* 主要用于清理对Array原型扩展的属性,导致for-in遍历出多余结果集bug,当然对其他类型也有效 */
        if (item.search(lowerOrUpper) > -1) {
          var elementLi = document.createElement("li");
          var elementSpan = document.createElement("span");
          elementSpan.className = "long-content";
          elementLi.setAttribute("data-property", paramParentName + item);
          if (isUpper) {
            elementSpan.innerHTML = _this.loopStr(paramParentName, paramKeywords) + _this.loopStr(item, paramKeywords);
            elementLi.appendChild(elementSpan);
          } else {
            elementSpan.innerHTML = paramParentName.replace(new RegExp(paramKeywords, 'g'), tempKeywords.replace(/\{\#name\}/g, paramKeywords)) +
              item.replace(new RegExp(paramKeywords, 'g'), tempKeywords.replace(/\{\#name\}/g, paramKeywords));
            elementLi.appendChild(elementSpan);
          }
          elementLi.appendChild(_this.getPropertyValueDom(paramParentObj[item], 'shot-content'));
          loopResultStr.appendChild(elementLi);
        }
        if (isDeep &&
          typeof paramParentObj[item] === 'object' &&
          paramParentObj[item] !== null &&
          (
            paramParentObj[item].constructor.name === 'Object' ||
            paramParentObj[item].constructor.name === 'Array' &&
            paramParentObj[item].length > 0
          )
        ) {
          _this.mapKey(paramParentObj[item], paramKeywords, paramParentName + item);
        }
      }
    },
    mapValue: function (paramParentObj, paramKeywords, paramParentName) {
      var _this = this,
        tempKeywords = '<b class="redword">{#name}</b>',
        loopResultStr = _this.$resultList[0],
        lowerOrUpper,
        regexp = new RegExp(paramKeywords, 'g'),
        isUpper = _this.$labCheckedAa.hasClass('on') ? false : true,
        isDeep = _this.$labCheckedTree.hasClass('del') ? false : true,
        cacheValue = null,
        cacheType = '',
        keywordsIsString = /^"/.test(paramKeywords) || /"$/.test(paramKeywords),
        hasDoubleQuotes = /^".*"$/.test(paramKeywords),
        isOnlyDoubleQuotes = paramKeywords === '""';
      paramParentName = typeof paramParentName === 'undefined' ? '' : paramParentName + '.';
      lowerOrUpper = isUpper ? new RegExp(paramKeywords, 'i') : new RegExp(paramKeywords);
      /* 左序遍历树 */
      for (var item in paramParentObj) {
        cacheValue = paramParentObj[item];
        cacheType = toString.call(cacheValue);
        if (!paramParentObj.hasOwnProperty(item)) { continue; } /* 主要用于清理对Array原型扩展的属性,导致for-in遍历出多余结果集bug,当然对其他类型也有效 */
        switch (cacheType) {
          case '[object String]':
            if (keywordsIsString) {
              if (cacheValue.search(paramKeywords) > -1 ||
                cacheValue.search(paramKeywords.replace(/^"/, '')) > -1 ||
                cacheValue.search(paramKeywords.replace(/"$/, '')) > -1 ||
                (hasDoubleQuotes && cacheValue.search(paramKeywords.replace(/^"/, '').replace(/"$/, '')) > -1) ||
                (isOnlyDoubleQuotes && cacheValue === '')) {
                _this.buildSearchResultDom(paramParentName + item, paramParentObj[item], loopResultStr);
              }
              break;
            }
          case '[object Number]':
          case '[object Boolean]':
          case '[object Null]':
            if ((cacheValue + '').search(paramKeywords) > -1) {
              _this.buildSearchResultDom(paramParentName + item, paramParentObj[item], loopResultStr);
            }
            break;
          default:
            break;
        }

        if (isDeep &&
          typeof paramParentObj[item] === 'object' &&
          paramParentObj[item] !== null &&
          (
            paramParentObj[item].constructor.name === 'Object' ||
            paramParentObj[item].constructor.name === 'Array' &&
            paramParentObj[item].length > 0
          )
        ) {
          _this.mapValue(paramParentObj[item], paramKeywords, paramParentName + item);
        }
      }
    },
    buildSearchResultDom: function (showKey, showValue, loopResultStr) {
      var _this = this;
      var elementLi = document.createElement("li");
      var elementSpan = document.createElement("span");
      elementSpan.className = "shot-content";
      elementLi.setAttribute("data-property", showKey);
      elementSpan.innerHTML = showKey;
      elementLi.appendChild(elementSpan);
      elementLi.appendChild(_this.getPropertyValueDom(showValue, 'long-content'));
      loopResultStr.appendChild(elementLi);
    }
  };
  /* -----------[对象属性查看 end]------------ */

  /* 代码执行 */
  (function () {
    scanObject.init();
    /* keypress 只有在可打印字符的时候才会触发，上、下、enter不属于这个场景，所以只需要绑定keyup即可 */
    window.addEventListener('keyup', function (e) {
      // if(e.keyCode === 16){ /* shift ：左右都是16 */
      //     e.preventDefault();
      //     scanObject.shiftIsDown = false;
      //     return;
      // }
      scanObject.bindWinEvent(e);
      e.preventDefault(e);
    });
  }());
}(window.$ || undefined));