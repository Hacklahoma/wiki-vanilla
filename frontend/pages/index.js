import { useQuery, gql } from "@apollo/client";
import Page from "./[page]";

const PAGES = gql`
    {
        pages(where: { id: "demo-page" }) {
            id
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
    return <div>Dashboard</div>;
}

export default Index;
