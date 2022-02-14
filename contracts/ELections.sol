pragma solidity >=0.7.0 <0.9.0;

contract Elections {

    struct Voter {
        bool voted;
        uint vote;
        uint weight;
        bytes32 email;
    }

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    struct AnnouncementFormat {
        bytes32 name;
        uint votes;
    }

    address public chairperson;

    mapping(address => Voter) public voters;

    Proposal[] public proposals;

    constructor(bytes32[] memory proposalNames) {
        chairperson = msg.sender;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
            name : proposalNames[i],
            voteCount : 0
            }));
        }
    }

    function vote(uint proposal) external {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted");
        sender.voted = true;
        sender.vote = proposal;

        proposals[proposal].voteCount += sender.weight;
    }

    function winningProposals() public view
    returns (uint winningProposal_, bytes32 winningName_)
    {
        uint winningVoteCount = 0;
        bytes32 winningName;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningName = proposals[p].name;
                winningProposal_ = p;
                winningName_ = winningName;
            }
        }
    }

    function giveRightToVote(address voter) external {
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote"
        );
        require(
            !voters[voter].voted,
            "The voter already voted"
        );
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }

    function addVoter(address voterEnroll, bytes32 incomingVoter) external
    {
        voters[voterEnroll] = Voter({
        voted : false,
        vote : 1,
        weight : 1,
        email : incomingVoter
        });
        voters.push(voterEnroll) - 1;
    }

    function getAllVoters(address voterAdr) public view
    returns (uint weight__, bool voted__, bytes32 email__, uint vote__){
        Voter storage voter = voters[voterAdr];

        weight__ = voter.weight;
        voted__ = voter.voted;
        email__ = voter.email;
        vote__ = voter.vote;
    }

}
