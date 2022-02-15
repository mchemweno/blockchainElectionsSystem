import {abi, web3} from "../constants";

const getContract = async (address) => {
    const contract = await new web3.eth.Contract(
        abi,
        address
    )
    return contract;
}

export default getContract;
