import Election from "../../../models/Election";
import getContract from "../../../utils/getContract";
import convertProposalsResponseToJson from "../../../utils/convertProposalsResponseToJson";
import {web3} from "../../../constants";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    await dbConnect()
    const election = await Election.findById(req.body.id)

    if (!election) return res.status(404).end(`Not found`)

    let voterVoted = false;

    try {
        const accounts = await web3.eth.getAccounts();
        const contract = await getContract(election.contractAddress)
        const resProposals = await contract.methods.getAllProposals().call({
            from: accounts[4]
        })

        const processedProposals = convertProposalsResponseToJson(resProposals[0], resProposals[1])

        const voterSingle = election.voters.find(voter => voter.email === req.body.email)

        const voterDetails = await contract.methods.getAllVoters(voterSingle.address).call({
            from: accounts[4]
        })

        let user
        const processedAspirants = []
        for (const processedProposal of processedProposals) {
            user = await User.findOne({email: processedProposal.email})
            processedAspirants.push(
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: processedProposal.email
                }
            )
        }
        let votedFor = null

        if (voterDetails['voted__']) {
            voterVoted = true
            const voteIndex = voterDetails['vote__']
            votedFor = processedAspirants[voteIndex]
        }

        res.status(200).json({
            ...election._doc,
            aspirants: processedAspirants,
            voted: voterVoted,
            votedFor: votedFor
        })
    } catch (e) {
        res.status(500).json({message: e.message})
    }

}
