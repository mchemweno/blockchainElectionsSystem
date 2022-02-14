import Web3 from "web3";
import {abi, binary, myEther} from "../constants";


const deployContract = async (constructorArguments) => {
    const web3 = new Web3("http://localhost:7545");
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
}

export default deployContract
