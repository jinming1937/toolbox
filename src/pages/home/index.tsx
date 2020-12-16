import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Footer} from '@/page-frame'
import styles from './styles.less'

export class Home extends Component {
  render() {
    return (
      <>
        <div className={styles.home}>
          <section className={styles.description}>
            <h4>平平无奇的一个程序员</h4>
            <p>写过很多代码和Bug，攒了一些工程师小工具，有时候会很有用处哦✨✨✨</p>
          </section>
          <section className={styles.description}>
            <h4>写了几个小小前端工具</h4>
            <ul className={styles.toolList}>
              <li>
                <Link to="./format">变量名转换</Link><span className={styles.publishTime}>发布时间：2017-01-20</span>
                <div className={styles.introduce}>变量名称进行「驼峰to帕斯卡」或者「帕斯卡to驼峰」</div>
              </li>
            </ul>
          </section>
        </div>
        <Footer />
      </>
    )
  }
}
