import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import {toast, Toaster} from "react-hot-toast";
import styles from './Login.module.css'
import Button from "../../ui/Button/Button";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../store/actions/user";
import {useEffect} from "react";

const Login = ({toggleLoginModeHandler}) => {
    const router = useRouter()
    const user = useSelector(state => state.user)
    const initialValues = {
        email: '',
        password: ''
    };

    const dispatch = useDispatch()

    const validationSchema = Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().required().min(8),
    });

    const handlerSubmit = async (values, submitProps) => {
        submitProps.setSubmitting(true)
        toast.loading('loading....')
        try {
            const {email, password} = values

            const credentials = {email, password}

            await dispatch(login(credentials))
            submitProps.resetForm();
            submitProps.setSubmitting(false);
            toast.dismiss();
            toast.success('successful');
            router.replace('votes')
        } catch (e) {
            submitProps.setSubmitting(false);
            toast.dismiss();
            toast.error(e.message);
        }
    }

    return (
        <>
            <Toaster/>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handlerSubmit}
            >
                {/* The name attribute is used to hook up with the formik state */}
                {({isValid, isSubmitting}) => (
                    <Form className={styles.Form}>
                        <div className={styles.InputErrorDiv}>
                            <div className={styles.FormControl}>
                                <Field
                                    as="input"
                                    type="text"
                                    id="email"
                                    name="email"
                                    required
                                    autoComplete="off"
                                />
                                <label htmlFor="name" className={styles.Label}>
                                    <span className={styles.ContentLabel}>Email</span>
                                </label>
                            </div>
                            <ErrorMessage
                                className="text-center border-black border-2"
                                name="email"
                            />
                        </div>
                        <div className={styles.InputErrorDiv}>
                            <div className={styles.FormControl}>
                                <Field
                                    as="input"
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="off"
                                />
                                <label htmlFor="number" className={styles.Label}>
                          <span className={styles.ContentLabel}>
                            Password
                          </span>
                                </label>
                            </div>
                            <ErrorMessage name="password"/>
                        </div>
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            loading={isSubmitting}
                            loadingText="processing"
                            dark
                        >
                            Login
                        </Button>
                        <button
                            type={'button'}
                            onClick={() => toggleLoginModeHandler(false)} className={styles.signUp}>
                            Sign Up
                        </button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default Login;
