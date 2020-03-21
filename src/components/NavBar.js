import React, { Component } from 'react'
import styled from 'styled-components'
import logo from '../assets/logo.png';

const StyledNavBar = styled.div`
    background: white;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    box-shadow: 1px 1px 4px rgba(0,0,0, 0.1);
    display: flex;
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
            </StyledNavBar>
        );
    }
}

export default NavBar
