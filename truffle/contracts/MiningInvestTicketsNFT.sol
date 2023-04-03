// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

// ADD 5% Royalty
// ADD STATIC Variable method
// Attention royalty check par rapport à blur.



contract MiningInvestTicketsNFT is ERC721URIStorage, Ownable{
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
    event TicketUsed(Ticket ticket);
    event TicketRefund(Ticket ticket);
    event TicketBurned(Ticket ticket);
    event TicketStaked(Ticket ticket);
    event TicketUnstaked(Ticket ticket);

    Counters.Counter private _tokenIds;
    uint private mintPriceETH = 0.000001 ether;
    address private DAOAddress;
    string private tokenUri;
    mapping (address => Ticket[]) private ticketsByAddress;
    mapping (uint => Ticket) private ticketByTokenId;

    constructor(address _DAOAdress, _tokenURI) ERC721("Mining DAO - Investment Tickets", "MDAO") {
        DAOAddress = _DAOAdress;
        tokenUri = "https://gateway.pinata.cloud/ipfs/QmavcjZXHmzx9guhBaqwCFVy5BwcxRkEK3aDBEjr9PHriy";
    }

    function getTicketsByAddress(address _address) public view returns (Ticket[] memory) {
        return ticketsByAddress[_address];
    }

    function getTicketsByTokenId(uint _tokenId) public view returns (Ticket memory) {
        return ticketByTokenId[_tokenId];
    }

    function getTotalNFT() public view virtual returns (uint256) {
        return _tokenIds.current();
    }

    function setTokenURI(string calldata _tokenUri) public {
        tokenUri = _tokenUri;
    }

    function setEthPrice(uint _price) public onlyOwner {
        mintPriceETH = _price;
    }

    function  mintTicketETH(address _customer) public payable returns (uint) {
        require(msg.value >= mintPriceETH, "You don't have enough money to mint");
        _tokenIds.increment();

        uint newTokenId = _tokenIds.current();
        Ticket memory ticket = Ticket(newTokenId, _customer, mintPriceETH, false, true);
        ticketsByAddress[_customer].push(ticket);
        ticketByTokenId[newTokenId] = ticket;

        _mint(_customer, newTokenId);
        _setTokenURI(newTokenId, tokenUri);

        emit TicketMinted(ticket);
        return newTokenId;
    }

    function stakeTicket(uint _tokenId) public {
        Ticket memory ticket = ticketByTokenId[_tokenId];
        require(ticket.isMinted, "Not a minter");
        require(!ticket.isUsed, "This ticket has already been used");
        require(ticket.ticketOwner == msg.sender, "Caller is not owner");
        require(!ticket.isStaked, "Token already staked");

        ticketByTokenId[_tokenId].isStaked = true;

        emit TicketStaked(ticket);
    }

    function unstakeTicket(uint _tokenId) public {
        Ticket memory ticket = ticketByTokenId[_tokenId];
        require(ticket.isMinted, "Not a minter");
        require(!ticket.isUsed, "This ticket has already been used");
        require(ticket.ticketOwner == msg.sender, "Caller is not owner");
        require(ticket.isStaked, "Token is not staked");

        ticketByTokenId[_tokenId].isStaked = false;

        emit TicketUsed(ticket);
        emit TicketUnstaked(ticket);
    }

    function useTicket(uint _tokenId) public {
        Ticket memory ticket = ticketByTokenId[_tokenId];
        require(ticket.isMinted, "Not a minter");
        require(!ticket.isUsed, "This ticket has already been used");
        require(ticket.ticketOwner == msg.sender, "Caller is not owner");

        ticketByTokenId[_tokenId].isUsed = true;
        _burn(_tokenId);

        emit TicketBurned(ticket);
    }

    function refundTicket(address payable _address, uint _tokenId) public {
        Ticket memory ticket = ticketByTokenId[_tokenId];
        require(ticket.isMinted, "Not a minter");
        require(!ticket.isUsed, "This ticket has already been used");
        require(ticket.ticketOwner == msg.sender, "Caller is not owner");

        uint residualValue = (ticket.gweiValue * 95) / 100;
        ticketByTokenId[_tokenId].isUsed = true;

        (bool sent, bytes memory data) = _address.call{value: residualValue}("95% of NFT refund");
        require(sent, "Failed to send Ether");
        _burn(_tokenId);

        emit TicketBurned(ticket);
        emit TicketRefund(ticket);
    }

}