import React from 'react'

import { BrowserRouter as _Router, Route, Switch } from 'react-router-dom'
import App from './App' 

export default class Router extends React.Component {
    render() {
        return <_Router component={App}>
            <Switch>
                <Route render={(props) => <App />} exact path="/imarkdown/edit" />
                <Route render={(props) => <App path={props.match.params.path} />} exact path="/imarkdown/edit/:path*" />
            </Switch>
        </_Router>
    }
}
