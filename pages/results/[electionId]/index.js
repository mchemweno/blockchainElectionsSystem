import Layout from "../../../components/layout/Layout";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {toast, Toaster} from "react-hot-toast";
import styles from './ResultDetails.module.css'
import {useSelector} from "react-redux";


const ResultsDetail = () => {
    const user = useSelector(state => state.user)
    const router = useRouter();
    const [election, setElection] = useState(null)
    const {electionId} = router.query

    useEffect(async () => {
        toast.loading('Fetching election....')

        try {
            const response = await fetch('http://127.0.0.1:3000/api/elections/getElectionsById', {
                method: 'POST', headers: {
                    'content-type': 'application/json', Authorization: `Bearer ${user.token}`
                }, body: JSON.stringify({
                    id: electionId
                })
            })
            if (response.status !== 200) throw new Error('Something went wrong')

            const resData = await response.json();
            setElection(resData)

            toast.dismiss()
            toast.success('Election fetched!')
        } catch (e) {
            toast.dismiss()
            toast.error(e.message)
        }
    }, [])
    return (<Layout>
            <Toaster/>
            {election && <div className={styles.Container}>
                <h1>
                    Election Details
                </h1>
                <h2>
                    {election.year} {election.post} Elections
                </h2>
                <div className={styles.StatusWinner}>
                    <p><strong>Status:</strong> {election.completed ? '' : 'Not'} Completed</p>
                    <p><strong>Winner:</strong> {election.completed ? election.winner : 'N/A'}</p>
                    <p><strong>Winning Votes:</strong> {election.completed ? election.winningVotes : 'N/A'}</p>
                </div>
                <div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}} className={'w-2/3'}>
                        <p><strong>Total Voters:</strong> {election.voters.length}</p>
                        <p><strong>Turnout:</strong> {(election.voted / election.voters.length * 100)}%</p>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}} className={'w-2/3'}>
                        <p><strong>Total Voted:</strong> {election.voted}</p>
                        <p><strong>Time left:</strong> {election.timeLeft}</p>
                    </div>
                </div>
                <h1>Tally:</h1>
                <div className={styles.AspirantsContainer}>
                    {election.aspirants.map((aspirant, index) => {
                        return (<div
                                key={index}
                                className={styles.AspirantContainer}
                            >
                                <p><strong>Name:</strong> {aspirant.firstName} {aspirant.lastName}</p>
                                <p><strong>Email:</strong> {aspirant.email}</p>
                                <p><strong>Votes:</strong> {aspirant.votes}</p>
                            </div>)
                    })}
                </div>
            </div>}
        </Layout>)
}


export default ResultsDetail;
