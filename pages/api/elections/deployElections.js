import deployContract from "../../../utils/deployContract";
import {web3} from "../../../constants";


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const {voters, aspirants} = req.body
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

        } catch (e) {
            throw new Error(e.message)
        }

        res.status(201).json(processedVoters)
    } catch (e) {
        res.status(500).json({error: e.message})
    }


}
