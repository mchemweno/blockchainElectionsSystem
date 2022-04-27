import styles from './AddVoters.module.css'
import {ErrorMessage, Field, Form, Formik} from "formik";
import Button from "../../ui/Button/Button";
import * as Yup from "yup";
import {toast, Toaster} from "react-hot-toast";
import {useSelector} from "react-redux";

const AddElections = ({setVisibility, electionDetails, setElectionDetails, pposts}) => {
    const initialValues = electionDetails;
    const user = useSelector(state => state.user)

    const validationSchema = Yup.object({
        year: Yup.number().integer().required().min(2022).max(2027),
        duration: Yup.number().integer().required().min(1).max(12),
        post: Yup.string().required().min(5),
    });

    const handlerSubmit = async (values, submitProps) => {
        submitProps.setSubmitting(true)
        const {year, post, duration} = values

        try {
            const response = await fetch(
                `http://127.0.0.1:3000/api/elections/getElections`,
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        post: post,
                        year: year
                    }),
                }
            )

            if (response.status !== 404) {
                throw new Error(response.statusText);
            }

            setElectionDetails({
                year: year,
                post: post,
                duration: duration
            })
            submitProps.setSubmitting(false);

            setVisibility({
                addDetails: false,
                addParticipants: true,
                addVoters: false,
                summary: false
            })

        } catch (e) {
            submitProps.setSubmitting(false);
            toast.error('Elections Exist');
        }
    }
    return (
        <>
            <Toaster/>
            <div className={styles.Container}>
                <>
                    <h2>Please enter the election details...</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handlerSubmit}
                    >
                        {/* The name attribute is used to hook up with the formik state */}
                        {({isValid, isSubmitting}) => (
                            <Form className={styles.Form}>
                                <div>
                                    <label htmlFor="name" >
                                        <span className={styles.ContentLabel2}>Post: </span>
                                    </label>
                                    <Field as={'select'} className={styles.box} name="post" id="post">
                                        {
                                            pposts.map((post, index) => {
                                                return (<option key={index} value={post}>{post}</option>)
                                            })
                                        }
                                    </Field>
                                </div>
                                <div className={styles.InputErrorDiv}>
                                    <div className={styles.FormControl}>
                                        <Field
                                            as="input"
                                            type="number"
                                            id="year"
                                            name="year"
                                            required
                                            autoComplete="off"
                                        />
                                        <label htmlFor="number" className={styles.Label}>
                                        <span className={styles.ContentLabel}>
                                         Year:
                                            </span>
                                        </label>
                                    </div>
                                    <ErrorMessage name="year"/>
                                </div>
                                <div className={styles.InputErrorDiv}>
                                    <div className={styles.FormControl}>
                                        <Field
                                            as="input"
                                            type="number"
                                            id="duration"
                                            name="duration"
                                            required
                                            autoComplete="off"
                                        />
                                        <label htmlFor="number" className={styles.Label}>
                                        <span className={styles.ContentLabel}>
                                         duration (hours):
                                            </span>
                                        </label>
                                    </div>
                                    <ErrorMessage name="duration"/>
                                </div>
                                <div className={styles.Button}>
                                    <Button
                                        type="submit"
                                        disabled={!isValid || isSubmitting}
                                        loading={isSubmitting}
                                        loadingText="processing"
                                        dark
                                    >
                                        Next
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            </div>
        </>
    )
}


export default AddElections;
