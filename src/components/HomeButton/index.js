import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class HomeButton extends Component {
    render() {
        return (
            <div className="HomeButton">
                <Link to="/">Home Button</Link>
            </div>
        );
    }
}

export default HomeButton
