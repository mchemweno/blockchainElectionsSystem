import getContract from "../../../utils/getContract";
import {web3} from "../../../constants";


export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const {address, proposal, userAddress} = req.body

    if (!address || !proposal) return res.status(405).end(`Please fill in all the fields`)

    try {
        const accounts = await web3.eth.getAccounts();
        const contract = await getContract(address)

        await contract.methods.vote(proposal, userAddress).send({
            from: accounts[4]
        })
    } catch (e) {
        res.status(500).json("Something went wrong")
    }

    res.status(200).json({message: ""})
}

