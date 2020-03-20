import { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router";

export class Auth extends Component {
    constructor() {
        super();
        this.state = {
            user: "",
        };
    }

    componentDidMount() {
        // Getting unique code
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const team = process.env.REACT_APP_SLACK_TEAM_ID;

        // Calling slack api
        axios
            .get(
                "https://slack.com/api/oauth.access?client_id=" +
                    process.env.REACT_APP_SLACK_CLIENT_ID +
                    "&client_secret=" +
                    process.env.REACT_APP_SLACK_CLIENT_SECRET +
                    "&code=" +
                    code
            )
            .then(response => {
                // Storing user data
                this.setState({
                    user: response.data,
                });
                console.log(this.state.user);
                if (response.data.ok && (response.data.team_id === team || team === "")) {
                    console.log("Success");
                    this.props.history.push("/?user=" + response.data.access_token);
                } else {
                    this.props.history.push("/login");
                    console.log("Error: " + response.data.error);
                }
            })
            .catch(error => {
                console.log(error);
                this.props.history.push("/login");
            });
    }

    render() {
        return null;
    }
}

export default withRouter(Auth);
