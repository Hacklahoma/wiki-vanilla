import React, { Component } from 'react'
import NewPage from './NewPage'
import Settings from './Settings'
import './index.scss'

export class Popup extends Component {
    render() {
        return (
            <div className="Popup" onClick={this.props.closePopup}>
                <div className="popupContainer">
                    <div className="popupHeader">
                        <h2>
                            {this.props.type === "newPage" ? "New Page" : null}
                            {this.props.type === "settings" ? "Settings" : null}
                        </h2>
                    </div>
                    <div className="content">
                        {this.props.type === "newPage" ? (
                            <NewPage />
                        ) : null}
                        {this.props.type === "settings" ? (
                            <Settings />
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default Popup
