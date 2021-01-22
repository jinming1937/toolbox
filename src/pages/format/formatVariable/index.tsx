import React, {ChangeEvent, ClipboardEvent, FocusEvent, useState, useCallback, useRef, CSSProperties} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {Input} from '@biqi/ui'
import styles from './styles.less'

const lowerToUpper: any = {}
const upperToLower: any = {}
const lower = 'abcdefghijklmnopqrstuvwxyz'
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

lower.split('').forEach((chart, index) => {
  lowerToUpper[chart] = upper[index]
  upperToLower[upper[index]] = chart
})

type IFormatVariable = {
  title?: string
  isCamelToPascal?: boolean
  style?: CSSProperties
}

export const FormatVariable = (props: IFormatVariable) => {
  const {title = '转换', isCamelToPascal = false, style = {}} = props
  const [leaveClear, setLeaveClear] = useState(true)
  const [originValue, setOriginValue] = useState('')
  const [formatedValue, setFormatedValue] = useState('')
  const [lineType, setLineType] = useState('_')
  const [copyState, setCopyState] = useState(false)
  const originRef = useRef<null | HTMLInputElement>(null)

  const onClearControlChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setLeaveClear(e.currentTarget.checked)
      setOriginValue('')
    },
    [leaveClear, originValue]
  )

  const onLineTypeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setLineType(e.currentTarget.value)
    },
    [lineType]
  )

  // const onOriginValueChange = useCallback(
  //   (e: string) => {
  //     setOriginValue(e)
  //   },
  //   [originValue]
  // )
  const onOriginValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOriginValue(e.currentTarget.value)
    },
    [originValue]
  )

  const onOriginValuePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      setTimeout(() => {
        const val = originRef.current !== null ? originRef.current.value : ''
        console.log(val, originValue, e.persist())
        let newStr = ''
        if (isCamelToPascal) {
          newStr = val
            .replace(/^([A-Z])/, (target, wanted) => {
              console.log(wanted)
              return upperToLower[wanted] || wanted
            })
            .replace(/([A-Z])/g, (target, wanted) => {
              return lineType + (upperToLower[wanted] || wanted)
            })
        } else {
          newStr = val.replace(/[-_]([a-z])/g, (target, wanted) => {
            return lowerToUpper[wanted] || wanted
          })
        }
        setOriginValue(val)
        setFormatedValue(newStr)
      }, 0)
    },
    [originValue, lineType, isCamelToPascal]
  )

  const onOriginValueBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setOriginValue('')
    },
    [originValue]
  )

  const onCopyClick = useCallback(() => {
    console.log('copying...')
  }, [])

  const handleCopy = useCallback(
    (text: string, result: boolean) => {
      setCopyState(result)
      console.log('copyed', text, result)
    },
    [copyState]
  )

  return (
    <div className={styles.formatVariable} style={style}>
      <h4>{title}</h4>
      <div className={styles.clearBox}>
        <label htmlFor="cbxNeedClear">
          是否在离开（失焦）时擦除 <input type="checkbox" checked={leaveClear} onChange={onClearControlChange} />
        </label>
      </div>
      {isCamelToPascal ? (
        <div className={styles.flexBox}>
          <div className={styles.label}>分隔符:</div>
          <div className={styles.container}>
            <select className={styles.inputSelect} value={lineType} onChange={onLineTypeChange}>
              <option value="_">下划线 _</option>
              <option value="-">中划线 -</option>
            </select>
          </div>
        </div>
      ) : null}
      <div className={styles.flexBox}>
        <div className={styles.label}>原标识符:</div>
        <div className={styles.container}>
          <input value={originValue} ref={originRef} onChange={onOriginValueChange} onPaste={onOriginValuePaste} onBlur={onOriginValueBlur} type="text" className={styles.inputText} placeholder="粘贴到此次处" />
          <input defaultValue={originValue} type="text" className={styles.inputText} disabled placeholder="备份回看" />
        </div>
      </div>
      <div className={styles.flexBox}>
        <div className={styles.label}>新标识符:</div>
        <div className={styles.container}>
          <input defaultValue={formatedValue} type="text" className={styles.inputText} placeholder="转换结果..." disabled />
          <CopyToClipboard text={formatedValue} onCopy={handleCopy}>
            <input type="button" className={styles.inputBtn} value={`点此复制${copyState ? '√' : ' '}`} onClick={onCopyClick} />
          </CopyToClipboard>
        </div>
      </div>
    </div>
  )
}
