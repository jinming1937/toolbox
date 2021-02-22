import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import App from './app'
import './index.less'
import '@biqi/ui/dist/theme/index.mini.css'

ReactDOM.render(
  <Router>
    <Route path="/" component={App} />
  </Router>,
  document.getElementById('root')
)
