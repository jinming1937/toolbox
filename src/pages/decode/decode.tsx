import React, {useState, useCallback, useRef} from 'react'
import styles from './styles.less'

export type IDecode = {}
let times = 0

function fn(valu: string) {
  times++
  valu = window.decodeURIComponent(valu)
  times > 2 ? '' : fn(valu)
  return valu
}

export const Decode = (props: IDecode) => {
  const [isBlurClear, setIsBlurClear] = useState(true)
  const [isFormat, setIsFormat] = useState(true)
  const [urlValue, setUrlValue] = useState('')
  const [resultValue, setResultValue] = useState('')
  const [params, setParams] = useState(0)
  const [length, setLength] = useState(0)
  const [protocol, setProtocol] = useState('')
  const [domain, setDomain] = useState('')
  const originRef = useRef<null | HTMLTextAreaElement>(null)

  const onUrlTextAreaPaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      setTimeout(() => {
        const val = originRef.current !== null ? originRef.current.value : ''
        setParams((val.match(/[\=]/) || []).length)
        setLength(val.length)
        setProtocol((val.match(/^http(s)?/) || ['未识别'])[0])
        setDomain(val.replace(/^(http[s]?:\/\/)?([a-z0-9]+(?:\.[a-z0-9]+)*)(.)*/i, '$2') || '')
        const resultV = fn(isFormat ? val.replace(/(\?(?!\?)|\&|\#)/g, '\n$1\n') : val)
        setResultValue(resultV || val)
      }, 0)
    },
    [urlValue]
  )

  const onUrlTextAreaBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (isBlurClear) setUrlValue('')
    },
    [isBlurClear]
  )

  const onClearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsBlurClear(e.currentTarget.checked)
    },
    [isBlurClear]
  )

  const onFormatChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsFormat(e.currentTarget.checked)
    },
    [isFormat]
  )

  const onUrlTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUrlValue(e.currentTarget.value)
    },
    [urlValue]
  )

  return (
    <main className={styles['main-box']}>
      <section className={styles['context']}>
        <div className={styles['textarea-face']}>
          <textarea ref={originRef} value={urlValue} cols={30} rows={10} onPaste={onUrlTextAreaPaste} onBlur={onUrlTextAreaBlur} onChange={onUrlTextAreaChange} className={styles['parse-url-area']} placeholder="把想要decode的链接粘贴至此"></textarea>
        </div>
        <div>
          <label className={styles['tool-lab']} htmlFor="isClear_cbx">
            失焦清空：
          </label>
          <input className={styles['tool-cbx']} type="checkbox" id="isClear_cbx" checked={isBlurClear} onChange={onClearChange} />
          <label className={styles['tool-lab']} htmlFor="isAutoChangeLine_cbx">
            参数换行：
          </label>
          <input className={styles['tool-cbx']} type="checkbox" id="isAutoChangeLine_cbx" checked={isFormat} onChange={onFormatChange} />
        </div>
      </section>
      <section className={styles['param-plugs']}>
        <section className={styles['using']}>
          <textarea defaultValue={resultValue} readOnly className={styles['param-to-json']} placeholder="转换成对象（未实现）"></textarea>
        </section>
        <section className={styles['count']}>
          <ul className={styles['param-data']}>
            <li>
              <span className={styles['data-name']}>参数个数:</span>
              <span className={styles['data-value']}>{params}</span>
            </li>
            <li>
              <span className={styles['data-name']}>字符个数:</span>
              <span className={styles['data-value']}>{length}</span>
            </li>
            <li>
              <span className={styles['data-name']}>协议:</span>
              <span className={styles['data-value']}>{protocol}</span>
            </li>
            <li>
              <span className={styles['data-name']}>域名:</span>
              <span className={styles['data-value']}>{domain}</span>
            </li>
          </ul>
        </section>
      </section>
    </main>
  )
}
