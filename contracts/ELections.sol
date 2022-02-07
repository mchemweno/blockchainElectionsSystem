pragma solidity >=0.4.22 <0.9.0;

contract Elections {
    string public name= "project";
    struct Voter {
        bool voted;
        uint id;
    }
}
