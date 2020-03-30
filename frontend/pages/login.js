import styled from "styled-components";
import NavBar from "../components/NavBar";
import Head from "next/head";

const StyledLogin = styled.div`
    text-align: center;
    .content {
        margin-top: 30vh;
        h1 {
            margin-bottom: 10px;
        }
        img {
            clip-path: inset(5px 5px 5px 5px);
        }
    }
`;

function Login() {
    return (
        <StyledLogin>
            <Head>
                <title>Login • Wiki</title>
            </Head>
            <NavBar />
            <div className="content">
                <h1>Hacklahoma's team knowledge base</h1>
                <a
                    href={
                        "https://slack.com/oauth/authorize?scope=identity.basic&client_id=244872783015.954421738912"
                    }
                >
                    <img
                        alt="Sign in with Slack"
                        height="40"
                        width="172"
                        src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                        srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
                    />
                </a>
            </div>
        </StyledLogin>
    );
}

export default Login;
