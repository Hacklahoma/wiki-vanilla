import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Home from './views/Home'
import Page from './views/Page'

function Router() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/:page" component={Page} />
        </Switch>
      </BrowserRouter>
    );
}

export default Router;
