import Web3 from "web3"
import ABI from "web3-eth-abi"
import deployContract from "../../../utils/deployContract";
import {etherHost} from "../../../constants";

export default async function handler(req, res) {
    const web3 = new Web3(etherHost);
    const voters = [
        {email: 'mark'}, {email: 'krystal'}, {email: 'lena'}, {email: 'nau'}, {email: 'chiu'}
    ]
    const contract = await deployContract([web3.utils.toHex('mark')])
    let isError = false;
    let e1 = null

    let processedVoters = [];
    const accounts = await web3.eth.getAccounts();

    for (let voter of voters) {
        try {
            let address
            address = await web3.eth.personal.newAccount('test')
            await web3.eth.personal.unlockAccount(address, 'test', 30000000000000000000000)
            await contract.methods.addVoter(address, web3.utils.toHex(voter.email)).send({
                from: accounts[4]
            })
            processedVoters.push({...voter, address})
        } catch (e) {
            e1 = e
            isError = true
        }
    }

    if (isError) return res.status(405).json(e1.message)

    res.status(200).json(processedVoters)
}
