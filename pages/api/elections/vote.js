import getContract from "../../../utils/getContract";
import {accountIndex, web3} from "../../../constants";
import convertProposalsResponseToJson from "../../../utils/convertProposalsResponseToJson";
import Election from "../../../models/Election";
import middlewareHandler from "../../../utils/middlewareHandler";
import isAuth from "../../../utils/authUtils/isAuth";


export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    const {user} = await middlewareHandler(req, res, isAuth);

    const {proposal, electionId} = req.body

    if (!proposal || !electionId) return res.status(405).end(`Please fill in all the fields`)

    try {
        const election = await Election.findById(electionId)

        if (!election) throw new Error('Elections doesnt exist')

        try {
            const accounts = await web3.eth.getAccounts();
            const contract = await getContract(election.contractAddress)

            const userAddress = election.voters.find(voter => voter.email === user.email).address
            console.log(userAddress)

            const voterDetails = await contract.methods.getAllVoters(userAddress).call({
                from: accounts[accountIndex]
            })

            if (voterDetails['voted__']) throw new Error('You have already voted');

            const res = await contract.methods.getAllProposals().call({
                from: accounts[accountIndex]
            })

            const proposals = convertProposalsResponseToJson(res[0], res[1])
            const proposalInt = proposals.map(_proposal => _proposal.email).indexOf(proposal)

            if (proposalInt < 0) throw new Error('No aspirant by that email')

            await contract.methods.vote(proposalInt, userAddress).send({
                from: accounts[accountIndex]
            })
        } catch (e) {
            throw new Error(e.message)
        }
        res.status(200).json({message: "Voted"})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

