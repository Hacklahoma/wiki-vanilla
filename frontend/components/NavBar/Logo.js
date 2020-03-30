import styled from "styled-components";

const StyledLogo = styled.div`
    height: calc(100% - 26px);
    cursor: pointer;
    align-items: center;
    display: inline-flex;
    /* background: red; */
    margin: 13px 0 13px 40px;
    img {
        height: 100%;
    }
    p {
        font-weight: 600;
        font-size: 1.25em;
        margin-left: 5px;
    }
`;

function Logo() {
    return (
        <StyledLogo>
            <img src="/assets/images/logo.png" alt="logo" />
            <p>Wiki</p>
        </StyledLogo>
    );
}

export default Logo;
