import {useSelector} from "react-redux";


const Votes = () => {
    const user = useSelector(state => state.user)
    return (
        <p>{user.email} {user.id}</p>
    )
}


export default Votes;
