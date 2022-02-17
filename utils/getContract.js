import {abi, web3} from "../constants";

const getContract = async (address) => {
    try {
        const contract = await new web3.eth.Contract(
            abi,
            address
        )
        return contract;
    } catch (e) {
        throw new Error(e.message)
    }

}

export default getContract;
