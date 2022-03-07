import Layout from "../../components/layout/Layout";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Button from "../../ui/Button/Button";
import styles from './Admin.module.css'
import {toast, Toaster} from "react-hot-toast";

const Admin = () => {
    const user = useSelector(state => state.user)
    const router = useRouter();
    const [elections, setElections] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!user.admin) {
            router.replace('/votes')
        }
    }, [])

    useEffect(async () => {
        toast.loading('Fetching elections....')
        setLoading(true)
        try {
            const response = await fetch(
                'http://127.0.0.1:3000/api/elections/getAllElections',
                {
                    method: 'GET',
                    headers:{Authorization: `Bearer ${user.token}`}
                }
            )
            if (response.status !== 200) throw new Error('Something went wrong')

            const resData = await response.json();
            setElections(resData)

            setLoading(false)
            toast.dismiss()
            toast.success('Elections fetched!')
        } catch (e) {
            setLoading(false)
            toast.dismiss()
            toast.error(e.message)
        }
    }, [])
    return (
        <Layout>
            <Toaster/>
            <div className={styles.Button}>
                <h2>Elections</h2>
                <Button dark onClick={() => router.push(`${router.route}/addVoters`)}>Deploy Elections</Button>
            </div>
            <div className={styles.Container}>
                <div>
                    {
                        elections &&
                        elections.map((election, index) => {
                            return (
                                <div onClick={() => router.push(`/admin/elections/${election._id}`)}
                                    key={index} className={styles.ElectionContainer}>
                                    <div style={{display:"flex", justifyContent: 'space-between', marginRight:'5rem'}}>
                                        <h2>{election.year} {election.post} Elections</h2>
                                        <p><strong>Voters:</strong> {election.voted}/{election.voters.length}</p>
                                    </div>
                                    <p><strong>Status:</strong> {election.completed ? '' : 'Not'} Completed</p>
                                    <h1>Aspirants:</h1>
                                    <div className={styles.AspirantsContainer}>
                                        {election.aspirants.map((aspirant, index) => {
                                            return <p key={index}>{aspirant.email}</p>
                                        })}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </Layout>
    )
}

export default Admin;
