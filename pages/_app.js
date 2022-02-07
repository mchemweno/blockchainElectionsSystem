import '../styles/globals.css'
import {Provider, useDispatch} from "react-redux";
import {useStore} from "../store";
import AutoLog from "../components/AutoLog";

function MyApp({Component, pageProps}) {
    const store = useStore(pageProps.initialReduxState)

    return (
        <Provider store={store}>
            <AutoLog/>
            <Component {...pageProps} />
        </Provider>
    )

}

export default MyApp
