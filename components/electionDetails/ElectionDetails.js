import styles from './ElectionDetails.module.css'
import {useState} from "react";
import Button from "../../ui/Button/Button";
import {toast} from "react-hot-toast";
import {useSelector} from "react-redux";

const ElectionDetails = ({electionDetails, setVoteEvent}) => {
    const user = useSelector(state => state.user)

    const [aspirant, setAspirant] = useState()
    const [loading, setLoading] = useState(false)
    const [confirmOverlay, setConfirmOverlay] = useState(false)
    const selectHandler = (aspirant) => {
        setAspirant(aspirant)
    }

    const removeAspirant = () => {
        setAspirant(null)
    }

    const handleSubmitVote = async () => {

        toast.loading('Submitting vote....')
        setLoading(true)

        try {
            const response = await fetch(
                'http://127.0.0.1:3000/api/elections/vote',
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        proposal: aspirant.email,
                        electionId: electionDetails._id
                    })
                }
            )
            if (response.status !== 200) throw new Error('Something went wrong')

            toast.dismiss()
            setVoteEvent(prevState => prevState + 1)
            setLoading(false)
            setConfirmOverlay(false)
            setAspirant(null)
            toast.success('Voted!')
        } catch (e) {
            toast.dismiss()
            setLoading(false)
            toast.error(e.message)
        }
    }
    return (
        <div className={styles.container}>
            {electionDetails.voted && <div className={styles.overlay}>
                <p style={{color: "white"}}>You already voted!</p>
            </div>}
            {confirmOverlay && <div className={styles.alertOverlay}>
                <p style={{color: "white"}}>Are you sure you want to vote
                    for {aspirant.firstName} {aspirant.lastName}?</p>
                <div className={styles.alertButton}>
                    <Button
                        loading={loading}
                        onClick={() => handleSubmitVote()}
                    >
                        Vote
                    </Button>
                    <Button
                        onClick={() => setConfirmOverlay(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </div>}
            <div className={styles.header}>
                <h1>{electionDetails.post} {electionDetails.year} Election</h1>
                <h2>Aspirants</h2>
                <p><strong>Time left to vote:</strong> {electionDetails.timeLeft}</p>
            </div>
            <div className={styles.body}>
                {electionDetails.aspirants.map((_aspirant, index) => {
                    return (
                        <div
                            className={aspirant?.email === _aspirant.email || electionDetails.votedFor?.email === _aspirant.email ? styles.aspirantContainerSelected : styles.aspirantContainer}
                            key={index}
                        >
                            <div className={styles.textContainer}>
                                <p><strong>Name:</strong> {_aspirant.firstName} {_aspirant.lastName}</p>
                                <p><strong>Email:</strong> {_aspirant.email}</p>
                            </div>
                            <div className={styles.buttonContainer}>
                                {!aspirant && !electionDetails.voted &&
                                    <Button
                                        dark
                                        onClick={() => selectHandler(_aspirant)}
                                    >Vote</Button>}
                                {!electionDetails.voted && aspirant?.email === _aspirant.email && <Button
                                    dark={false}
                                    onClick={() => removeAspirant()}
                                >Cancel</Button>}

                                {electionDetails.votedFor?.email === _aspirant.email && <Button
                                    dark={false}
                                >Already Voted</Button>}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={styles.footer}>
                <Button
                    loading={loading}
                    dark
                    disabled={!aspirant}
                    onClick={() => setConfirmOverlay(true)}
                >Submit Vote</Button>
            </div>
        </div>
    )
}

export default ElectionDetails;
