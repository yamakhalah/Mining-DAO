// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './MiningDAOInvestTickets.sol';

// ADD 5% Royalty
// ADD STATIC Variable method
// Attention royalty check par rapport à blur.



contract MiningDAOCommercialOffer is ERC721URIStorage, Ownable, ReentrancyGuard{
    using Counters for Counters.Counter;


    MiningDAOInvestTickets private InvestTicketsContract;

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
        mapping(uint => LinkedListInvestTicket) stakedInvestTickets;
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
    string offerName;
    string ref;
    mapping(address => bool) whitelisted;

    WorkflowStatus public workflowStatus;

    // PHASE 1
    uint minimumTickets;
    uint maximumTickets;
    Counters.Counter ticketsCounter;
    uint lockTimeLimit;
    LinkedListInvestTicket linkedListHead;
    LinkedListInvestTicket linkedListLast;
    mapping(uint => LinkedListInvestTicket) stakedList;
    mapping(address => InvestTicketsStaked) investTicketsStaked;


    // PHASE 2
    uint256 timeOfLastRewardUpdate;
    uint256 totalTHPower;
    OfferTicket[] offerOwnersList;
    mapping(address => OfferTicket) public offerTicketOwners;

    event InvestTicketStaked(InvestTicket ticket);
    event InvestTicketUnstaked(InvestTicket ticket);
    event RewardClaimed(OfferTicket ticket);
    event WorkflowStatusChanged(WorkflowStatus previous, WorkflowStatus current);

    //CONSTRUCTOR
    constructor(
        address _InvestTicketsContractAddress,
        string memory _offerName,
        string memory _ref,
        string memory _collectionName,
        address _DAOWallet,
        address[] memory _DAOTeamWallets,
        address _treasuryWallet,
        uint _minimumTickets,
        uint _maximumTickets,
        uint _lockTimeLimit
    ) ERC721(_collectionName, _ref){
        InvestTicketsContract = MiningDAOInvestTickets(_InvestTicketsContractAddress);
        offerName = _offerName;
        ref = _ref;
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
        require(investTicketsStaked[msg.sender].amountOfTicketStaked.current() >= 1, "You are not a Ticket Staked");
        _;
    }

    //MOFICIER CHECK isOfferTicketOwner
    modifier isOfferTicketOwner() {
        require(offerTicketOwners[msg.sender].power >= 1, "You are not an offer ticket owner");
        _;
    }

    function getStakedItem(uint _tokenId) public view returns (LinkedListInvestTicket memory) {
        return stakedList[_tokenId];
    }

    function getStakedList() public view returns (InvestTicket[] memory) {
        InvestTicket[] memory ticketsList = new InvestTicket[](ticketsCounter.current());
        uint index;
        if(ticketsCounter.current() == 0){
            return ticketsList;
        }
        LinkedListInvestTicket memory current = linkedListHead;
        ticketsList[index++] = current.ticket;
        while(current.nextIndex != 0) {
            current = stakedList[current.nextIndex];
            ticketsList[index++] = current.ticket;
        }
        return ticketsList;
    }

    //STAKE INVEST TICKET METHOD
    function stakeTicket(uint _tokenId) external {
        require(workflowStatus == WorkflowStatus.MintTicketsRegistrationStarted, "Staking is not authorized anymore");
        require(!investTicketsStaked[msg.sender].stakedInvestTickets[_tokenId].ticket.isStaked, "Ticket already staked");
        InvestTicketsContract.stakeTicket(msg.sender, _tokenId);
        InvestTicket memory investTicket = InvestTicket(msg.sender, _tokenId, true);

        LinkedListInvestTicket memory item;
        if(!linkedListHead.ticket.isStaked) {
            item = LinkedListInvestTicket(0,investTicket,0);
            linkedListHead = item;
        } else {
            item = LinkedListInvestTicket(linkedListLast.ticket.tokenId,investTicket,0);
            stakedList[linkedListLast.ticket.tokenId].nextIndex = item.ticket.tokenId;
        }
        if(ticketsCounter.current() == 1) {
            linkedListHead.nextIndex = _tokenId;
        }
        stakedList[_tokenId] = item;
        linkedListLast = item;

        investTicketsStaked[msg.sender].stakedInvestTickets[_tokenId] = item;
        investTicketsStaked[msg.sender].amountOfTicketStaked.increment();

        ticketsCounter.increment();
        if(ticketsCounter.current() == maximumTickets){
            mintTicketRegistrationEnded();
        }

        emit InvestTicketStaked(item.ticket);
    }

    //UNSTAKE INVEST TICKET METHOD
    function unstakeTicket(uint _tokenId) external isInvestTicketStacker {
        require(workflowStatus == WorkflowStatus.MintTicketsRegistrationStarted, "Staking is not authorized anymore");
        require(investTicketsStaked[msg.sender].stakedInvestTickets[_tokenId].ticket.isStaked, "Ticket is not staked");
        InvestTicketsContract.unstakeTicket(msg.sender, _tokenId);

        LinkedListInvestTicket memory item = stakedList[_tokenId];
        if(linkedListHead.ticket.tokenId == _tokenId) {
            linkedListHead = stakedList[linkedListHead.nextIndex];
            linkedListHead.previousIndex = 0;
        }else if(linkedListLast.ticket.tokenId == _tokenId){
            linkedListLast = stakedList[linkedListLast.previousIndex];
            linkedListLast.nextIndex = 0;
        }else{
            stakedList[item.previousIndex].nextIndex = item.nextIndex;
            stakedList[item.nextIndex].previousIndex = item.previousIndex;
        }
        delete stakedList[_tokenId];

        investTicketsStaked[msg.sender].amountOfTicketStaked.decrement();
        delete investTicketsStaked[msg.sender].stakedInvestTickets[_tokenId];
        ticketsCounter.decrement();

        emit InvestTicketUnstaked(item.ticket);
    }

    function unstakeAllTickets() internal {
        //Unstake all Tickets
    }



    //DAOSIGNATURE REQUEST
    function DAOTeamSignatureRequest() external {
        require(msg.sender == DAOWallet, "You are not the DAO !");
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
        emit WorkflowStatusChanged(WorkflowStatus.Initialized, WorkflowStatus.MintTicketsRegistrationStarted);
    }

    //END MINT TICKET REGISTRATION
    function mintTicketRegistrationEnded() internal {
        require(workflowStatus == WorkflowStatus.MintTicketsRegistrationStarted, "Mint ticket registration have not been started yet");
        if(ticketsCounter.current() < minimumTickets){
            workflowStatus = WorkflowStatus.CanceledMinimumTicketsNotReach;
            unstakeAllTickets();
            emit WorkflowStatusChanged(WorkflowStatus.MintTicketsRegistrationStarted, WorkflowStatus.CanceledMinimumTicketsNotReach);
        } else {
            workflowStatus = WorkflowStatus.MintTicketsRegistrationEnded;
            emit WorkflowStatusChanged(WorkflowStatus.MintTicketsRegistrationStarted, WorkflowStatus.MintTicketsRegistrationEnded);
        }

    }

    function DAOTeamSignatureCompleted() internal {
        require(workflowStatus == WorkflowStatus.MintTicketsRegistrationEnded, "Ticket registration not ended");
        workflowStatus = WorkflowStatus.DAOTeamSignatureCompleted;
        emit WorkflowStatusChanged(WorkflowStatus.MintTicketsRegistrationEnded, WorkflowStatus.DAOTeamSignatureCompleted);
    }

    //SWITCH TO RUNNING MODE (need totalThPower and set timeOfLastRewardUpdate)

    //***
    //CRON TASK
    //***

    //CHECK IF TIME EXPIRED
    function checkLockTimeExpired() external {
        if(lockTimeLimit > block.timestamp) {
            mintTicketRegistrationEnded();
        }
    }

    //CHECK IF BEGIN OF NEW MONTH SO COMPUTE REWARD

}