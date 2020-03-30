import { useQuery, gql } from "@apollo/client";
import Meta from "../components/Meta";
import { useRouter } from "next/router";
import Link from 'next/link'
import Error from "next/error";

const GET_PAGE = gql`
    query Page($id: ID!) {
        page(where: { id: $id }) {
            id
            name
        }
    }
`;
function Page(props) {
    const router = useRouter();
    const { page } = router.query;
    const { loading, error, data } = useQuery(GET_PAGE, {
        variables: { id: page },
    });

    /** RETURN loading */
    if (loading) return <p>Loading...</p>;
    /** RETURN Error */
    if (error) return <p>{error.message}</p>;
    /** RETURN 404 when page does not exist */
    if(!data.page) return <Error statusCode={"404"} />;

    return (
        <div>
            <Meta title={data.page.name} />
            <Link href='/'>
                <a>Home</a>
            </Link>
            <p>/{data.page.id}</p>
            <h1>{data.page.name}</h1>
        </div>
    );
}

export default Page;
