import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./views/Home";
import Page from "./views/Page";
import Login from "./views/Login";
import Auth from "./views/Auth";
import Settings from "./views/Settings";

function Router() {
    return (
        <BrowserRouter>
            <Switch>
              {/* Check for login here instead of in Home component  */}
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route path="/auth" component={Auth} />
                <Route exact path="/settings" component={Settings} />
                <Route path="/p/:page" component={Page} />
            </Switch>
        </BrowserRouter>
    );
}

export default Router;
