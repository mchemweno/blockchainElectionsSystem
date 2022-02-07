import styles from './Home.module.css'
import {useRouter} from "next/router";
import Link from "next/link";
import Login from "../components/Login/Login";
import {useEffect, useState} from "react";
import SignUp from "../components/signUp/SignUp";
import {autoLogin} from "../store/actions/user";
import {useDispatch, useSelector} from "react-redux";

export default function Home() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true)
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    const toggleLoginModeHandler = (status) => {
        setIsLogin(status)
    }

    useEffect(() => {

        if (user.isLoggedIn) {
            router.replace('votes')
        }
    }, [])

    const navigationHandler = () => {
        router.push('votes')
    }


    return (
        <div className={styles.container}>
            {isLogin &&
                <Login
                    toggleLoginModeHandler={toggleLoginModeHandler}
                />
            }
            {!isLogin &&
                <SignUp
                    toggleLoginModeHandler={toggleLoginModeHandler}
                />
            }
        </div>
    )
}
