// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MiningInvestTicketsNFT is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;

    enum Currency{
        ETH
    }

    struct Ticket {
        uint tokenId;
        address ticketOwner;
        uint gweiValue;
        bool isUsed;
        bool isMinted;
    }

    event TicketMinted(Ticket ticket);
    event TicketUsed(Ticket ticket);
    event TicketRefund(Ticket ticket);
    event TicketBurned(Ticket ticket);

    Counters.Counter private _tokenIds;
    uint private mintPriceETH = 0.000001 ether;
    address private daoAddress;
    string private tokenUri;
    mapping (address => Ticket[]) private ticketsByAddress;
    mapping (uint => Ticket) private ticketByTokenId;

    constructor() ERC721("Mining DAO - Investment Tickets", "BH") {
        daoAddress = 0xf74B9BceEE48aeb9FA9F96D811c54D850C79B00A;
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

        uint residualValue = (ticket.gweiValue * 90) / 100;
        ticketByTokenId[_tokenId].isUsed = true;

        (bool sent, bytes memory data) = _address.call{value: residualValue}("test call");
        require(sent, "Failed to send Ether");

        emit TicketBurned(ticket);
        emit TicketRefund(ticket);
    }

}