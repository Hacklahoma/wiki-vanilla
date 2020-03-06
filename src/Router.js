import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./views/Home";
import Page from "./views/Page";
import Login from "./views/Login";
import Auth from "./views/Auth";

function Router() {
    return (
        <BrowserRouter>
            <Switch>
              {/* Check for login here instead of in Home component  */}
                <Route exact path="/" component={Home} />
                <Route exact path="/404" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/fetchUrl" component={Auth} />
                <Route path="/auth" component={Auth} />
                <Route path="/:page" component={Page} />
            </Switch>
        </BrowserRouter>
    );
}

export default Router;
