import React, { Component } from "react";
import {
    Brightness2Rounded,
    LockRounded,
    CloudDownload,
    Brightness2Outlined
} from "@material-ui/icons";
import "./index.scss";

export class Settings extends Component {
    constructor() {
        super();
        this.state = {
            darkMode: false
        };
        this.darkMode = this.darkMode.bind(this);
        this.downloadData = this.downloadData.bind(this);
        this.logout = this.logout.bind(this);
    }

    darkMode() {
        this.setState({
            darkMode: !this.state.darkMode
        })
    }

    downloadData() {

    }

    logout() {
        localStorage.removeItem('user');
        window.location.reload();
    }

    render() {
        return (
            <div className="Settings">
                {/* Dark mode */}
                <div onClick={this.darkMode} className="darkMode settingsItem">
                    {this.state.darkMode ? (
                        <div>
                            <Brightness2Rounded
                                className="icon"
                                style={{ transform: "rotate(150deg)", marginBottom: "-8px" }}
                            />
                            <p style={{ textDecoration: "line-through" }}>Disable Dark Mode</p>
                        </div>
                    ) : (
                        <div>
                            <Brightness2Outlined
                                className="icon"
                                style={{ transform: "rotate(150deg)", marginBottom: "-8px" }}
                            />
                            <p style={{ textDecoration: "line-through" }}>Enable Dark Mode</p>
                        </div>
                    )}
                </div>

                {/* Download Data */}
                <div className="darkMode settingsItem">
                    <CloudDownload className="icon" style={{ marginBottom: "-6px" }} />
                    <p style={{ textDecoration: "line-through" }}>Download Data</p>
                </div>

                {/* Logout */}
                <div onClick={this.logout} className="darkMode settingsItem">
                    <LockRounded className="icon" style={{ marginBottom: "-6px" }} />
                    <p>Logout</p>
                </div>

                <div className="close">
                    <p className="close">Close</p>
                </div>
            </div>
        );
    }
}

export default Settings;
