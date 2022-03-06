import styles from './AddParticipants.module.css'
import {ErrorMessage, Field, Form, Formik} from "formik";
import Button from "../../ui/Button/Button";
import * as Yup from "yup";
import {useState} from "react";
import {toast, Toaster} from "react-hot-toast";

const AddParticipants = ({setVisibility, participants, setParticipants}) => {

    const initialValues = {
        email: ''
    };

    const validationSchema = Yup.object({
        email: Yup.string().required().min(5)
    });

    const handlerSubmit = async (values, submitProps) => {
        const {email} = values;
        try {
            const response = await fetch(
                `http://127.0.0.1:3000/api/elections/getParticipants`,
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({email: email}),
                }
            )


            if (participants.filter(participant => participant.email === email).length > 0) throw new Error('Participant already added')

            if (response.status !== 200) {
                throw new Error('Aspirant not found or is not active user.')
            }

            setParticipants(prevState => [...prevState, {email, id: participants.length}])
            submitProps.resetForm();
            submitProps.setSubmitting(false);
            toast.dismiss();
            toast.success('Added');
        } catch (e) {
            submitProps.setSubmitting(false);
            toast.dismiss();
            toast.error(e.message);
        }
    }
    const removeParticipant = (id) => {
        const newParticipants = participants.filter(participant => participant.id !== id)
        setParticipants(newParticipants)
    }
    return (
        <>
            <Toaster/>
            <div className={styles.Container}>
                <h2>Please enter participants email...</h2>
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
                                    className=" border-black border-2"
                                    name="email"
                                />
                            </div>
                            <div className={styles.Button}>
                                <Button
                                    type="button"
                                    onClick={() => setVisibility({
                                        addDetails: true,
                                        addParticipants: false,
                                        addVoters: false,
                                        summary: false
                                    })}
                                    dark
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    loading={isSubmitting}
                                    loadingText="processing"
                                    dark
                                >
                                    Add Participant
                                </Button>
                                <Button
                                    type="button"
                                    dark
                                    onClick={() => setVisibility({
                                        addDetails: false,
                                        addParticipants: false,
                                        addVoters: true,
                                        summary: false
                                    })}
                                    disabled={!(participants.length > 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>

                <div className={styles.participantsContainer}>
                    {participants.map(participant =>
                        <div onClick={() => removeParticipant(participant.id)} key={participant.id}
                             className={styles.ParticipantContainer}><p>{participant.email}</p></div>)
                    }
                </div>
            </div>
        </>
    )
}

export default AddParticipants;
