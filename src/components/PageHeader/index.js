import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { HomeRounded, Settings } from '@material-ui/icons'
import './index.scss'

export class PageHeader extends Component {
    
    toLogic() {
        if(this.props.to === "home")
            return (
                <Link to="/" className="button">
                    <HomeRounded className="icon" />
                    <p>Home</p>
                </Link>
            );
        else if(this.props.to === "settings")
            return (
                <Link to='settings' className="button">
                    <Settings />
                    <p>Settings</p>
                </Link>
            );
        else
            return(<div>Error, check props</div>);
    }

    render() {
        return (
            <div className="PageHeader">
                <div className="wrapper">
                    {this.toLogic()}
                    <h1>{this.props.title}</h1>
                </div>
            </div>
        );
    }
}

export default PageHeader;
