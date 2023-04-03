// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

// ADD 5% Royalty
// ADD STATIC Variable method
// Attention royalty check par rapport à blur.



contract MiningInvestTicketsNFT is ERC721URIStorage, Ownable, ReentrancyGuard{
    using Counters for Counters.Counter;


    IERC721 public immutable MintTicketNftCollection;

    enum WorkflowStatus {
        Initialized,
        MintTicketsRegistrationStarted,
        MintTicketsRegistrationEnded,
        DAOTeamSignatureCompleted,
        RunningNoClaim,
        RunningWithClaim,
        CanceledMinimumTicketsNotReach,
        Stopped
    }

    struct InvestTicket {
        address investTicketOwner;
        uint256 tokenId;
        bool isStaked;
    }

    struct InvestTicketsStaked {
        Counters.Counter amountOfTicketStaked;
        mapping(uint => InvestTicket) stakedInvestTickets;
    }

    struct OfferTicket {
        address ticketOwner;
        uint256 power;
        Counters.Counter unclaimedMonths;
        uint256 unclaimedValue;
        uint256 timeOfLastRewardUpdate;
    }

    struct LinkedListInvestTicket {
        uint previousIndex;
        InvestTicket ticket;
        uint nextIndex;
    }

    // GLOBAL

    address DAOWallet;
    address[] DAOTeamWallets;
    address treasuryWallet;
    string name;
    string reference;
    mapping(address => bool) whitelisted;

    WorkflowStatus public workflowStatus;

    // PHASE 1
    uint minimumTickets;
    uint maximumTickets;
    Counters.Counter ticketsCounter;
    uint lockTimeLimit;
    LinkedListInvestTicket linkedListHead;
    LinkedListInvestTicket LinkedListLast;
    LinkedListInvestTicket[] stakerList;
    mapping(address => InvestTicketsStaked) investTicketsStaked;


    // PHASE 2
    uint256 timeOfLastRewardUpdate;
    uint256 totalTHPower;
    OfferTicket[] offerOwnersList;
    mapping(address => OfferTicket) public offerTicketOwners;

    event InvestTicketsStaked(InvestTicket ticket);
    event InvestTicketsUnstaked(InvestTicket ticket);
    event RewardClaimed(OfferTicket ticket);
    event WorkflowStatusChanged(WorkflowStatus previous, WorkflowStatus current);

    //CONSTRUCTOR
    constructor(
        address _mintTicketNftCollectionAddress,
        string _name,
        string _reference,
        string _collectionName,
        address _DAOWallet,
        address[] _DAOTeamWallets,
        address _treasuryWallet,
        uint _minimumTickets,
        uint _maximumTickets,
        uint _lockTimeLimit
    ) ERC721(_collectionName, _reference){
        mintTicketNftCollection = IERC721(_mintTicketNftCollectionAddress);
        name = _name;
        reference = _reference;
        DAOWallet = _DAOWallet;
        DAOTeamWallets = _DAOTeamWallets;
        treasuryWallet = _treasuryWallet;
        minimumTickets = _minimumTickets;
        maximumTickets = _maximumTickets;
        lockTimeLimit = _lockTimeLimit;

        whitelisted[_DAOWallet] = true;
        for(uint i = 0; i < _DAOTeamWallets.length; i++){
            whitelisted[_DAOTeamWallets[i]] = true;
        }
    }

    //MODIFIER CHECK whitelistedOwner
    modifier isWhitelisted() {
        require(whitelisted[msg.sender] == true, "You are not whitelisted");
        _;
    }

    //MODIFIER CHECK isInvestTicketStaker
    modifier isInvestTicketStacker() {
        require(investTicketStaked[msg.sender] == true, "You are not a Ticket Staked");
        _;
    }

    //MOFICIER CHECK isOfferTicketOwner
    modifier isOfferTicketOwner() {
        require(offerTicketOwners[msg.sender] == true, "You are not an offer ticket owner");
        _;
    }

    //STAKE INVEST TICKET METHOD
    function stakeTicket(uint _tokenId) external {
        require(workflowStatus == WorkflowStatus.MintTicketsRegistrationStarted, "Staking is not authorized anymore");
        require(!investTicketsStaked[msg.sender].stakedInvestTickets[_tokenId].isStaked, "Ticket already staked");
        MintTicketNftCollection.stakeTicket(_tokenId);
        InvestTicket memory investTicket = InvestTicket(msg.sender, _tokenId, true);
        investTicketsStaked[msg.sender].amountOfTicketStaked.increment();
        investTicketsStaked[msg.sender].stakedInvestTickets[_tokenId] = investTicket;

        LinkedListInvestTicket item;
        if(!head.isStaked) {
            item = LinkedListInvestTicket(-1,investTicket,-1);
            linkedListHead = item;
        }else {
            item = LinkedListInvestTicket(linkedListLast,investTicket,-1);
            linkedListLast.nextIndex = item.ticket.tokenId;
        }
        stakerList[_tokenId] = item;
        linkedListLast = item;

        ticketsCounter.increment();
        if(ticketsCounter == maximumTickets){
            mintTicketRegistrationEnded();
        }
        emit InvestTicketStaked(item);
    }

    //UNSTAKE INVEST TICKET METHOD
    function unstakeTicket(uint _tokenId) external isInvestTicketStacker {
        require(workflowStatus == WorkflowStatus.MintTicketsRegistrationStarted, "Staking is not authorized anymore");
        require(investTicketsStaked[msg.sender].stakedInvestTickets[_tokenId].isStaked, "Ticket is not staked");
        MintTicketNftCollection.unstakeTicket(_tokenId);

        LinkedListInvestTicket item = stakerList[_tokenId];
        if(linkedListHead.ticket.tokenId == _tokenId) {
            linkedListHead = stakerList[linkedListHead.nextIndex];
            linkedListHead.previousIndex = -1;
        }else if(linkedListLast.ticket.tokenId == _tokenId){
            linkedListLast = stakerList[linkedListLast.previousIndex];
            linkedListLast.nextIndex = -1;
        }else{
            stakerList[item.previousIndex].nextIndex = item.nextIndex;
            stakerList[item.nextIndex].previousIndex = item.previousIndex;
        }
        delete stakerList[_tokenId];

        investTicketsStaked[msg.sender].amountOfTicketStaked.decrement();
        delete investTicketsStaked[msg.sender].stakedInvestTickets[_tokenId];

        emit InvestTicketUnstaked(item);
    }

    function unstakeAllTickets() internal {
        //Unstake all Tickets
    }



    //DAOSIGNATURE REQUEST
    function DAOTeamSignatureRequest() external {
        require(msg.sender = DAOWallet, "You are not the DAO !");
        require(workflowStatus == WorkflowStatus.MintTicketsRegistrationEnded);
        DAOTeamSignatureCompleted();
    }

    //GENERATE OFFER NFT
    function generateOfferNFT() internal {
        //BURN TICKET AND GENERATE OFFER
    }

    //HANDLE OFFER NFT TRANSFER (ownership change)

    //***
    //CHANGE WORKFLOWSTATUS
    //***

    //START MINT TICKET REGISTRATION
    function mintTicketRegistrationStarted() external onlyOwner {
        require(workflowStatus == WorkflowStatus.Initialized, "Mint ticket registration have not been started yet");
        workflowStatus = WorkflowStatus.MintTicketsRegistrationStarted;
        WorkflowStatusChanged(WorkflowStatus.Initialized, WorkflowStatusChanged.MintTicketsRegistrationStarted);
    }

    //END MINT TICKET REGISTRATION
    function mintTicketRegistrationEnded() internal {
        require(workflowStatus == WorkflowStatus.MintTicketsRegistrationStarted, "Mint ticket registration have not been started yet");
        if(ticketsCounter.current() < minimumTicket){
            workflowStatus = WorkflowStatus.CanceledMinimumTicketsNotReach;
            unstakeAllTickets();
            WorkflowStatusChanged(WorkflowStatus.MintTicketsRegistrationStarted, WorkflowStatusChanged.CanceledMinimumTicketsNotReach);
        } else {
            workflowStatus = WorkflowStatus.MintTicketsRegistrationEnded;
            WorkflowStatusChanged(WorkflowStatus.MintTicketsRegistrationStarted, WorkflowStatusChanged.MintTicketRegistrationEnded);
        }

    }

    function DAOTeamSignatureCompleted() internal {
        require(workflowStatus == WorkflowStatus.MintTicketsRegistrationEnded, "Ticket registration not ended");
        workflowStatus = WorkflowStatus.DAOTeamSignatureCompleted;
        WorkflowStatusChanged(WorkflowStatus.MintTicketsRegistrationEnded, WorkflowStatus.DAOTeamSignatureCompleted);
    }

    //SWITCH TO RUNNING MODE (need totalThPower and set timeOfLastRewardUpdate)

    //***
    //CRON TASK
    //***

    //CHECK IF TIME EXPIRED
    function checkLockTimeExpired() external {
        if(lockTimeLimit > now) {
            mintTicketRegistrationEnded();
        }
    }

    //CHECK IF BEGIN OF NEW MONTH SO COMPUTE REWARD

}