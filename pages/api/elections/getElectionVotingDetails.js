import Election from "../../../models/Election";
import getContract from "../../../utils/getContract";
import convertProposalsResponseToJson from "../../../utils/convertProposalsResponseToJson";
import {accountIndex, web3} from "../../../constants";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import middlewareHandler from "../../../utils/middlewareHandler";
import isAuth from "../../../utils/authUtils/isAuth";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const {user} =await middlewareHandler(req, res, isAuth);

    await dbConnect()
    const election = await Election.findById(req.body.id)

    if (!election) return res.status(404).end(`Not found`)

    let voterVoted = false;

    try {
        const accounts = await web3.eth.getAccounts();
        const contract = await getContract(election.contractAddress)
        await contract.methods.updateTime().send({
            from: accounts[accountIndex]
        })
        const resProposals = await contract.methods.getAllProposals().call({
            from: accounts[accountIndex]
        })

        const processedProposals = convertProposalsResponseToJson(resProposals[0], resProposals[1])

        const voterSingle = election.voters.find(voter => voter.email === user.email)

        const voterDetails = await contract.methods.getAllVoters(voterSingle.address).call({
            from: accounts[accountIndex]
        })

        let user1
        const processedAspirants = []
        for (const processedProposal of processedProposals) {
            user1 = await User.findOne({email: processedProposal.email})
            processedAspirants.push(
                {
                    firstName: user1.firstName,
                    lastName: user1.lastName,
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
            votedFor: votedFor,
            completed: resProposals[2],
            timeLeft :  new Date(resProposals[3] * 1000).toISOString().slice(11, 19)
        })
    } catch (e) {
        res.status(500).json({message: e.message})
    }

}
