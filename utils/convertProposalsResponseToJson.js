import {web3} from "../constants";

const convertProposalsResponseToJson = (emails, votes) => {

    const proposals = []

    emails.forEach((email, index) => {
        proposals.push({
            email: web3.utils.hexToString(email),
            votes: votes[index]
        })
    })

    return proposals
}

export default convertProposalsResponseToJson;
