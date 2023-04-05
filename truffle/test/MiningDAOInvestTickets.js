MiningDAOInvestTickets = artifacts.require("MiningDAOInvestTickets");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers')
const { expect } = require('chai')
const Web3 = require('web3')

contract("MiningDAOInvestTickets", accounts => {
  let investTicketsInstance;

  const tokenUri = "https://gateway.pinata.cloud/ipfs/QmavcjZXHmzx9guhBaqwCFVy5BwcxRkEK3aDBEjr9PHriy"
  const DAOAdress = accounts[0]

  describe("Initial state and basic get/set test", () => {
    beforeEach(async function() {
      investTicketsInstance = await MiningDAOInvestTickets.new(DAOAdress,tokenUri, { from: accounts[0]})
    })

    it("Not the owner - Should not let me set tokenURI or ETHPrice", async() => {
      await expectRevert(investTicketsInstance.setTokenURI('test', { from: accounts[1] }), 'caller is not the owner')
      await expectRevert(investTicketsInstance.setEthPrice(BN(1000), { from: accounts[2]}), 'caller is not the owner')
    })

    it("Owner - Should let me set tokenURI or ETHPrice", async() => {
      await investTicketsInstance.setTokenURI('test', { from: accounts[0] })
      await investTicketsInstance.setEthPrice(BN(2000000000000000), { from: accounts[0]})
      const tokenURI = await investTicketsInstance.getTokenUri()
      const mintPriceETH = await investTicketsInstance.getMintPriceETH()
      expect(tokenURI).to.be.equal('test')
      expect(mintPriceETH).to.be.bignumber.equal(BN(2000000000000000))
    })
  })

  describe("Mint Ticket Test and associated getter", () => {
    beforeEach(async function() {
      investTicketsInstance = await MiningDAOInvestTickets.new(DAOAdress,tokenUri, { from: accounts[0]})
    })
    it("Should not let me mint ticket because - Not enough money", async() => {
      await expectRevert(investTicketsInstance.mintTicketETH(accounts[1], {from: accounts[1], value: BN(Web3.utils.toWei('0.0001'))}), 'You don\'t have enough money to mint')
    })

    it("Should let me mint a ticket and launch event", async() => {
      const result = await investTicketsInstance.mintTicketETH(accounts[1], {from: accounts[1], value: BN(Web3.utils.toWei('0.001'))})
      const ticket  = await investTicketsInstance.getTicketByTokenId(BN(1), {from: accounts[1]})
      const totalNFT = await investTicketsInstance.getTotalNFT();
      expect(totalNFT).to.be.bignumber.equal(BN(1))
      expect(ticket.tokenId).to.be.bignumber.equal(BN(1))
      expect(ticket.ticketOwner).to.be.equal(accounts[1])
      expect(ticket.gweiValue).to.be.bignumber.equal(BN(1000000000000000))
      expect(ticket.isUsed).to.be.equal(false)
      expect(ticket.isMinted).to.be.equal(true)
      expect(ticket.isStaked).to.be.equal(false)
      await expectEvent(
        result,
        'TicketMinted',
        { ticket: ticket }
      )
    })

    it("Should let get my tickets by address", async() => {
      await investTicketsInstance.mintTicketETH(accounts[1], {from: accounts[1], value: BN(Web3.utils.toWei('0.001'))})
      await investTicketsInstance.getTicketByTokenId(BN(1), {from: accounts[1]})
      const tickets = await investTicketsInstance.getTicketsByAddress(accounts[1], { from: accounts[1] })
      expect(tickets.length).to.be.equal(1)
      expect(tickets[0].tokenId).to.be.bignumber.equal(BN(1))
      expect(tickets[0].ticketOwner).to.be.equal(accounts[1])
      expect(tickets[0].gweiValue).to.be.bignumber.equal(BN(1000000000000000))
      expect(tickets[0].isUsed).to.be.equal(false)
      expect(tickets[0].isMinted).to.be.equal(true)
      expect(tickets[0].isStaked).to.be.equal(false)
    })
  })

  describe("Stake ticket test", () => {
    beforeEach(async function() {
      investTicketsInstance = await MiningDAOInvestTickets.new(DAOAdress,tokenUri, { from: accounts[0]})
      await investTicketsInstance.mintTicketETH(accounts[1], {from: accounts[1], value: BN(Web3.utils.toWei('0.001'))})
    })

    it("Should not let me stake - Not a minter", async() => {
      await expectRevert(investTicketsInstance.stakeTicket(BN(5), { from: accounts[1] }), 'Not a minter')
    })

    it("Should not let me stake - Caller not the owner", async() => {
      await expectRevert(investTicketsInstance.stakeTicket(BN(1), { from: accounts[2] }), 'Caller is not owner')
    })

    it("Should not let me stake - Ticket already staked", async() => {
      await investTicketsInstance.stakeTicket(BN(1), { from: accounts[1]})
      await expectRevert(investTicketsInstance.stakeTicket(BN(1), { from: accounts[1] }), 'Token already staked')
    })

    it("Should let me stake ticket and change isStaked and launch event", async() => {
      await investTicketsInstance.mintTicketETH(accounts[1], {from: accounts[1], value: BN(Web3.utils.toWei('0.001'))})
      const result = await investTicketsInstance.stakeTicket(BN(2), { from: accounts[1]})
      const ticket = await investTicketsInstance.getTicketByTokenId(BN(2), {from: accounts[1]})
      expect(ticket.tokenId).to.be.bignumber.equal(BN(2))
      expect(ticket.ticketOwner).to.be.equal(accounts[1])
      expect(ticket.gweiValue).to.be.bignumber.equal(BN(1000000000000000))
      expect(ticket.isUsed).to.be.equal(false)
      expect(ticket.isMinted).to.be.equal(true)
      expect(ticket.isStaked).to.be.equal(true)
      await expectEvent(
        result,
        'TicketStaked',
        { ticket: ticket }
      )
    })

    it("Should not let me stake - Ticket used", async() => {
      await investTicketsInstance.stakeTicket(BN(1), { from: accounts[1] })
      await investTicketsInstance.useTicket(BN(1), { from: accounts[1]})
      await expectRevert(investTicketsInstance.stakeTicket(BN(1), { from: accounts[1] }), 'This ticket has already been used')
    })
  })

  describe("Unstake ticket test", () => {
    beforeEach(async function() {
      investTicketsInstance = await MiningDAOInvestTickets.new(DAOAdress,tokenUri, { from: accounts[0]})
      await investTicketsInstance.mintTicketETH(accounts[1], {from: accounts[1], value: BN(Web3.utils.toWei('0.001'))})
      await investTicketsInstance.mintTicketETH(accounts[1], {from: accounts[1], value: BN(Web3.utils.toWei('0.001'))})
      await investTicketsInstance.stakeTicket(BN(1), { from: accounts[1] })
    })

    it("Should not let me unstake - Not a minter", async() => {
      await expectRevert(investTicketsInstance.unstakeTicket(BN(5), { from: accounts[1] }), 'Not a minter')
    })

    it("Should not let me unstake - Caller not the owner", async() => {
      const ticket = await investTicketsInstance.getTicketByTokenId(BN(1))
      await expectRevert(investTicketsInstance.unstakeTicket(BN(1), { from: accounts[2] }), 'Caller is not owner')
    })

    it("Should not let me unstake - Ticket not staked", async() => {
      await expectRevert(investTicketsInstance.unstakeTicket(BN(2), { from: accounts[1] }), 'Token is not staked')
    })

    it("Should let me unstake ticket and change isStaked and launch event", async() => {
      const result = await investTicketsInstance.unstakeTicket(BN(1), { from: accounts[1]})
      const ticket = await investTicketsInstance.getTicketByTokenId(BN(1), {from: accounts[1]})
      expect(ticket.tokenId).to.be.bignumber.equal(BN(1))
      expect(ticket.ticketOwner).to.be.equal(accounts[1])
      expect(ticket.gweiValue).to.be.bignumber.equal(BN(1000000000000000))
      expect(ticket.isUsed).to.be.equal(false)
      expect(ticket.isMinted).to.be.equal(true)
      expect(ticket.isStaked).to.be.equal(false)
      await expectEvent(
        result,
        'TicketUnstaked',
        { ticket: ticket }
      )
    })

    it("Should not let me unstake - Ticket used", async() => {
      await investTicketsInstance.useTicket(BN(1), { from: accounts[1] })
      await expectRevert(investTicketsInstance.unstakeTicket(BN(1), { from: accounts[1] }), 'This ticket has already been used')
    })
  })

  describe("Use and refund ticket", () => {
    beforeEach(async function () {
      investTicketsInstance = await MiningDAOInvestTickets.new(DAOAdress, tokenUri, {from: accounts[0]})
      await investTicketsInstance.mintTicketETH(accounts[1], {from: accounts[1], value: BN(Web3.utils.toWei('0.001'))})
      await investTicketsInstance.mintTicketETH(accounts[1], {from: accounts[1], value: BN(Web3.utils.toWei('0.001'))})
      await investTicketsInstance.stakeTicket(BN(1), {from: accounts[1]})
    })

    it("Should not let me useTicket or refundTicket - Not a minter", async() => {
      await expectRevert(investTicketsInstance.useTicket(BN(5), { from: accounts[1] }), 'Not a minter')
      await expectRevert(investTicketsInstance.refundTicket(accounts[1], BN(5), { from: accounts[1] }), 'Not a minter')
    })

    it("Should not let me useTicket or refundTicket - Caller not the owner", async() => {
      const ticket = await investTicketsInstance.getTicketByTokenId(BN(1))
      await expectRevert(investTicketsInstance.useTicket(BN(1), { from: accounts[2] }), 'Caller is not owner')
      await expectRevert(investTicketsInstance.refundTicket(accounts[1], BN(1), { from: accounts[2] }), 'Caller is not owner')
    })

    it("Should not let me useTicket - Ticket not staked", async() => {
      await expectRevert(investTicketsInstance.useTicket(BN(2), { from: accounts[1] }), 'Token is not staked')
    })

    it("Should let me use ticket, launch event and burn ticket", async() => {
      const result = await investTicketsInstance.useTicket(BN(1), { from: accounts[1]})
      const ticket = await investTicketsInstance.getTicketByTokenId(BN(1), {from: accounts[1]})
      const tickets = await investTicketsInstance.getTicketsByAddress(accounts[1])

      for(let i = 0; i < tickets.length-1; i++) {
        expect(tickets[i].tokenId).to.be.bignumber.notEqual(BN(1))
      }

      expect(ticket.tokenId).to.be.bignumber.equal(BN(1))
      expect(ticket.ticketOwner).to.be.equal(accounts[1])
      expect(ticket.gweiValue).to.be.bignumber.equal(BN(1000000000000000))
      expect(ticket.isUsed).to.be.equal(true)
      expect(ticket.isMinted).to.be.equal(true)
      expect(ticket.isStaked).to.be.equal(true)
      await expectEvent(
        result,
        'TicketBurned',
        { ticket: ticket }
      )
    })
  })

})