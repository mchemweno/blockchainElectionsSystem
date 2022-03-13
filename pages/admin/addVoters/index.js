import {useEffect, useState} from "react";
import Layout from "../../../components/layout/Layout";
import AddElections from "../../../components/addElections/AddElections";
import styles from './AddVoters.module.css'
import AddParticipants from "../../../components/addParticipants/AddParticipants";
import AddVoters from "../../../components/addVoters/AddVoters";
import Summary from "../../../components/summary/Summary";
import {toast, Toaster} from "react-hot-toast";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";


const Index = () => {
    const router = useRouter();
    const user = useSelector(state => state.user)
    const pposts = ['President', 'IT Representative', 'Sports Representative']
    const [electionDetails, setElectionDetails] = useState({
        'election name': '',
        year: 2022,
        post: pposts[0],
        duration: 1
    })
    const [voters, setVoters] = useState(null)
    const [participants, setParticipants] = useState([])
    const [visibility, setVisibility] = useState({
        addDetails: true,
        addParticipants: false,
        addVoters: false,
        summary: false
    })

    const deployElections = async () => {
        toast.loading('Please be patient....')
        try {
            const response = await fetch(
                `http://127.0.0.1:3000/api/elections/deployElections`,
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        voters,
                        aspirants: participants,
                        post: electionDetails.post,
                        year: electionDetails.year,
                        duration: electionDetails.duration
                    }),
                }
            )

            if (response.status !== 201) throw new Error(response.statusText)

            toast.dismiss()
            toast.success('Deployed!')
            await router.replace('/admin')

        } catch (e) {
            toast.dismiss()
            toast.error(e.message)
        }
    }


    useEffect(() => {
    }, [])
    return (
        <Layout>
            <Toaster/>
            <div className={styles.Container}>
                {visibility.addDetails &&
                    <AddElections pposts={pposts} electionDetails={electionDetails}
                                  setElectionDetails={setElectionDetails}
                                  setVisibility={setVisibility}/>}
                {visibility.addParticipants &&
                    <AddParticipants setParticipants={setParticipants} participants={participants}
                                     setVisibility={setVisibility}/>}
                {visibility.addVoters &&
                    <AddVoters voters={voters} setVoters={setVoters} setVisibility={setVisibility}/>}
                {visibility.summary &&
                    <Summary electionDetails={electionDetails} participants={participants} voters={voters}
                             deployElections={deployElections} setVisibility={setVisibility}/>}
            </div>
        </Layout>
    )
}


export default Index;
