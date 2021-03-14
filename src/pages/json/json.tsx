import React from 'react'
import {classnames} from '@biqi/ui/lib/util'
import MyWorker from '../../js/parser.worker.js'
import {Item} from './item'
import styles from './json.less'

// const {classNames: classnames} = Util

type ICommonComponent = {
  label: string
  value: string
}

export interface JsonProps {}
export interface JsonState {
  jsonDataStr: string
  onAa: boolean
  onDelTree: boolean
  onValue: boolean
  progressSucc: boolean
  progressRate: boolean
  msgStrInvalid: boolean
  msgStr: string
  resultValue: string
  searchInput: string
  showResult: boolean
  resultList: any[]
  propertyName: string
}
export class Json extends React.Component<JsonProps, JsonState> {
  fastParseWorker: Worker
  beginTime: number
  /**
   * 成功转化JSON后的json对象
   *
   * @type {(object | null)}
   * @memberof Json
   */
  objAim: object | null
  shiftIsDown: boolean
  isFormating: boolean
  timeFlag: number
  aimId: number
  /**
   * 按值搜索JSON树
   *
   * @type {boolean}
   * @memberof Json
   */
  isByValue: boolean
  objStr: string
  resultRef: HTMLUListElement | null
  searchRef: HTMLInputElement | null
  resultActiveIndex: number
  constructor(props: JsonProps) {
    super(props)
    this.state = {
      jsonDataStr: '',
      onAa: false,
      onDelTree: false,
      onValue: false,
      progressSucc: false,
      progressRate: false,
      msgStrInvalid: false,
      msgStr: '字符串不合法',
      resultValue: '',
      searchInput: '',
      showResult: false,
      resultList: [],
      propertyName: ''
    }
    this.fastParseWorker = new MyWorker()
    this.beginTime = 0
    this.objAim = null
    this.shiftIsDown = false
    this.isFormating = false
    this.timeFlag = 0
    this.aimId = 0
    this.isByValue = false
    this.objStr = ''
    this.resultRef = null
    this.searchRef = null
    this.resultActiveIndex = -1

    this.fastParseWorker.onmessage = event => {
      console.log('json parse ' + (+new Date() - this.beginTime) + ' ms')
      switch (this.aimId) {
        case 0:
          this.onMsg(event)
          break
        case 1:
          this.onSelectMsg(event)
          break
        default:
          this.onMsg(event)
          break
      }
    }
    this.fastParseWorker.onerror = () => {
      this.aimId = 0
      this.setState({progressSucc: false, progressRate: false, msgStrInvalid: true})
      this.objAim = null
    }
  }

  onMsg(event: {data: {objAim: object; aimStr: string; errorMsg: string}}) {
    if (event.data !== null && event.data.objAim !== null) {
      this.objAim = event.data.objAim
      // this.isFormating = true;
      this.setState({jsonDataStr: event.data.aimStr, msgStrInvalid: false, progressRate: false, progressSucc: true})
      // this.isFormating = false;
    } else {
      this.setState({progressRate: false, progressSucc: false, msgStr: '字符串不合法&nbsp;:&nbsp;' + (event.data.errorMsg || '未知的异常'), msgStrInvalid: true})
      this.objAim = null
    }
  }

  onSelectMsg(event: {data: {objAim: object; aimStr: string; errorMsg: string}}) {
    this.aimId = 0
    if (event.data !== null && event.data.objAim !== null) {
      this.setState({resultValue: event.data.aimStr})
    } else {
      alert('error!!!')
    }
  }

  onJsonDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.currentTarget.value
    console.log(this.isFormating, val)
    if (!this.isFormating && val) {
      this.beginTime = +new Date()
      this.objStr = val.trim()
      if (this.objStr.length === 0) {
        return
      }
      this.fastParseWorker.postMessage(this.objStr)
      this.setState({jsonDataStr: this.objStr, progressRate: true, msgStrInvalid: false, progressSucc: false})
    } else {
      this.setState({jsonDataStr: val})
    }
  }

  // $(document).on('click', function (e) {
  //   if (e.target.className.search('searchTxt') === -1) {
  //     _this.$resultList.hide();
  //   }
  // });

  onResultItemClick = (data: ICommonComponent) => {
    this.setState({propertyName: data.label, resultValue: data.value, searchInput: '', showResult: false, resultList: []})
  }

  renderResultList = () => {
    const {resultList} = this.state
    return resultList.map((item: ICommonComponent, index: number) => (
      <Item<ICommonComponent> key={index} className={styles.searchItem} data={item} onItemClick={this.onResultItemClick}>
        <span className="long-content">
          <b className="redword">{item.label}</b>
        </span>
        <span className="shot-content blue_color" data-color="blue">
          |[Number]:{item.value}
        </span>
      </Item>
    ))
  }

  onSearchFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (this.state.resultList.length > 0) {
      this.setState({showResult: true})
    }
  }

  onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value
    console.log(e.currentTarget.value)
    this.setState({searchInput: val, showResult: val !== ''})
  }

  onSearchKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 16) {
      this.shiftIsDown = true
    }
    if (!this.isByValue) {
      /* 删除 数字 字母 下划线 */
      if (e.keyCode === 8 || (e.keyCode >= 65 && e.keyCode <= 90)) {
        ;('')
      } else if (e.keyCode >= 48 && e.keyCode <= 57 && !this.shiftIsDown) {
        /* 只能输入数字，不能输入数字上面的符号，尤其不能输入$ */
        ;('')
      } else if (e.keyCode === 189 && this.shiftIsDown) {
        /* -_ : 189 ,单独触发_ ,不允许- */
        ;('')
      } else if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        /* 37：左，38：上，39：右，40：下 */
        ;('')
      } else {
        e.preventDefault()
        return
      }
    }
  }

  onSearchKeyup = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 去判断shift
    if (e.keyCode === 16) {
      /* shift ：左右都是16 */
      this.shiftIsDown = false
    }
    if ([38, 40].indexOf(e.keyCode) > -1) {
      // 上下 尝试去弹层上
      if (this.state.resultList.length <= 0) {
        return
      }
      this.resultRef?.focus()
      this.bindWinEvent<HTMLInputElement>(e)
      return
    }
    if ([37, 39].indexOf(e.keyCode) > -1) {
      // 左右 不执行搜索
      return
    }
    const val = this.state.searchInput
    clearTimeout(this.timeFlag)
    this.timeFlag = window.setTimeout(() => {
      console.log('searching!!!', val, e.currentTarget.value)
      this.execCreateWin(val)
    }, 300)
  }

  onSearchBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // this.$searchTxt.off("keydown").off("keyup");
    // 解绑事件。。。。
  }

  resultRefHandler = (ref: HTMLUListElement | null) => (this.resultRef = ref)
  searchRefHandler = (ref: HTMLInputElement | null) => (this.searchRef = ref)

  // onResultAreaClick = (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
  //   e.preventDefault();
  //   console.log(e.target);
  //   // this.execSelect();
  //   return false;
  // }

  /* 弹层出现，页面禁止滚动 */
  onResultAreaFocus = (e: React.FocusEvent<HTMLUListElement>) => {
    // document.styleSheets
    // $('body').css('overflow', 'hidden');
  }

  /* 弹层出现，页面禁止滚动 */
  onResultAreaBlur = (e: React.FocusEvent<HTMLUListElement>) => {
    // $('body').css('overflow', 'auto');
  }

  onResultKeyUp = (e: React.KeyboardEvent<HTMLUListElement>) => {
    this.bindWinEvent<HTMLUListElement>(e)
  }

  /* 大小写是否敏感 */
  onAaClick = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    const {onValue, onAa, searchInput} = this.state
    if (onValue) {
      return
    }
    this.setState({onAa: !onAa})
    /*重置结果列表*/
    this.execCreateWin(searchInput)
  }

  /* 是否进行深度遍历 */
  onTreeClick = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    const {onDelTree, searchInput} = this.state
    this.setState({onDelTree: !onDelTree})
    /*重置结果列表*/
    this.execCreateWin(searchInput)
  }

  /* 是否按值搜索 */
  onValueClick = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    const {onValue, searchInput} = this.state
    this.isByValue = !onValue
    this.setState({onValue: !onValue, onAa: false, searchInput: onValue ? '' : searchInput})
    /*重置结果列表*/
    this.execCreateWin(searchInput)
  }

  /**
   * 绑定小浮层键盘的上下enter事件
   * @param  {[type]} e 事件对象
   * @return {[type]}   [description]
   */
  bindWinEvent<T>(e: React.KeyboardEvent<T>) {
    const {resultList} = this.state
    if (e.keyCode === 38 || e.keyCode === 40) {
      /* 上下键逻辑：如果结果弹层出现，捕捉键盘上下键，立即给使弹层获取焦点 */
      const hasOnCount = this.resultActiveIndex >= 0 ? 1 : 0
      if (e.keyCode === 40 && resultList.length > 0) {
        /* 按‘下’，如果列表没有选中的，则默认第一个选中，最后一个选中时，仍然按‘下’，不执行操作  */
        if (hasOnCount < 1) {
          this.resultActiveIndex = 0
        } else {
          this.resultActiveIndex += resultList.length - 1 === this.resultActiveIndex ? 0 : 1
        }
      } else if (e.keyCode === 38 && resultList.length > 0) {
        /* 按‘上’，如果列表是第一个选中时，按'上'，则关键词输入框获取焦点 */
        if (this.resultActiveIndex === 0) {
          this.searchRef?.focus()
        } else {
          this.resultActiveIndex -= 1
        }
      }
      e.preventDefault()
    } else if (e.keyCode === 13) {
      /* enter 键逻辑：执行选中的逻辑 */
      if (this.resultActiveIndex < 0) {
        return
      }
      this.execSelect()
    }
  }

  /**
   * 执行选择
   * @return {[type]} [description]
   */
  execSelect() {
    const {resultList} = this.state
    var _this = this,
      propertyName = '',
      className = '',
      clearClassName = '',
      value = '',
      cacheValue = null
    propertyName = resultList[this.resultActiveIndex]['data-property']

    var getValue = function (obj: object, propertyName: string) {
      var val = '',
        pNameArray = propertyName.split('.'),
        num = pNameArray.length
      if (num > 1) {
        val = getValue((obj as any)[(pNameArray.shift() || '').replace(/@@/g, '.')], pNameArray.join('.'))
      } else {
        val = _this.isByValue
          ? obj //[propertyName.replace(/@@/g, '.').replace(/(.*)\..*/, '$1')]
          : (obj as any)[propertyName.replace(/@@/g, '.')]
      }
      return val
    }
    className = resultList[this.resultActiveIndex]['data-color']
    cacheValue = getValue(this.objAim || {}, propertyName)
    value = JSON.stringify(cacheValue)
    // clearClassName = _this.$printPropertyValue[0].className.match(/\w+\_color/g) || [""];
    this.setState({propertyName: propertyName.replace(/@@/g, '.'), showResult: false, resultList: [], searchInput: ''})
    // _this.$printPropertyValue.removeClass(clearClassName[0]).addClass(className + "_color");
    // this.winActive = false;
    // ---
    if (toString.call(cacheValue) === '[object Array]' || toString.call(cacheValue) === '[object Object]') {
      _this.beginTime = +new Date()
      _this.aimId = 1
      _this.fastParseWorker.postMessage(value)
    } else {
      this.setState({resultValue: value})
    }
  }

  /**
   * 创建搜索结果窗口
   * @param  {String} val 检索关键词
   * @return {void}     void
   */
  execCreateWin(val: string) {
    // this.setState({resultList: []});
    if (this.objAim === null || val === '') {
      return this.setState({showResult: false, resultList: []})
    }
    var time = +new Date()
    // 这里开个挂(\.)点作为一个全匹配,偷偷保留
    // 注意： - 必须用\-转义， 因为 - 会导致成为区间选择而包含.等字符
    // 而且， - 位置不能乱放，如/[:-"]/g.test('.') 是非法正则： Uncaught SyntaxError: Invalid regular expression: /[:-"]/: Range out of order in character class
    // _ 下划线可作为搜索属性
    if (!this.isByValue && /[-!@#$%^&*()+=|<>?,/\[\]\\;':"\/]/g.test(val)) {
      return this.setState({showResult: false, resultList: []})
    }
    this.isByValue ? this.mapValue(this.objAim, val) : this.mapKey(this.objAim, val)
    if (this.state.resultList.length > 0) {
      setTimeout(() => {
        this.setState({showResult: true})
        console.log('search time:' + (+new Date() - time) + ' ms')
      }, 0)
    } else {
      this.setState({showResult: false})
    }
  }

  /**
   * 返回不区分大小写，匹配到的字符结果
   * @param  {[type]} str    待处理字符串
   * @param  {[type]} regStr 规则字符串
   * @return {[type]}        处理结果
   */
  loopStr(str: string, regStr: string) {
    var indexNum = str.toLowerCase().search(new RegExp(regStr, 'i')),
      tempKeywords = '<b class="redword">{#name}</b>',
      strAim = ''
    if (indexNum > -1) {
      strAim += str.substring(0, indexNum)
      strAim += tempKeywords.replace(/\{\#name\}/g, str.substr(indexNum, regStr.length))
      strAim += this.loopStr(str.substring(indexNum + regStr.length), regStr)
    } else {
      strAim += str
    }
    return strAim
  }

  /**
   * 获取属性值的dom
   * @return {[type]}     [description]
   */
  getPropertyValueDom(propertyValue: string, elasticClassName: string, formatValue?: string) {
    var elementSpan = {className: '', textContent: '', innerHTML: ''},
      type = toString.call(propertyValue).replace(/\[object\s(\w+)\]/, '$1'),
      value = propertyValue,
      className = 'black'
    switch (type) {
      case 'String':
        value = '"' + value + '"'
      case 'RegExp':
        className = 'red'
        break
      case 'Number':
        className = 'blue'
        break
      case 'Boolean':
      case 'Function':
        className = 'purple'
        break
      case 'Object':
      case 'Array':
      case 'Date':
      case 'Event':
        className = 'black'
        break
      case 'Undefined':
      case 'Null':
        className = 'gray'
        break
      default:
        className = 'black'
        break
    }

    switch (type) {
      case 'Object':
      case 'Array':
        value = JSON.stringify(value)
        break
      case 'Undefined':
      case 'Null':
        value = propertyValue + ''
      default:
        value += ''
        break
    }
    const a = classnames
    elementSpan.className = classnames(elasticClassName, styles[className + '_color'])
    // elementSpan.setAttribute('data-color', className)
    if (!formatValue) {
      elementSpan.textContent = '|[' + type + ']:' + value
    } else {
      elementSpan.innerHTML = '|[' + type + ']:' + formatValue
    }
    return elementSpan
  }

  /**
   * 获取对象名
   * @param  {[type]} paramParentObj 目标对象
   * @param  {[type]} paramKeywords 属性名字符串
   * @param  {[type]} paramParentName 累计父属性名
   * @return {[type]}                dom字符串
   */
  mapKey(paramParentObj: object, paramKeywords: string, paramParentName?: string) {
    const {onAa, onDelTree, resultList} = this.state
    const list = []
    var tempKeywords = '<b class="redword">{#name}</b>',
      lowerOrUpper,
      isUpper = onAa,
      isDeep = !onDelTree,
      dataProperty = ''
    paramParentName = typeof paramParentName === 'undefined' ? '' : paramParentName + '.'
    lowerOrUpper = isUpper ? new RegExp(paramKeywords, 'i') : new RegExp(paramKeywords)
    const cache = {}
    /* 左序遍历树 */
    for (var item in paramParentObj) {
      dataProperty = paramParentName + item.replace(/\./g, '@@')
      if (!paramParentObj.hasOwnProperty(item)) {
        continue
      } /* 主要用于清理对Array原型扩展的属性,导致for-in遍历出多余结果集bug,当然对其他类型也有效 */
      if (item.search(lowerOrUpper) > -1) {
        let innerHTML = ''
        if (isUpper) {
          innerHTML = this.loopStr(paramParentName.replace(/@@/g, '.'), paramKeywords) + this.loopStr(item, paramKeywords)
        } else {
          innerHTML = paramParentName.replace(/@@/g, '.').replace(new RegExp(paramKeywords, 'g'), tempKeywords.replace(/\{\#name\}/g, paramKeywords)) + item.replace(new RegExp(paramKeywords, 'g'), tempKeywords.replace(/\{\#name\}/g, paramKeywords))
        }
        const secondEle = this.getPropertyValueDom((paramParentObj as any)[item], styles['shot-content'])
        Object.assign(cache, {'data-property': dataProperty, className: styles['long-content'], innerHTML, second: secondEle})
        list.push(cache)
        // list.push({value: (paramParentObj as any)[item], label: item});
      }
      const val = (paramParentObj as any)[item]
      if (isDeep && typeof val === 'object' && val !== null && (val.constructor.name === 'Object' || (val.constructor.name === 'Array' && val.length > 0))) {
        this.mapKey(val, paramKeywords, dataProperty)
      } else {
        list.push({value: (paramParentObj as any)[item], label: item})
      }
    }

    this.setState({resultList: list, showResult: true})
  }

  mapValue(paramParentObj: object, paramKeywords: string, paramParentName?: string) {
    const {onDelTree} = this.state
    var _this = this,
      loopResultStr = this.state.resultList[0],
      isDeep = onDelTree ? false : true,
      cacheValue = null,
      cacheType = '',
      keywordsIsString = /^"/.test(paramKeywords) || /"$/.test(paramKeywords),
      hasDoubleQuotes = /^"/.test(paramKeywords) && /"$/.test(paramKeywords),
      isOnlyDoubleQuotes = paramKeywords === '""',
      dataProperty = ''
    paramParentName = typeof paramParentName === 'undefined' ? '' : paramParentName + '.'
    /* 左序遍历树 */
    for (var item in paramParentObj) {
      cacheValue = (paramParentObj as any)[item]
      cacheType = toString.call(cacheValue)
      dataProperty = paramParentName + item.replace(/\./g, '@@')
      if (!paramParentObj.hasOwnProperty(item)) {
        continue
      } /* 主要用于清理对Array原型扩展的属性,导致for-in遍历出多余结果集bug,当然对其他类型也有效 */
      switch (cacheType) {
        case '[object String]':
          if (keywordsIsString) {
            if (cacheValue.indexOf(paramKeywords) > -1 || ('"' + cacheValue).indexOf(paramKeywords) > -1 || (cacheValue + '"').indexOf(paramKeywords) > -1 || (isOnlyDoubleQuotes && cacheValue === '') || (!isOnlyDoubleQuotes && hasDoubleQuotes && cacheValue === paramKeywords.replace(/^"|"$/g, ''))) {
              _this.buildSearchResultDom(dataProperty, '"' + cacheValue + '"', paramKeywords, loopResultStr)
            }
          } else {
            if ((cacheValue + '').indexOf(paramKeywords) > -1) {
              _this.buildSearchResultDom(dataProperty, '"' + cacheValue + '"', paramKeywords, loopResultStr)
            }
          }
          break
        case '[object Number]':
        case '[object Boolean]':
        case '[object Null]':
          if (!keywordsIsString && (cacheValue + '').indexOf(paramKeywords) > -1) {
            _this.buildSearchResultDom(dataProperty, cacheValue, paramKeywords, loopResultStr)
          }
          break
        default:
          break
      }

      if (isDeep && typeof cacheValue === 'object' && cacheValue !== null && (cacheValue.constructor.name === 'Object' || (cacheValue.constructor.name === 'Array' && cacheValue.length > 0))) {
        _this.mapValue(cacheValue, paramKeywords, dataProperty)
      }
    }
  }

  buildSearchResultDom(showKey: string, showValue: string, searchBoxValue: string, loopResultStr: string) {
    var tempKeywords = '<b class="redword">{#name}</b>'
    var regExp = null
    var elementLi = document.createElement('li')
    var elementSpan = document.createElement('span')
    var formatValue = ''
    try {
      regExp = new RegExp(searchBoxValue, 'g')
    } catch (e) {
      regExp = searchBoxValue
      this.setState({msgStr: '字符串不能转换为正则表达式&nbsp;:&nbsp;' + (e.data.errorMsg || '未知的异常'), msgStrInvalid: true})
    }
    if (typeof regExp === 'string') {
      return
    }
    formatValue = (showValue + '').replace(regExp, function ($1) {
      return tempKeywords.replace(/\{\#name\}/, $1)
    })

    // elementSpan.className = 'shot-content'
    // elementLi.setAttribute('data-property', showKey)
    // elementSpan.innerHTML = showKey.replace(/@@/g, '.')
    // elementLi.appendChild(elementSpan)
    // elementLi.appendChild(this.getPropertyValueDom(showValue, 'long-content', formatValue))
    // loopResultStr.appendChild(elementLi);
    return
  }

  render() {
    const {jsonDataStr, onAa, onDelTree, onValue, progressSucc, progressRate, msgStrInvalid, msgStr, resultValue, searchInput, showResult, propertyName} = this.state
    return (
      <section className={styles.content}>
        <div className={styles['left-area']}>
          <textarea
            value={jsonDataStr}
            onChange={this.onJsonDataChange}
            className={styles['area-text']}
            tabIndex={-1}
            placeholder="请输入合法的JSON，按tab键（失焦自动格式化），定位到搜索框，输入合法的属性名进行属性查找，Aa,Tree,Value是功能键；Aa: 如果输入的是字母，区分大小写，默认不区分；Tree: 深度查找JSON对象,默认深度查找；Value: 可按照属性值来进行查找，默认按照属性名；"></textarea>
        </div>
        <div className={styles['right-area']}>
          <div className={styles['parse-result']}>
            <span className={styles['rate-of-progress']} style={{display: progressRate ? 'unset' : 'none'}}>
              解析中...<i></i>
            </span>
            <span className={styles['progress-success']} style={{display: progressSucc ? 'unset' : 'none'}}>
              解析成功
            </span>
            <span className={styles['msg-error']} style={{display: msgStrInvalid ? 'unset' : 'none'}}>
              {msgStr}
            </span>
          </div>
          <div className={styles.txtSearchArea}>
            <input value={searchInput} ref={this.searchRefHandler} onChange={this.onSearchInputChange} onFocus={this.onSearchFocus} onBlur={this.onSearchBlur} onKeyDown={this.onSearchKeydown} onKeyUp={this.onSearchKeyup} type="search" placeholder="属性名/属性值" className={styles['search-txt']} />
            <ul ref={this.resultRefHandler} onFocus={this.onResultAreaFocus} onKeyUp={this.onResultKeyUp} className={styles['txt-result-list']} tabIndex={1} style={{display: showResult ? 'unset' : 'none'}}>
              {this.renderResultList()}
            </ul>
            <label onClick={this.onAaClick} className={classnames(styles['lab-tip'], {[styles.on]: onAa, [styles.disabled]: onValue})} title="是否区分大小写，默认否">{`Aa`}</label>
            <label onClick={this.onTreeClick} className={classnames(styles['lab-tip'], {[styles.del]: onDelTree})} title="是否进行深度遍历，默认是">{`Tree`}</label>
            <label onClick={this.onValueClick} className={classnames(styles['lab-tip'], {[styles.on]: onValue})} title="是否进行按值(boolean、string、number、null)搜索，默认否">{`Value`}</label>
          </div>
          <div className={styles.printObjTree}>
            <div className={styles['print-property-name']}>{propertyName}</div>
            <textarea defaultValue={resultValue} readOnly className={styles['print-property-value']}></textarea>
          </div>
        </div>
      </section>
    )
  }
}
