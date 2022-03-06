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

    let voterCount = 0;

    try {
        const accounts = await web3.eth.getAccounts();
        const contract = await getContract(election.contractAddress)
        const resProposals = await contract.methods.getAllProposals().call({
            from: accounts[4]
        })

        const processedProposals = convertProposalsResponseToJson(resProposals[0], resProposals[1])

        const winningProposal = await contract.methods.winningProposals().call({
            from: accounts[4]
        })

        for (let voter of election.voters) {
            const voterDetails = await contract.methods.getAllVoters(voter.address).call({
                from: accounts[4]
            })

            if (voterDetails['voted__']) voterCount++
        }
        let user
        const processedAspirants = []
        for (const processedProposal of processedProposals) {
            user = await User.findOne({email: processedProposal.email})
            processedAspirants.push(
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    ...processedProposal
                }
            )
        }

        res.status(200).json({
            ...election._doc,
            aspirants: processedAspirants,
            voted: voterCount,
            winner: winningProposal['winningVoteCount_'] > 0 && election.completed ? web3.utils.hexToString(winningProposal['winningName_']) : null,
            winningVotes: winningProposal['winningVoteCount_'] > 0 && election.completed ? winningProposal['winningVoteCount_'] : null
        })
    } catch (e) {
        res.status(500).json({message: e.message})
    }

}
