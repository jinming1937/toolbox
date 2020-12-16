import React from 'react'
import styles from './styles.less'

export interface FooterProps {

}

export interface FooterState {

}

export class Footer extends React.Component<FooterProps, FooterState> {
  constructor(props: FooterProps) {
    super(props);
  }
  render() {
    return (
      <footer className={styles.footer}>
        <hr />
        <ul>
          <li>
            <small> 小鱼工具 © 2020 |</small>
          </li>
          <li>
            <small>
              <a href="mailto:iregexp@163.com">iregexp@163.com</a>
            </small>
            <small>|</small>
            <small>
              <a href="http://beian.miit.gov.cn">京ICP备2020046040号</a>
            </small>
          </li>
        </ul>
        <small>^^^^^^^^^^^^^^^^^^^^^^^^^^^^^</small>
      </footer>
    );
  }
}
