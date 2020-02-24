import React, { Component } from "react";
import PageHeader from "../../components/PageHeader";
import "./index.scss";

export class Settings extends Component {
    render() {
        return (
            <div className="Settings container">
                <PageHeader title="Settings" to="home" />
                <div className="item">
                    <h3>Create New Page</h3>
                    <p>
                        Creates a new page in a category. Edit the page by visiting it and pressing
                        edit.
                    </p>
                </div>
                <div className="item">
                    <h3>Create New Category</h3>
                    <p>
                        Creates a new category. Assign pages either in each individual page or by
                        creating a new one.
                    </p>
                </div>
                <div className="item">
                    <h3>Rename Category</h3>
                    <p>Renames the selected category.</p>
                </div>
                <div className="item">
                    <h3>Remove Category</h3>
                    <p>
                        Removes a category. All children pages will be moved to the Miscellaneous
                        category.
                    </p>
                </div>
                <div className="item">
                    <h3>Toggle Dark Mode</h3>
                    <p>Dark mode is superior.</p>
                </div>
                <div className="item">
                    <h3>Export</h3>
                    <p>Export all markdown files.</p>
                </div>
                <div className="item">
                    <h3>Logout</h3>
                    <p>Logout of account.</p>
                </div>
            </div>
        );
    }
}

export default Settings;
