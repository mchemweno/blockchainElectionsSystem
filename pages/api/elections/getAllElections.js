import Election from "../../../models/Election";
import convertProposalsResponseToJson from "../../../utils/convertProposalsResponseToJson";
import getContract from "../../../utils/getContract";
import {accountIndex, web3} from "../../../constants";
import dbConnect from "../../../utils/dbConnect";
import middlewareHandler from "../../../utils/middlewareHandler";
import isAuth from "../../../utils/authUtils/isAuth";

export default async function handler(req, res) {

    if (req.method !== 'GET') {
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    await middlewareHandler(req, res, isAuth);
    await dbConnect()

    const elections = await Election.find()

    if (!elections) return res.status(404).end(`Not found`)

    try {
        const accounts = await web3.eth.getAccounts();
        let resProposals
        let processedProposals
        let contract
        const processedElections = []
        let winningProposal
        let voterCount = 0

        for (let election of elections) {
            contract = await getContract(election.contractAddress)
            await contract.methods.updateTime().send({
                from: accounts[accountIndex]
            })
            resProposals = await contract.methods.getAllProposals().call({
                from: accounts[accountIndex]
            })

            winningProposal = await contract.methods.winningProposals().call({
                from: accounts[accountIndex]
            })

            processedProposals = convertProposalsResponseToJson(resProposals[0], resProposals[1])

            for (let voter of election.voters) {
                const voterDetails = await contract.methods.getAllVoters(voter.address).call({
                    from: accounts[accountIndex]
                })

                if (voterDetails['voted__']) voterCount++
            }

            processedElections.push({
                ...election._doc,
                aspirants: processedProposals,
                winner: winningProposal['winningVoteCount_'] > 0 ? web3.utils.hexToString(winningProposal['winningName_']) : null,
                winningVotes: winningProposal['winningVoteCount_'] > 0 ? winningProposal['winningVoteCount_'] : null,
                voted: voterCount,
                completed: resProposals[2],
                timeLeft :  new Date(resProposals[3] * 1000).toISOString().slice(11, 19)
            })

            voterCount = 0
        }

        res.status(200).json(processedElections)
    } catch (e) {
        res.status(500).json({message: e.message})
    }

}
