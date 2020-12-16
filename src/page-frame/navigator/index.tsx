import React from "react"
import classnames from 'classnames'
import {Link} from "react-router-dom";
import {MenuList, IMenuItem} from '@/util'
import styles from './styles.less';

interface NavigatorProps {}
export class Navigator extends React.Component<NavigatorProps> {
  navRef: any;
  constructor(props: NavigatorProps) {
    super(props);
    this.navRef = null;
  }

  ref = (ref: any) => (this.navRef = ref);
  pointerHandler = () => {
    if(this.navRef !== null) {
      if(this.navRef.style.offsetHeight === 0) {
        this.navRef.style.height = 5 * 24 + 'px';
      } else {
        this.navRef.style.height = '0';
      }
    }
  };

  resize = () => {
    console.log('window is resizing...', window.innerWidth)
    if(this.ref !== null) {
      console.log(this.navRef);
      if(window.innerWidth > 500) {
        this.navRef.style.height = 'auto';
      } else {
        this.navRef.style.height = '0';
      }
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  renderNav = () => {
    return MenuList.map((item: IMenuItem, index: number) => {
      const match = item.link === location.pathname;
      return (<li key={index} className={classnames({[styles.activeNav]: match})}><Link to={item.link}>{item.name}</Link></li>)
    })
  }

  render() {
    return (
      <nav className={styles.navigator}>
        <div className={styles.logo}>小鱼工具</div>
        <div className={styles.navListBox}>
          <ul className={styles.navList} ref={this.ref}>{this.renderNav()}</ul>
        </div>
        <div className={styles.linePoint + ' ' + styles.linePointAction}>
          <span className={styles.pointer} onClick={this.pointerHandler}>Ξ</span>
        </div>
      </nav>
    )
  }
}
