import styles from './Summary.module.css'
import Button from "../../ui/Button/Button";

const Summary = ({electionDetails ,participants ,voters, setVisibility, deployElections}) => {
    return (
        <div className={styles.Container}>
            <h2>Election Post:{electionDetails.post}</h2>
            <h2>Year:             {electionDetails.year}</h2>
            <h2>Number of Voters: {voters.length}</h2>
            <h2>Participants:</h2>
            <div className={styles.participantsContainer}>
                {participants.map((participant, index) => <p key={participant.id}>{participant.email}</p>)}
            </div>

            <div style={{display: "flex", justifyContent: 'space-around', alignItems: 'center', width: '50rem'}}>
                <Button
                    type="button"
                    dark
                    onClick={() => setVisibility({
                        addDetails: false,
                        addParticipants: false,
                        addVoters: true,
                        summary: false
                    })}
                    // disabled={!(participants.length > 1)}
                >
                    Back
                </Button>
                <Button
                    type="button"
                    dark
                    disabled={voters === null}
                    onClick={() => deployElections()}
                >
                    Deploy
                </Button>
            </div>
        </div>
    )
}

export default Summary;
