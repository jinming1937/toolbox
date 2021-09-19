import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {MenuList} from '@/util'
import styles from './home.less'

export class Home extends Component {
  render() {
    const mList = [
      {
        name: '数学画板',
        link: 'http://www.auoqu.com/math/index.html',
        page: 'json',
        desc: 'canvas 数学画板，可以自由创作各种曲线，用于教学、图形演示',
        dateTime: '2021-09-18 12:50:08'
      },
      {
        name: '酷炫3D',
        link: 'http://www.auoqu.com/heart/index.html',
        page: 'json',
        desc: 'canvas 3D 酷炫心形，平面转换成3维的一个精彩世界',
        dateTime: '2019-01-30 22:21:44'
      },
      ...MenuList
    ]
    return (
      <div className={styles.home}>
        <section className={styles.description}>
          <h4>一个程序员</h4>
          <p>写过很多代码和Bug，攒了一些工程师小工具，有时候会很有用处哦✨✨✨</p>
        </section>
        <section className={styles.description}>
          <h4>写了几个小小前端工具</h4>
          <ul className={styles.toolList}>
            {mList
              .filter(item => item.page !== 'home')
              .map((item, index) => (
                <li key={index}>
                  {item.link.match(/^http/) ? (
                    <a href={item.link} target="blank">
                      {item.name}
                    </a>
                  ) : (
                    <Link to={item.link}>{item.name}</Link>
                  )}
                  <span className={styles.publishTime}>发布时间：{item.dateTime}</span>
                  <div className={styles.introduce}>{item.desc}</div>
                </li>
              ))}
          </ul>
        </section>
      </div>
    )
  }
}
