// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import './MiningDAOInvestTickets.sol';

/// @title ERC721 Contract for offer contract management
/// @author Dylan Di Vito
/// @notice Serves as offer contract management and NFT collection
/// @dev Inherit the openzepellin ERC721 implementation
contract MiningDAOCommercialOffer is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    /// @dev InvestTicket contract in order to stake/unstake/use them through commercial offer
    MiningDAOInvestTickets private InvestTicketsContract;

    /// @dev Status of the smartcontract in order to handle control
    enum WorkflowStatus {
        Initialized,
        MintTicketsRegistrationStarted,
        MintTicketsRegistrationEnded,
        DAOTeamSignatureCompleted,
        Running,
        CanceledMinimumTicketsNotReach,
        Stopped
    }

    /// @dev All details of contract objet. Used as return object for Dapp
    struct OfferDetail {
        string offerName;
        string ref;
        uint minimumTickets;
        uint maximumTickets;
        uint ticketsCounter;
        uint lockTimeLimit;
        WorkflowStatus status;
    }
    /// @dev Invest ticket staked on commercial offer
    struct InvestTicket {
        address investTicketOwner;
        uint256 tokenId;
        bool isStaked;
    }

    /// @dev Map and counter of  tickets staked by one user
    struct InvestTicketsStaked {
        Counters.Counter amountOfTicketStaked;
        mapping(uint => LinkedListInvestTicket) stakedInvestTickets;
    }

    /// @dev OfferTicket object represent one NFT minted by users when offer is closed to staking and burn all ticket in order to generate NFT
    struct OfferTicket {
        address ticketOwner;
        uint256 power;
        string tokenUri;
        uint tokenId;
        Counters.Counter unclaimedMonths;
        uint256 unclaimedValue;
        uint256 timeOfLastRewardUpdate;
    }

    /// @dev OfferTicket reduced object used to return data to frontend
    struct OfferTicketProps {
        address ticketOwner;
        uint power;
        string tokenUri;
    }

    /// @dev Structure of a linkedlist object used to keep next and previous index
    struct LinkedListInvestTicket {
        uint previousIndex;
        InvestTicket ticket;
        uint nextIndex;
    }

    // GLOBAL
    /// @dev Address of the DAO contract
    address DAOWallet;
    /// @dev Address of all DAO team waller
    address[] DAOTeamWallets;
    /// @dev Address of the treasury
    address treasuryWallet;
    /// @dev Name of the offer
    string offerName;
    /// @dev Reference of the offer
    string ref;
    /// @dev Whitelisted wallet
    mapping(address => bool) whitelisted;
    /// @dev Status of contract
    WorkflowStatus public workflowStatus;

    // PHASE 1
    /// @dev Number of minimum ticket staked required
    uint minimumTickets;
    /// @dev Number of maximum ticket staked allowed
    uint maximumTickets;
    /// @dev Number of tickets actually staked
    Counters.Counter ticketsCounter;
    /// @dev Maximum Datetime after what staking is not allowed anymore
    uint lockTimeLimit;
    /// @dev Head of the linked list. used to start iteration
    LinkedListInvestTicket linkedListHead;
    /// @dev Tail of linked list
    LinkedListInvestTicket linkedListLast;
    /// @dev Ticket by tokenId
    mapping(uint => LinkedListInvestTicket) stakedList;
    /// @dev All tickets by user address
    mapping(address => InvestTicketsStaked) investTicketsStaked;


    // PHASE 2
    /// @dev last time DAO rewarded the contract
    uint256 timeOfLastRewardUpdate;
    /// @dev Total power of mining
    uint256 totalTHPower;
    /// @dev List of ticket NFT owner
    OfferTicket[] offerOwnersList;
    /// @dev Offer ticket map by user address
    mapping(address => OfferTicket) public offerTicketOwners;

    event InvestTicketStaked(InvestTicket ticket);
    event InvestTicketUnstaked(InvestTicket ticket);
    event RewardClaimed(OfferTicket ticket);
    event WorkflowStatusChanged(WorkflowStatus previous, WorkflowStatus current);


    /// @dev Constructor need to init all global parameters
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
        workflowStatus = WorkflowStatus.Initialized;

        whitelisted[_DAOWallet] = true;
        for(uint i = 0; i < _DAOTeamWallets.length; i++){
            whitelisted[_DAOTeamWallets[i]] = true;
        }
    }

    /// @dev MODIFIER CHECK whitelistedOwner
    modifier isWhitelisted() {
        require(whitelisted[msg.sender] == true, "You are not whitelisted");
        _;
    }

    /// @dev MODIFIER CHECK isInvestTicketStaker
    modifier isInvestTicketStacker() {
        require(investTicketsStaked[msg.sender].amountOfTicketStaked.current() >= 1, "You have 0 Ticket Staked");
        _;
    }

    /// @dev MODIFIER CHECK isOfferTicketOwner
    modifier isOfferTicketOwner() {
        require(offerTicketOwners[msg.sender].power >= 1, "You are not an offer ticket owner");
        _;
    }

    /// @dev Get detail of Offer for frontend. Encapslate info in OfferDetail struct
    function getOfferDetail() public view returns (OfferDetail memory) {
        return OfferDetail(offerName, ref, minimumTickets, maximumTickets, ticketsCounter.current(), lockTimeLimit, workflowStatus);
    }

    /// @dev get Staked ticket by token id
    function getStakedTicket(uint _tokenId) public view returns (LinkedListInvestTicket memory) {
        //return stakedList[_tokenId];
        return linkedListLast;
    }

    /// @dev get total number of staked ticket
    function getTotalStakedTicket() public view returns (uint) {
        return ticketsCounter.current();
    }

    /// @dev get list of staked ticket by iterate through linked list
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

    /// @dev Stake ticket on offer and interact with InvestTicket contract
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

    /// @dev Unstake ticket on offer and interact with InvestTicket contract
    function unstakeTicket(uint _tokenId) external isInvestTicketStacker {
        require(workflowStatus == WorkflowStatus.MintTicketsRegistrationStarted, "Staking is not authorized anymore");
        require(investTicketsStaked[msg.sender].stakedInvestTickets[_tokenId].ticket.isStaked, "Ticket is not staked");
        InvestTicketsContract.unstakeTicket(msg.sender, _tokenId);

        LinkedListInvestTicket memory item = stakedList[_tokenId];
        LinkedListInvestTicket memory _default;
        if(ticketsCounter.current() == 1) {
            linkedListHead = _default;
            linkedListLast = _default;
        }else if(linkedListHead.ticket.tokenId == _tokenId) {
            if(linkedListHead.nextIndex == linkedListLast.ticket.tokenId){
                linkedListHead = LinkedListInvestTicket(0,stakedList[linkedListHead.nextIndex].ticket,0);
                linkedListLast = _default;
            } else {
                linkedListHead = stakedList[linkedListHead.nextIndex];
                linkedListHead.previousIndex = 0;
            }
        }else if(linkedListLast.ticket.tokenId == _tokenId){
            if(linkedListHead.nextIndex == linkedListLast.ticket.tokenId){
                linkedListHead.nextIndex = 0;
                linkedListLast = _default;
            } else {
                linkedListLast = stakedList[linkedListLast.previousIndex];
                linkedListLast.nextIndex = 0;
            }
        }else{
            LinkedListInvestTicket memory previous = stakedList[item.previousIndex];
            LinkedListInvestTicket memory next = stakedList[item.nextIndex];
            previous.nextIndex = item.nextIndex;
            next.previousIndex = item.previousIndex;
            if(linkedListHead.ticket.tokenId == previous.ticket.tokenId) {
                linkedListHead = previous;
            }
            if(linkedListLast.ticket.tokenId == next.ticket.tokenId) {
                linkedListLast = previous;
            }
        }
        delete stakedList[_tokenId];

        investTicketsStaked[msg.sender].amountOfTicketStaked.decrement();
        delete investTicketsStaked[msg.sender].stakedInvestTickets[_tokenId];
        ticketsCounter.decrement();

        emit InvestTicketUnstaked(item.ticket);
    }

    /// @dev Unstake all ticket from contract. Used after they got burned in order to generate commercial offer NFT
    function unstakeAllTickets() internal {
        //Unstake all Tickets
    }



    /// @dev DAO Signature before burn all investTickets and generate offer NFT
    function DAOTeamSignatureRequest() external {
        require(msg.sender == DAOWallet, "You are not the DAO !");
        require(workflowStatus == WorkflowStatus.MintTicketsRegistrationEnded);
        DAOTeamSignatureCompleted();
    }

    /// @dev Will generate one NFT for each user based on number of ticket staked by each.
    function generateOfferNFT(OfferTicketProps[] calldata _offerTicketData, uint256 totalThPower) public onlyOwner {
        require(workflowStatus == WorkflowStatus.DAOTeamSignatureCompleted, 'DAO must have signed first');
        uint tokenId = 1;
        timeOfLastRewardUpdate = block.timestamp;
        for(uint i; i < _offerTicketData.length; i++) {
            Counters.Counter memory counter;
            OfferTicketProps memory ticketData = _offerTicketData[i];
            OfferTicket memory ticket = OfferTicket(ticketData.ticketOwner, ticketData.power, ticketData.tokenUri, tokenId, counter, 0, block.timestamp);
            offerOwnersList.push(ticket);
            offerTicketOwners[ticketData.ticketOwner] = ticket;

            _mint(ticketData.ticketOwner, tokenId);
            _setTokenURI(tokenId, ticketData.tokenUri);

            tokenId++;
        }

        burnAllTickets();
        running();
    }

    /// @dev Burn all InvestTickets staked
    function burnAllTickets() internal {
        require(workflowStatus == WorkflowStatus.DAOTeamSignatureCompleted, 'DAO must have signed first');
        InvestTicket[] memory investTickets = getStakedList();
        for(uint i; i < investTickets.length; i++) {
            InvestTicket memory ticket = investTickets[i];
            InvestTicketsContract.useTicket(ticket.investTicketOwner, ticket.tokenId);
        }
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

    function running() internal {
        require(workflowStatus == WorkflowStatus.DAOTeamSignatureCompleted, 'DAO Team need to sign first in order to generate NFT');
        workflowStatus = WorkflowStatus.Running;
        emit WorkflowStatusChanged(WorkflowStatus.DAOTeamSignatureCompleted, WorkflowStatus.Running);
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