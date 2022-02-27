import getContract from "../../../utils/getContract";
import {web3} from "../../../constants";
import convertProposalsResponseToJson from "../../../utils/convertProposalsResponseToJson";


export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const {address, proposal, userAddress} = req.body

    if (!address || !proposal) return res.status(405).end(`Please fill in all the fields`)

    try {
        try {
            const accounts = await web3.eth.getAccounts();
            const contract = await getContract(address)

            const voterDetails = await contract.methods.getAllVoters(userAddress).call({
                from: accounts[4]
            })

            if (voterDetails['voted__']) throw new Error('You have already voted');

            const res = await contract.methods.getAllProposals().call({
                from: accounts[4]
            })

            const proposals = convertProposalsResponseToJson(res[0], res[1])
            const proposalInt = proposals.map(_proposal => _proposal.email).indexOf(proposal)

            if (proposalInt < 0) throw new Error('No aspirant by that email')

            await contract.methods.vote(proposalInt, userAddress).send({
                from: accounts[4]
            })
        } catch (e) {
            throw new Error(e.message)
        }
        res.status(200).json({message: "Voted"})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

