import fetch from "node-fetch";
import App, { Container } from "next/app";
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import "../public/defaults.css";
import "../public/nprogress.css";

// const tokenValue =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJ3aWtpQGRldiIsInJvbGVzIjpbImFkbWluIl19LCJpYXQiOjE1ODU1MzQzMTksImV4cCI6MTU4NjEzOTExOX0.DzfNUwNW37ahzn_X6oSXItfXhh6TPyH9svNF30AZltU";

// const authLink = new ApolloLink((operation, forward) => {
//     // add the authorization to the headers
//     operation.setContext({
//         headers: {
//             authorization: tokenValue ? `Bearer ${tokenValue}` : "",
//         },
//     });
//     return forward(operation);
// });

const httpLink = new HttpLink({
    uri: "https://us1.prisma.sh/hacklahoma/wiki/dev",
    credentials: "include",
    fetch,
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    // link: authLink.concat(httpLink),
    link: httpLink,
});

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        // exposes the query to the user
        pageProps.query = ctx.query;
        return { pageProps };
    }

    render() {
        const { Component, pageProps } = this.props;

        return (
            <ApolloProvider client={client}>
                <Component {...pageProps} />
            </ApolloProvider>
        );
    }
}

export default MyApp;
