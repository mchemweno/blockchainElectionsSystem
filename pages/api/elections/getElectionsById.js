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

    await middlewareHandler(req, res, isAuth);

    await dbConnect()
    const election = await Election.findById(req.body.id)

    if (!election) return res.status(404).end(`Not found`)

    let voterCount = 0;

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

        const winningProposal = await contract.methods.winningProposals().call({
            from: accounts[accountIndex]
        })

        for (let voter of election.voters) {
            const voterDetails = await contract.methods.getAllVoters(voter.address).call({
                from: accounts[accountIndex]
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
            winner: winningProposal['winningVoteCount_'] > 0 && resProposals[2] ? web3.utils.hexToString(winningProposal['winningName_']) : null,
            winningVotes: winningProposal['winningVoteCount_'] > 0 && resProposals[2] ? winningProposal['winningVoteCount_'] : null,
            completed: resProposals[2],
            timeLeft :  new Date(resProposals[3] * 1000).toISOString().slice(11, 19)
        })
    } catch (e) {
        res.status(500).json({message: e.message})
    }

}
