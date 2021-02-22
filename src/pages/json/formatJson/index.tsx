import * as React from 'react'
import {classnames} from '@biqi/ui/lib/util'
import MyWorker from '../../js/parser.worker.js'
import styles from './styles.less'

export interface FormatJsonProps {
  onFormat: (data: object) => void
  placeholder?: string
  className?: string
}

export interface FormatJsonState {
  jsonDataStr: string
  progressRate: boolean
  msgStrInvalid: boolean
  progressSucc: boolean
}

export class FormatJson extends React.Component<FormatJsonProps, FormatJsonState> {
  beginTime: number
  fastParseWorker: Worker
  isFormating: boolean
  objStr: string
  aimId: any
  constructor(props: FormatJsonProps) {
    super(props)
    this.state = {jsonDataStr: '', progressSucc: false, msgStrInvalid: false, progressRate: false}
    this.isFormating = false
    this.beginTime = 0
    this.objStr = ''
    this.fastParseWorker = new MyWorker()
    this.fastParseWorker.onmessage = event => {
      console.log('json parse ' + (+new Date() - this.beginTime) + ' ms')
      switch (
        this.aimId
        // case 0: this.onMsg(event); break;
        // case 1: this.onSelectMsg(event); break;
        // default: this.onMsg(event); break;
      ) {
      }
    }
    this.fastParseWorker.onerror = () => {
      this.aimId = 0
      this.setState({progressSucc: false, progressRate: false, msgStrInvalid: true})
      // this.objAim = null;
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
      this.setState({jsonDataStr: this.objStr, msgStrInvalid: false, progressSucc: false})
    } else {
      this.setState({jsonDataStr: val})
    }
  }

  render() {
    const {jsonDataStr} = this.state
    const {placeholder, className = ''} = this.props
    return <textarea value={jsonDataStr} onChange={this.onJsonDataChange} className={classnames(styles.formatJson, className)} tabIndex={-1} placeholder={placeholder}></textarea>
  }
}
