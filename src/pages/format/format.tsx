import React, {Component} from 'react'
import {Calendar} from '@biqi/ui'
import {FormatVariable} from './formatVariable/formatVariable'
import styles from './format.less'

export class Format extends Component<{}, {}> {
  constructor(props: {}) {
    super(props)
  }
  render() {
    return (
      <main className={styles.main}>
        <FormatVariable title="间隔线转驼峰" />
        <FormatVariable title="驼峰转间隔线" isCamelToPascal style={{marginTop: '32px'}} />
        <Calendar today={new Date()} monthCount={3} isShow={false} />
      </main>
    )
  }
}
