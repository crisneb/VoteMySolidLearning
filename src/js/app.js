
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  votEvent : false,
  uploadedEvent : false,

  init: function() {
    //TODO: Load winners materials from election
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

//----delete this up ^ 

    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();  //comented it out for testing purposes
    
      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
 
      //listen for added material event
      // var materialEvent = instance.edMaterialAddedEvent();
      // materialEvent.watch(function(error, result) {
      //   console.log("Added material event triggered", event);
      //   App.render();

      // });


      //listen for vote event
      var votedEvent = instance.votedEvent();
      votedEvent.watch(function(error, result1) {
        console.log("vote event triggered", event)
        App.render();

      });

    });
  },


  render: function() {
    //App.listenForEvents(); //testing delete if not working
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    var revandVote = $("#revandVote");
    var thankyouVoted = $("#thankyouVoted");
    var votingInProgress =$("#votingInProgress");

   
    loader.show();
    content.hide();
    thankyouVoted.hide();
    votingInProgress.hide();
    


    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
        //$("#candidateName1").html("Winner: ");

      }
    });


    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {





      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();


      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();


      for (var i = 1; i <= candidatesCount; i++) {


        electionInstance.candidates(i).then(function(candidate) { 
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });

      }

      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {

        $('form').hide();
        $("#thankyouVoted").show();
        $("#votingInProgress").show();
        $("#revandVote").hide();
  
      }
      loader.hide();
      content.show();


    }).catch(function(error) {
      console.warn(error);
    });
  },



  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    
    }).catch(function(err) {
      console.error(err);
    });
  },


  addCandidate: function() {

    var candidateNa = $('#candidateName').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.addCandidate(candidateNa, { from: App.account });
     })

  },

  //TODO pic winner 
  pickWinner: function() {
    App.contracts.Election.deployed().then(function(instance) {
      return instance.pickWinner({ from: App.account });
      //console.log(instance.pickWinner())
     })

        
    }



//TODO: Mark the election as begin 
  // beginLottery: function() {


  //       // TODO: trigger election

  //       // TODO: Schedule the picking of the winner.

  //       // bytes4 sig = bytes4(sha3("pickWinner()"));
  //       // //TODO:  approximately 24 hours from electing begin
  //       // uint targetBlock = block.number + 5760;
  //       // // 0x1991313 is the ABI signature computed from `bytes4(sha3("scheduleCall(...)"))`.
  //       // electionInstance.call(0x1991313, address(this.accountAddress), sig, targetBlock)

  //   }


};


$(function() {
  $(window).load(function() {
    App.init();
  });
});















//---------------if the abvobe fails revert to the below ;) ---------------------------


// App = {
//   web3Provider: null,
//   contracts: {},
//   account: '0x0',
//   hasVoted: false,
//   votEvent : false,
//   uploadedEvent : false,

//   init: function() {
//     return App.initWeb3();
//   },

//   initWeb3: function() {
//     // TODO: refactor conditional
//     if (typeof web3 !== 'undefined') {
//       // If a web3 instance is already provided by Meta Mask.
//       App.web3Provider = web3.currentProvider;
//       web3 = new Web3(web3.currentProvider);
//     } else {
//       // Specify default instance if no web3 instance provided
//       App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
//       web3 = new Web3(App.web3Provider);
//     }

//     return App.initContract();
//   },

//   initContract: function() {
//     $.getJSON("Election.json", function(election) {
//       // Instantiate a new truffle contract from the artifact
//       App.contracts.Election = TruffleContract(election);
//       // Connect provider to interact with contract
//       App.contracts.Election.setProvider(App.web3Provider);

//       App.listenForEvents();  //comented it out for testing purposes
    
//       return App.render();
//     });
//   },

//   // Listen for events emitted from the contract
//   listenForEvents: function() {
//     App.contracts.Election.deployed().then(function(instance) {

//       // var materialEvent = instance.edMaterialAddedEvent({}, {fromBlock: 0, toBlock: 'latest'});

//       // materialEvent.watch(function(error, result) {
//       //   if(!error) {

