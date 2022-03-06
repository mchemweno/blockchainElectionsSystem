import {toast, Toaster} from "react-hot-toast";
import {ErrorMessage, Field, Form, Formik} from "formik";
import styles from "./signup.module.css";
import Button from "../../ui/Button/Button";
import * as Yup from "yup";


const SignUp = ({toggleLoginModeHandler}) => {
    const initialValues = {
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
        rePassword: ''
    }

    const validationSchema = Yup.object({
        email: Yup.string().email().required(),
        username: Yup.string().required().min(6),
        firstName: Yup.string().required().min(3),
        lastName: Yup.string().required().min(3),
        phoneNumber: Yup.number().required().min(8),
        password: Yup.string().required().min(8),
        rePassword: Yup.string().required().min(8),
    });

    const handlerSubmit = async (values, submitProps) => {
        submitProps.setSubmitting(true)
        toast.loading('loading....')
        try {
            const {email, username, firstName, lastName, phoneNumber, password, rePassword} = values
            if (password !== rePassword) {
                throw new Error('passwords have to  match.....');
            }

            const credentials = {email, username, firstName, lastName, phoneNumber, password}

            const response = await fetch(
                `http://127.0.0.1:3000/api/auth/signup`,
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                }
            )

            const resData = await response.json();

            if (response.status !== 201) {
                console.log(resData)
                if (resData.message) {
                    throw new Error(resData.message);
                }
                throw new Error(response.statusText);
            }
            submitProps.resetForm();
            submitProps.setSubmitting(false);
            toast.dismiss();
            toast.success('successful');
            toggleLoginModeHandler(true)
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
                                    type="text"
                                    id="username"
                                    name="username"
                                    required
                                    autoComplete="off"
                                />
                                <label htmlFor="number" className={styles.Label}>
                          <span className={styles.ContentLabel}>
                            Username
                          </span>
                                </label>
                            </div>
                            <ErrorMessage name="username"/>
                        </div>
                        <div className={styles.InputErrorDiv}>
                            <div className={styles.FormControl}>
                                <Field
                                    as="input"
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    required
                                    autoComplete="off"
                                />
                                <label htmlFor="number" className={styles.Label}>
                          <span className={styles.ContentLabel}>
                            First Name
                          </span>
                                </label>
                            </div>
                            <ErrorMessage name="firstName"/>
                        </div>
                        <div className={styles.InputErrorDiv}>
                            <div className={styles.FormControl}>
                                <Field
                                    as="input"
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    required
                                    autoComplete="off"
                                />
                                <label htmlFor="number" className={styles.Label}>
                          <span className={styles.ContentLabel}>
                            Last Name
                          </span>
                                </label>
                            </div>
                            <ErrorMessage name="lastName"/>
                        </div>
                        <div className={styles.InputErrorDiv}>
                            <div className={styles.FormControl}>
                                <Field
                                    as="input"
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    required
                                    autoComplete="off"
                                />
                                <label htmlFor="number" className={styles.Label}>
                          <span className={styles.ContentLabel}>
                            Phone Number
                          </span>
                                </label>
                            </div>
                            <ErrorMessage name="phoneNumber"/>
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
                        <div className={styles.InputErrorDiv}>
                            <div className={styles.FormControl}>
                                <Field
                                    as="input"
                                    type="password"
                                    id="rePassword"
                                    name="rePassword"
                                    required
                                    autoComplete="off"
                                />
                                <label htmlFor="number" className={styles.Label}>
                          <span className={styles.ContentLabel}>
                            Repeat Password
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
                            Sign Up
                        </Button>
                        <button
                            type={'button'}
                            onClick={() => toggleLoginModeHandler(true)} className={styles.signUp}>
                            Login
                        </button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default SignUp;
