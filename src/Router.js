import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Home from './views/Home'
import Page from './views/Page'
import Settings from './views/Settings'

function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/settings" component={Settings} />
                <Route path="/:page" component={Page} />
            </Switch>
        </BrowserRouter>
    );
}

export default Router;
