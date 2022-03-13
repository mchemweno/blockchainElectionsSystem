import Web3 from "web3";
import {abi, binary, myEther, web3} from "../constants";


const deployContract = async (aspirants, duration) => {
    try {
        const contract = await new web3.eth.Contract(
            abi,
        ).deploy({
            data: '0x' + binary,
            arguments: [aspirants, (duration * 60 * 60)]
        })
            .send({
                from: myEther,
                gasPrice: 1,
                gas: 5500000
            })

        return contract
    } catch (err) {
        throw new Error(err.message);
    }


}

export default deployContract
