export const AUTO_LOGIN = 'AUTO_LOGIN'
export const LOGIN = 'LOGIN'
export const LOGOUT ='LOGOUT'

export const login = (credentials) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:3000/api/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                }
            )

            const resData = await response.json();

            if (response.status === 401) {
                throw new Error(response.statusText);
            }


            localStorage.setItem(
                'user',
                JSON.stringify({...resData.user, token: resData.token})
            )
            dispatch({
                type: LOGIN,
                user: resData.user,
                token: resData.token
            })
        } catch (e) {
            throw new Error(e.message)
        }
    }
}

export const autoLogin = (userData) => {
    return {
        type: AUTO_LOGIN,
        data: userData
    }
}

export const logout = () => {
    localStorage.removeItem('user')
    return {
        type: LOGOUT
    }
}
