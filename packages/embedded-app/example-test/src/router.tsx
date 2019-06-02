import React from 'react'

import { BrowserRouter as _Router, Route, Switch } from 'react-router-dom'
// import App from './App' 

const Test = () => (
    <div>test</div>
)

type RouterProps = {
    token: string,
}

const router = ({token}: RouterProps) => (
    <_Router>
        <Switch>
            <Route render={(props) => <Test />} exact path="/imarkdown/edit" />
            <Route render={(props) => <Test/>} exact path="/imarkdown/edit/:path*" />
        </Switch>
    </_Router>
)

export default router;
