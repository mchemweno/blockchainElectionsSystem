import {useSelector} from "react-redux";
import Layout from "../../components/layout/Layout";
import {useEffect, useState} from "react";
import {toast, Toaster} from "react-hot-toast";
import styles from "./Votes.module.css";
import ElectionDetails from "../../components/electionDetails/ElectionDetails";


const Votes = () => {
    const user = useSelector(state => state.user)

    const [election, setElection] = useState(null);
    const [elections, setElections] = useState(null)
    const [optionsVisible, setOptionsVisible] = useState(false)
    const [electionDetails, setElectionDetails] = useState(null)
    const [voteEvent, setVoteEvent] = useState(1)

    const electionSelectionHandler = (election) => {
        setOptionsVisible(false)
        setElection(election)
    }

    useEffect(async () => {
        if (election) {
            toast.loading('Fetching election....')

            try {
                const response = await fetch(
                    'http://127.0.0.1:3000/api/elections/getElectionVotingDetails',
                    {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: election._id,
                            email: user.email
                        })
                    }
                )
                if (response.status !== 200) throw new Error('Something went wrong')

                const resData = await response.json();
                setElectionDetails(resData)


                toast.dismiss()
                toast.success('Election fetched!')
            } catch (e) {
                toast.dismiss()
                toast.error(e.message)
            }
        }
    }, [election, voteEvent])

    useEffect(async () => {
        toast.loading('Fetching elections....')

        try {
            const response = await fetch(
                'http://127.0.0.1:3000/api/elections/getElectionsByVoter',
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: user.email
                    })
                }
            )
            if (response.status !== 200) throw new Error('Something went wrong')

            const resData = await response.json();
            setElections(resData)

            toast.dismiss()
            toast.success('Elections fetched!')
        } catch (e) {
            toast.dismiss()
            toast.error(e.message)
        }
    }, [])
    return (
        <Layout>
            <Toaster/>
            {elections && <div>
                <div className={styles.selectorContainer}>
                    <div className={styles.radioContainer}>
                        <div className={styles.radioOptions}>
                            <div className={styles.toggle}
                                 onClick={() => setOptionsVisible(true)}>{election ? `${election.post} ${election.year}` : 'Select Election'}</div>
                            {optionsVisible && <ul>
                                {elections.map((election, index) => {
                                    return (
                                        <li key={index} onClick={() => electionSelectionHandler(election)}>
                                            <div onClick={() => setElection(election)}>
                                                <input
                                                    type="radio"
                                                    value={election.id}
                                                />
                                            </div>
                                            <label htmlFor={election.id}>{election.post} {election.year}</label>
                                        </li>
                                    )
                                })}

                            </ul>}
                        </div>
                    </div>
                </div>
            </div>}
            {electionDetails && <ElectionDetails electionDetails={electionDetails} setElectionDetails={setElectionDetails} setVoteEvent={setVoteEvent}/>}
        </Layout>
    )
}


export default Votes;
