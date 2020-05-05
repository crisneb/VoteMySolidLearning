pragma solidity >=0.5.16;

contract Election{

    //Will model a learning material candidate
    struct Candidate {
        //TODO: Add more attribtes. Author, Price, Description
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Read/write candidates
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount; //changed to = 0

    // educational material added event
    // event edMaterialAddedEvent(
    //     string name
    // );

    //Trigress when a vote is addred
    event votedEvent(
        uint indexed id
    );

    constructor () public {
    }

    function addCandidate(string memory name) public { 
    	 
        candidatesCount ++;
        //candidates[candidatesCount] = Candidate(candidatesCount, _candidateNa, 0);
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);

       //trigger added ed material event
      //emit edMaterialAddedEvent(name);

    }

    function vote (uint id) public {
        	id = id;
        // require that they haven't voted beforecandidates[candidatesCount].name()
        require(!voters[msg.sender]);

        // require a valid candidate
        require(id > 0 && id <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[id].voteCount ++;

        // trigger voted event
       emit votedEvent(id);

    }

   /// TODO: in app.js Computes the winning proposal taking all
    /// previous votes into account.
    function winningCandidate() public view
            returns (uint candidateIndex)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p <= candidatesCount; p++) {
            if (candidates[p].voteCount > winningVoteCount) {
                winningVoteCount = candidates[p].voteCount;
                
                candidateIndex = p;
            }
        }
    }

    // TODO: In App.js  function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function pickWinner() public view returns (string memory name)
    {
        name = candidates[winningCandidate()].name;
    }


}