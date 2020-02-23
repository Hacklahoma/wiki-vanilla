import React, { Component } from 'react'
import PageHeader from "../../components/PageHeader";

export class Settings extends Component {
    render() {
        return (
            <div className="Settings container">
                <PageHeader title="Settings" to="home" />
            </div>
        );
    }
}

export default Settings
