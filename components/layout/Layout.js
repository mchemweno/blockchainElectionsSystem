import Link from 'next/link'
import Styles from './Layout.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faLock} from "@fortawesome/free-solid-svg-icons/faLock";
import {faCheckSquare} from '@fortawesome/free-regular-svg-icons/faCheckSquare'
import {faArrowAltCircleRight} from '@fortawesome/free-regular-svg-icons/faArrowAltCircleRight'
import {faFileLines} from '@fortawesome/free-regular-svg-icons/faFileLines'
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../store/actions/user";

const Layout = ({children}) => {
    const router = useRouter();
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    return (
        <div className={Styles.Home}>
            <div className={Styles.Sidebar}>
                <Link href={'/votes'}
                >
                    <a className={router.route === '/votes' ? Styles.active : null}>
                        <FontAwesomeIcon className={Styles.FontAwesome}
                                         icon={faCheckSquare}/> Vote
                    </a>
                </Link>
                <Link href={'/results'}
                >
                    <a className={router.route === '/results' ? Styles.active : null}>
                        <FontAwesomeIcon className={Styles.FontAwesome}
                                         icon={faFileLines}/> Results
                    </a>
                </Link>
                {
                    user.admin &&
                    <Link href={'/admin'}>
                        <a className={router.route === '/admin' ? Styles.active : null}>
                            <FontAwesomeIcon className={Styles.FontAwesome}
                                             icon={faLock}/> Admin
                        </a>
                    </Link>
                }
                <button onClick={() => dispatch(logout())}
                        className={Styles.Button}>
                    <FontAwesomeIcon className={Styles.FontAwesome}
                                     icon={faArrowAltCircleRight}/>
                    LogOut
                </button>
            </div>
            <div className={Styles.Content}>
                {children}
            </div>
        </div>
    )
}


export default Layout;
