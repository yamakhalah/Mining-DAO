// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract MiningInvestTicketsNFT is ERC721URIStorage {
    using Counters for Counter.Counter;

    enum Currency{
        USDT,
        MATIC
    }

    struct Ticket {
        uint tokenId;
        address ticketOwner;
        uint usdtValue;
        uint maticValue;
        bool isUsed;
    }

    event TicketMinted(Ticket ticket);
    event TicketUsed(Ticket ticket);

    Counters.Counter private _tokenIds;
    Ticket[] private tickets;

    constructor() ERC721("MiningInvestTicketsNFT", "BH") {}

    function currencyEnumToString(Currency _currency) internal returns (string){
        if(_currency == Currency.USDT) {
            return "usdt";
        }else if(_currency == Currency.MATIC) {
            return "matic";
        }else{
            return null;
        }
    }

    function  mintTicker(
        address _customer,
        string calldata _tokenURI,
        Currency _currency,
        uint _value
    ) external returns (uint) {

        _tokenIds.increment();
        tickets.push((Ticket(300, 20, false)));
        uint newTokenId = _tokenIds.current();
        _mint(_customer, newTokenId);

        return 1;
    }
}