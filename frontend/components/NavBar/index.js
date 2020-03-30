import styled from "styled-components";
import Logo from "./Logo";

const StyledNavBar = styled.div`
    width: 100vw;
    height: 60px;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    justify-content: space-between;
    display: flex;
`;

function NavBar() {
    return (
        <StyledNavBar>
            <Logo />
        </StyledNavBar>
    );
}

export default NavBar;
