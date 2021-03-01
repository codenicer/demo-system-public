import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import LogIn from './Pages/LogIn/LogIn'
import App from './App'
import store from './scripts/store'
import PrivateRoute from './PrivateRoute'

import { config } from './scripts/helpers/config_helper'
import axios from 'axios'

//aesthetics
import './index.css'
import './mediaquery.css'
;(async () => {
  try {
    const res = await axios.get(`/api`, config)
    if (res.status === 200) {
      console.log('Sucessfuly connected to backend !!!')
    } else {
      console.log('Cant connect to backed !')
    }
  } catch (err) {
    console.log('Cant connect to backed !')
  }
})()

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <PrivateRoute path="/system" component={App} />
        <Route path="/" component={LogIn} exact />
        <Route
          render={() => {
            return <h1>Page Not Found.</h1>
          }}
        />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
)
