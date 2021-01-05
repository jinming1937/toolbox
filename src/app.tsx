import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import Page from '@/pages'
import {IMenuItem, MenuList} from '@/util'
import {Footer, Navigator} from '@/page-frame'
import styles from './index.less'
export default class App extends React.Component {
  render() {
    return (
      <>
        <Navigator />
        <div className={styles.content}>
          <Switch>
            <Redirect exact from="/" to="/home" />
            {MenuList.map((item: IMenuItem, index: number) => (
              <Route key={index} path={item.link} component={Page[item.page]} />
            ))}
            <Route render={() => <div>没有找到您想要的页面</div>} />
          </Switch>
        </div>
        <Footer />
      </>
    )
  }
}
