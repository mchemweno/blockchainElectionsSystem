import Web3 from "web3";
import {abi, binary, myEther, web3} from "../constants";


const deployContract = async (constructorArguments) => {
    try {
        const contract = await new web3.eth.Contract(
            abi,
        ).deploy({
            data: '0x' + binary,
            arguments: [constructorArguments]
        })
            .send({
                from: myEther,
                gasPrice: '20000000000',
                gas: 900000
            })

        return contract
    } catch (err) {
        throw new Error(err.message);
    }


}

export default deployContract
