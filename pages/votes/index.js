import {useSelector} from "react-redux";
import Layout from "../../components/layout/Layout";


const Votes = () => {
    const user = useSelector(state => state.user)
    return (
        <Layout>
            <p>{user.email} {user.id}</p>
        </Layout>
    )
}


export default Votes;
