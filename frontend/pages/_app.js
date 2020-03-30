import fetch from "node-fetch";
import App, { Container } from "next/app";
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: "https://us1.prisma.sh/hacklahoma/wiki/dev",
        fetch,
    }),
});

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        // this exposes the query to the user
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
