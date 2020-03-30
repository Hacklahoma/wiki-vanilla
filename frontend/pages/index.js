import { useQuery, gql } from "@apollo/client";
import Head from 'next/head'

const PAGES = gql`
    {
        pages(where: { id: "demo-page" }) {
            id
            name
        }
    }
`;

function Index() {
    const { loading, error, data } = useQuery(PAGES);

    /** RETURN Loading */
    if (loading) return <p>Loading...</p>;
    /** RETURN Error */
    if (error) return <p>{error.message}</p>;
    /** RETURN Dashboard */
    return (
        <div>
            <Head>
                <title>Wiki</title>
            </Head>
            Dashboard
        </div>
    );
}

export default Index;
