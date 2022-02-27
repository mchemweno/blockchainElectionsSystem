import deployContract from "../../../utils/deployContract";
import {web3} from "../../../constants";
import User from "../../../models/User";
import Election from "../../../models/Election";
import dbConnect from "../../../utils/dbConnect";


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    await dbConnect()

    const { voters, aspirants, year, post} = req.body

    const electionExists = await Election.findOne({post: req.body.post, year: req.body.year})

    if (electionExists) return res.status(403).end(`Election exists`)

    for (let aspirant of aspirants) {
        const aspirantExists = await User.findOne({email: aspirant.email, active: true})
        if (!aspirantExists) return res.status(401).end(`Aspirant not in the database`)
    }

    const election = new Election({
        year,
        post,
    })


    try {
        const contract = await deployContract(
            aspirants.map(aspirant => web3.utils.toHex(aspirant.email))
        )

        let processedVoters = [];
        try {
            const accounts = await web3.eth.getAccounts();

            for (let voter of voters) {

                let address
                address = await web3.eth.personal.newAccount('test')
                await web3.eth.personal.unlockAccount(address, 'test', 30000000000000000000000)
                await contract.methods.addVoter(address, web3.utils.toHex(voter.email)).send({
                    from: accounts[4]
                })
                processedVoters.push({...voter, address})
            }

            election.voters = processedVoters
            election.contractAddress = contract._address
            await election.save()
        } catch (e) {
            throw new Error(e.message)
        }

        res.status(201).end('Created')
    } catch (e) {
        res.status(500).json({error: e.message})
    }


}
