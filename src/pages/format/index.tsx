import React, {Component, ChangeEvent, ClipboardEvent, FocusEvent, useState, useCallback, useRef} from 'react';
import {FormatVariable} from './formatVariable'
import styles from './styles.less'

export class Format extends Component<{}, {}> {
	constructor(props: {}) {
		super(props)
  }
	render() {
		return (
			<main className={styles.main}>
				<FormatVariable title="间隔线转驼峰"  />
				<FormatVariable title="驼峰转间隔线" isCamelToPascal style={{marginTop: '32px'}} />
			</main>
		)
	}
}