//       //     edMaterial = true;
//       //     console.log("Material event triggered " + edMaterial);

//       //   }

//       // // if(edMaterial == true){
//       // //   App.render();
//       // // }

//       // });

//       // Restart Chrome if you are unable to receive this event
//       // This is a known issue with Metamask
//       // https://github.com/MetaMask/metamask-extension/issues/2393

 
//       //listn for added material event
//       var materialEvent = instance.edMaterialAddedEvent();
//       materialEvent.watch(function(error, result) {
//         console.log("Added material event triggered", event);
//         App.render();

//       });


//       //listen for voted event
//       var votedEvent = instance.votedEvent();
//       votedEvent.watch(function(error, result1) {
//         console.log("vote event triggered", event)
//         App.render();

//       });


//       //ed material event
//       // instance.edMaterialAddedEvent({}, {
//       //   fromBlock: 680,
//       //   toBlock: 'latest'
//       // }).watch(function(error, event) {
//       //   console.log("ed Material Added event triggered", event)
//       //   // Reload when a new vote is recorded
//       //   App.render();
//       // });



//       // instance.votedEvent({}, {
//       //   fromBlock: 0,
//       //   toBlock: 'latest'
//       // }).watch(function(error, event) {
//       //   console.log("vote event triggered", event)
//       //   // Reload when a new vote is recorded
//       //   App.render();
//       // });

//     });
//   },


//   render: function() {
//     //App.listenForEvents(); //testing delete if not working
//     var electionInstance;
//     var loader = $("#loader");
//     var content = $("#content");
//     var revandVote = $("#revandVote");
//     var thankyouVoted = $("#thankyouVoted");

   
//     loader.show();
//     content.hide();
//     thankyouVoted.hide();
    

//     // Load account data
//     web3.eth.getCoinbase(function(err, account) {
//       if (err === null) {
//         App.account = account;
//         $("#accountAddress").html("Your Account: " + account);
//         //$("#candidateName1").html("Winner: ");
//       }
//     });


//     // Load contract data
//     App.contracts.Election.deployed().then(function(instance) {
//       electionInstance = instance;
//       return electionInstance.candidatesCount();
//     }).then(function(candidatesCount) {

//       var candidatesResults = $("#candidatesResults");
//       candidatesResults.empty();


//       var candidatesSelect = $('#candidatesSelect');
//       candidatesSelect.empty();


//       for (var i = 1; i <= candidatesCount; i++) {
//         electionInstance.candidates(i).then(function(candidate) { 
//           var id = candidate[0];
//           var name = candidate[1];
//           var voteCount = candidate[2];

//           // Render candidate Result
//           var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
//           candidatesResults.append(candidateTemplate);

//           // Render candidate ballot option
//           var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
//           candidatesSelect.append(candidateOption);
//         });
//       }
//       return electionInstance.voters(App.account);
//     }).then(function(hasVoted) {
//       // Do not allow a user to vote
//       if(hasVoted) {

//         $('form').hide();
//         $("#thankyouVoted").show();
//         $("#revandVote").hide();
  
//       }
//       loader.hide();
//       content.show();


//     }).catch(function(error) {
//       console.warn(error);
//     });
//   },

//   castVote: function() {
//     var candidateId = $('#candidatesSelect').val();
//     App.contracts.Election.deployed().then(function(instance) {
//       return instance.vote(candidateId, { from: App.account });
//     }).then(function(result) {
//       // Wait for votes to update
//       $("#content").hide();
//       $("#loader").show();

    
//     }).catch(function(err) {
//       console.error(err);
//     });
//   },


//   addCandidate: function() {

//     var candidateNa = $('#candidateName').val();
//     App.contracts.Election.deployed().then(function(instance) {
//       return instance.addCandidate(candidateNa, { from: App.account });
//      }).then(function(result) { // added for testing ..
//       // Wait for table to update
//       $("#content").hide();
//       $("#loader").show();
//     }).catch(function(err) {
//       console.error(err);
//     });

//   }

// };


// $(function() {
//   $(window).load(function() {
//     App.init();
//   });
// });