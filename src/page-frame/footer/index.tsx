import React from 'react'
import styles from './styles.less'
import img from '../../img/pl.png'

const RECORD_CODE = '11010802033715'
export const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <small> 小鱼工具 © {year}</small>
      <small>|</small>
      <small>
        <a href="mailto:iregexp@163.com">邮箱：iregexp@163.com</a>
      </small>
      <small>|</small>
      <small>京ICP备2020046040号</small>
      <small>|</small>
      <small>
        <a target="_blank" href={`http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${RECORD_CODE}`}>
          <img src={img} className={styles.img} />
          京公网安备 {RECORD_CODE}号
        </a>
      </small>
    </footer>
  )
}
