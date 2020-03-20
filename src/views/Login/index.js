import React, { Component } from "react";
import "./index.scss";
import logo from "../../assets/logo.png";

export class Login extends Component {
    render() {
        return (
            <div className="Login">
                <div className="header">
                    <a href="/">
                        <div className="logo">
                            <img src={logo} alt="logo" />
                            <p>Wiki</p>
                        </div>
                    </a>
                </div>
                <div className="container">
                    <div className="content">
                        <h1>Hacklahoma's team knowledge base</h1>
                        <a
                            href={
                                "https://slack.com/oauth/authorize?scope=identity.basic&client_id=" +
                                process.env.REACT_APP_SLACK_CLIENT_ID
                            }
                        >
                            <img
                                alt="Sign in with Slack"
                                height="40"
                                width="172"
                                src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                                srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
                            />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
