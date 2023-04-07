// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

// ADD 5% Royalty
// ADD STATIC Variable method
// Attention royalty check par rapport à blur.



contract MiningDAOInvestTickets is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    struct Ticket {
        uint tokenId;
        address ticketOwner;
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

    Counters.Counter private _tokenIds;
    uint private mintPriceETH = 0.001 ether;
    address private DAOAddress;
    string private tokenUri;
    mapping (address => Ticket[]) private ticketsByAddress;
    mapping (address => Ticket[]) private usableTicketsByAddress;
    mapping (uint => Ticket) private ticketByTokenId;


    constructor(address _DAOAdress, string memory _tokenURI) ERC721("Mining DAO - Investment Tickets", "MDAO") {
        //https://gateway.pinata.cloud/ipfs/QmavcjZXHmzx9guhBaqwCFVy5BwcxRkEK3aDBEjr9PHriy
        DAOAddress = _DAOAdress;
        tokenUri = _tokenURI;
    }

    function getTicketsByAddress(address _address) public view returns (Ticket[] memory) {
        return ticketsByAddress[_address];
    }

    function getTicketByTokenId(uint _tokenId) public view returns (Ticket memory) {
        return ticketByTokenId[_tokenId];
    }

    function getTotalNFT() public view virtual returns (uint256) {
        return _tokenIds.current();
    }

    function getTokenUri() public view virtual returns (string memory) {
        return tokenUri;
    }

    function setTokenURI(string calldata _tokenUri) public onlyOwner {
        tokenUri = _tokenUri;
    }

    function getMintPriceETH() public view virtual returns (uint){
        return mintPriceETH;
    }

    function setEthPrice(uint _price) public onlyOwner {
        mintPriceETH = _price;
    }

    function  mintTicketETH(address _customer) public payable returns (uint) {
        require(msg.value >= mintPriceETH, "You don't have enough money to mint");

        _tokenIds.increment();
        uint newTokenId = _tokenIds.current();
        Ticket memory ticket = Ticket(newTokenId, _customer, mintPriceETH, false, true, false);
        ticketsByAddress[_customer].push(ticket);
        ticketByTokenId[newTokenId] = ticket;

        _mint(_customer, newTokenId);
        _setTokenURI(newTokenId, tokenUri);

        emit TicketMinted(ticket);
        return ticket.tokenId;
    }

    function stakeTicket(uint _tokenId) public {
        Ticket memory ticket = ticketByTokenId[_tokenId];
        require(ticket.isMinted, "Not a minter");
        require(!ticket.isUsed, "This ticket has already been used");
        require(ticket.ticketOwner == msg.sender, "Caller is not owner");
        require(!ticket.isStaked, "Token already staked");

        ticket.isStaked = true;
        ticketByTokenId[_tokenId] = ticket;

        emit TicketStaked(ticket);
    }

    function unstakeTicket(uint _tokenId) public {
        Ticket memory ticket = ticketByTokenId[_tokenId];
        require(ticket.isMinted, "Not a minter");
        require(!ticket.isUsed, "This ticket has already been used");
        require(ticket.ticketOwner == msg.sender, "Caller is not owner");
        require(ticket.isStaked, "Token is not staked");

        ticket.isStaked = false;
        ticketByTokenId[_tokenId] = ticket;

        emit TicketUnstaked(ticket);
    }

    function useTicket(uint _tokenId) public {
        Ticket memory ticket = ticketByTokenId[_tokenId];
        require(ticket.isMinted, "Not a minter");
        require(!ticket.isUsed, "This ticket has already been used");
        require(ticket.ticketOwner == msg.sender, "Caller is not owner");
        require(ticket.isStaked, "Token is not staked");

        _burn(_tokenId);
        ticket.isUsed = true;
        ticketByTokenId[_tokenId] = ticket;
        removeFromList(msg.sender, _tokenId);

        emit TicketBurned(ticket);
    }

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

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        require(!ticketByTokenId[tokenId].isUsed, "You cannot transfer a used token");
        require(!ticketByTokenId[tokenId].isStaked, "You cannot transfer a staked token");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        super.safeTransferFrom(from, to, tokenId);
        ticketByTokenId[tokenId].ticketOwner = to;
    }
}