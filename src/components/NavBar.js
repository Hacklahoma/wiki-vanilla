import React, { Component } from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import create from "../assets/create.svg";
import settings from "../assets/settings.svg";

const StyledNavBar = styled.div`
    background: white;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    .logo {
        margin: 10px 30px;
        display: inline-block;
        img {
            height: 32px;
            vertical-align: middle;
            display: inline-block;
        }
        p {
            color: black;
            margin-top: 4px;
            margin-left: 8px;
            font-size: 1.2em;
            font-weight: 900;
            vertical-align: middle;
            display: inline-block;
        }
    }
    .rightButtons {
        margin: 13px 30px 0 0;
        img {
            margin: 0 10px;
            height: 22px;
            width: 22px;
        }
    }
`;

export class NavBar extends Component {
    render() {
        return (
            <StyledNavBar>
                <a href="/">
                    <div className="logo">
                        <img src={logo} alt="logo" />
                        <p>Wiki</p>
                    </div>
                </a>
                {this.props.home ? (
                    <div>
                        <div className="rightButtons">
                            <img src={create} alt="create" />
                            <img src={settings} alt="settings" />
                        </div>
                    </div>
                ) : null}
            </StyledNavBar>
        );
    }
}

export default NavBar;
