import React from "react";
import {useEffect} from "react";
import {autoLogin} from "../store/actions/user";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";

const AutoLog = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            dispatch(autoLogin(user))
        }
    },[])

    useEffect(() => {
        if (!user.isLoggedIn) {
            router.replace('/')
        }
    }, [user])

    return (
        <></>
    )
}

export default AutoLog;
