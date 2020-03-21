import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./Router";
import * as serviceWorker from "./serviceWorker";
import { SnackbarProvider } from "notistack";
import styled, { ThemeProvider } from 'styled-components';

const theme = {
    blue: "#3674D4",
    black: "#1D1D1D",
};

const StyledApp = styled.div`
    color: ${theme.black};
`

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
            <StyledApp>
                <App />
            </StyledApp>
        </SnackbarProvider>
    </ThemeProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
