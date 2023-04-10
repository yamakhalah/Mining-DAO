// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/// @title ERC721 Contract for minting investment tickets
/// @author Dylan Di Vito
/// @notice Serves as NFT for the offer collection
/// @dev Inherit the openzepellin ERC721 implementation
contract MiningDAOInvestTickets is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    /// @dev Is created when you mint a ticket
    struct Ticket {
        uint tokenId;
        uint index;
        address ticketOwner;
        address escrowContract;
        uint gweiValue;
        bool isUsed;
        bool isMinted;
        bool isStaked;
    }

    event TicketMinted(Ticket ticket);
    event TicketRefund(Ticket ticket);
    event TicketBurned(Ticket ticket);
    event TicketStaked(Ticket ticket);
    event TicketUnstaked(Ticket ticket);

    /// @dev used as the next tokenId when minting ticket
    Counters.Counter private _tokenIds;
    /// @dev mint price
    uint private mintPriceETH = 0.001 ether;
    /// @dev address of the DAO contract
    address private DAOAddress;
    /// @dev tokenUri of generated NFT. Can be changed
    string private tokenUri;
    /// @dev Mapping of tickets available for one user
    mapping (address => Ticket[]) private ticketsByAddress;
    /// @dev mapping fo tickets available by token ID
    mapping (uint => Ticket) private ticketByTokenId;
    /// @dev Map of whitelisted CommercialOffer contract who can interact with this
    mapping (address => bool) private whitelistedOfferContract;
    /// @dev List of whitelisted CommercialOffer contract who can interact with this
    address[] private whitelistedList;


    /// @dev constructor need address of DAO and tokenUri for minting
    constructor(address _DAOAdress, string memory _tokenURI) ERC721("Mining DAO - Investment Tickets", "MDAO") {
        DAOAddress = _DAOAdress;
        tokenUri = _tokenURI;
    }

    /// @dev Get all whitelisted CommercialOffer contract
    function getWhitelistedList() public view returns (address[] memory) {
        return whitelistedList;
    }

    /// @dev Whitelist an CommercialOffer contract in order to let him interact
    function whitelist(address _contract) public onlyOwner{
        whitelistedOfferContract[_contract] = true;
        whitelistedList.push(_contract);
    }

    /// @dev Unwhitelist a COmmercialOffer contract
    function unWhitelist(address _contract) public onlyOwner{
        removeFromWhitelist(_contract);
    }
    /// @dev Get all ticket for one user
    function getTicketsByAddress(address _address) public view returns (Ticket[] memory) {
        return ticketsByAddress[_address];
    }
    /// @dev Get one ticket based on his tokenId
    function getTicketByTokenId(uint _tokenId) public view returns (Ticket memory) {
        return ticketByTokenId[_tokenId];
    }

    /// @dev Get total number of ticket generated
    function getTotalNFT() public view returns (uint256) {
        return _tokenIds.current();
    }

    /// @dev Get tokenUri link
    function getTokenUri() public view returns (string memory) {
        return tokenUri;
    }
    /// @dev Set tokenUri link. Will change for next mint.
    function setTokenURI(string calldata _tokenUri) public onlyOwner {
        tokenUri = _tokenUri;
    }
    /// @dev Get price minting
    function getMintPriceETH() public view returns (uint){
        return mintPriceETH;
    }

    /// @dev Set ETH Price for next mint
    function setEthPrice(uint _price) public onlyOwner {
        mintPriceETH = _price;
    }

    /// @dev Function that allow to mint ticket. Add ticket to ticketList
    function  mintTicketETH(address _customer) public payable returns (uint) {
        require(msg.value >= mintPriceETH, "You don't have enough money to mint");

        _tokenIds.increment();
        uint newTokenId = _tokenIds.current();
        address _default;
        uint length = ticketsByAddress[_customer].length;
        Ticket memory ticket = Ticket(newTokenId, length, msg.sender, _default, mintPriceETH, false, true, false);
        ticketsByAddress[_customer].push(ticket);
        ticketByTokenId[newTokenId] = ticket;

        _mint(_customer, newTokenId);
        _setTokenURI(newTokenId, tokenUri);

        emit TicketMinted(ticket);
        return ticket.tokenId;
    }
    /// @dev Function called by a CommercialOffer contract in order to stake and lock ticket on offer
    function stakeTicket(address _origin, uint _tokenId) public {
        Ticket memory ticket = ticketByTokenId[_tokenId];
        require(ticket.isMinted, "Not a minter");
        require(!ticket.isUsed, "This ticket has already been used");
        require(ticket.ticketOwner == _origin, "Caller is not a minter");
        require(whitelistedOfferContract[msg.sender], "Caller is not a whitelisted contract");
        require(!ticket.isStaked, "Token already staked");

        ticket.isStaked = true;
        ticket.escrowContract = msg.sender;
        ticketByTokenId[_tokenId] = ticket;
        ticketsByAddress[_origin][ticket.index] = ticket;

        emit TicketStaked(ticket);
    }
    /// @dev Function called by a CommercialOffer contract in order to unstake and unlock ticket on offer
    function unstakeTicket(address _origin, uint _tokenId) public {
        Ticket memory ticket = ticketByTokenId[_tokenId];
        require(ticket.isMinted, "Not a minter");
        require(!ticket.isUsed, "This ticket has already been used");
        require(ticket.ticketOwner == _origin, "Caller is not a minter");
        require(whitelistedOfferContract[msg.sender], "Caller is not a whitelisted contract");
        require(ticket.isStaked, "Token is not staked");

        ticket.isStaked = false;
        ticket.escrowContract = address(0);
        ticketByTokenId[_tokenId] = ticket;
        ticketsByAddress[_origin][ticket.index] = ticket;

        emit TicketUnstaked(ticket);
    }
    /// @dev Function called by a CommercialOffer contract in order use ticket on a validated offer and burn it
    function useTicket(address _origin, uint _tokenId) public {
        Ticket memory ticket = ticketByTokenId[_tokenId];
        require(ticket.isMinted, "Not a minter");
        require(!ticket.isUsed, "This ticket has already been used");
        require(ticket.ticketOwner == _origin, "Caller is not a minter");
        require(whitelistedOfferContract[msg.sender], "Caller is not a whitelisted contract");
        require(ticket.isStaked, "Token is not staked");

        _burn(_tokenId);
        ticket.isUsed = true;
        ticketByTokenId[_tokenId] = ticket;
        removeFromList(_origin, _tokenId);

        emit TicketBurned(ticket);
    }

    /// @dev Function called by a use in order to refund his ticket, burn it and get 95% refund
    function refundTicket(address payable _address, uint _tokenId) public {
        Ticket memory ticket = ticketByTokenId[_tokenId];
        require(ticket.isMinted, "Not a minter");
        require(!ticket.isUsed, "This ticket has already been used");
        require(ticket.ticketOwner == msg.sender, "Caller is not owner");

        uint residualValue = (ticket.gweiValue * 95) / 100;

        (bool sent, bytes memory data) = _address.call{value: residualValue}("95% of NFT refund");
        require(sent, "Failed to send Ether");
        _burn(_tokenId);

        ticket.isUsed = true;
        ticketByTokenId[_tokenId] = ticket;
        removeFromList(_address, _tokenId);

        emit TicketBurned(ticket);
        emit TicketRefund(ticket);
    }

    /// @dev Transfer token
    function safeTransferFrom(address from, address to, uint256 tokenId) public override {
        super.safeTransferFrom(from, to, tokenId);
        ticketByTokenId[tokenId].ticketOwner = to;
    }

    /// @dev Remove ticket from ticket list
    function removeFromList(address _address, uint _tokenId) private {
        Ticket[] storage tickets = ticketsByAddress[_address];
        uint extraIndex = 0;
        for(uint i = 0; i < tickets.length-1; i++){
            if(tickets[i].tokenId == _tokenId) {
                extraIndex = 1;
            }
            tickets[i] = tickets[i+extraIndex];
        }
        tickets.pop();
        ticketsByAddress[_address] = tickets;
    }

    /// @dev Remove whitelisted address fro whitelisted list
    function removeFromWhitelist(address _contract) private {
        uint extraIndex = 0;
        for(uint i = 0; i < whitelistedList.length-1; i++){
            if(whitelistedList[i] == _contract) {
                extraIndex = 1;
            }
            whitelistedList[i] = whitelistedList[i+extraIndex];
        }
        whitelistedList.pop();
        whitelistedOfferContract[_contract] = false;
    }

    /// @dev Check before transfer that token is not used or staked
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        require(!ticketByTokenId[tokenId].isUsed || to == address(0), "You cannot transfer a used token");
        require(!ticketByTokenId[tokenId].isStaked || to == address(0), "You cannot transfer a staked token");
    }

}