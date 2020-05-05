pragma solidity >=0.5.16;

contract Election {

    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Read/write candidates
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;

        // educational material added event
        event edMaterialAddedEvent(
        string indexed _candidateNa
    );

       // voted event
    event votedEvent(
        uint indexed _candidateId
    );

    constructor () public {

        // addCandidate("Candidate 1");
        // addCandidate("Candidate 2");
    }

    function addCandidate(string memory _candidateNa) public { //I changed this to public ,,,,
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _candidateNa, 0);

       // trigger added ed material event
      emit votedEvent(candidatesCount);
      emit edMaterialAddedEvent(_candidateNa);

    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
       emit votedEvent(_candidateId);


    }
}