MiningDAOInvestTickets = artifacts.require("MiningDAOInvestTickets");
MiningDAOCommercialOffer = artifacts.require("MiningDAOCommercialOffer")
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers')
const { expect } = require('chai')
const Web3 = require('web3')

const tokenUri = "https://gateway.pinata.cloud/ipfs/QmavcjZXHmzx9guhBaqwCFVy5BwcxRkEK3aDBEjr9PHriy"

const getBasicInvestTicketInstance = async (accounts) => {
  const test = await MiningDAOInvestTickets.new(accounts[0],tokenUri, { from: accounts[0]})
  return test
}

const getBasicCommercialOfferInstance = async (accounts, contractAddress) => {
return await MiningDAOCommercialOffer.new(
  contractAddress,
  'Test Offer Name',
  'Test Ref',
  'Test Collection Name',
  accounts[0],
  [accounts[0]],
  accounts[0],
  1,
  5,
  1683495251,
  { from: accounts[0]}
  )
}

contract("MiningDAOCommercialOffer", accounts => {
  let investTicketsInstance;
  let commercialOfferInstance;

  describe("Test", () => {
    beforeEach(async function() {
      investTicketsInstance = await getBasicInvestTicketInstance(accounts)
      commercialOfferInstance = await getBasicCommercialOfferInstance(accounts, investTicketsInstance.address)

      await investTicketsInstance.whitelist(commercialOfferInstance.address)

      await investTicketsInstance.mintTicketETH(accounts[1], {from: accounts[1], value: BN(Web3.utils.toWei('0.001'))})
      await investTicketsInstance.mintTicketETH(accounts[1], {from: accounts[1], value: BN(Web3.utils.toWei('0.001'))})
      await investTicketsInstance.mintTicketETH(accounts[1], {from: accounts[1], value: BN(Web3.utils.toWei('0.001'))})

    })

    it("Should not let me stake a ticket outside the workflow status", async() =>(
      await expectRevert(commercialOfferInstance.stakeTicket(BN(1), {from: accounts[1]}), 'Staking is not authorized anymore')
    ))

    it("Should let me stake a minted ticket", async() => {
      await commercialOfferInstance.mintTicketRegistrationStarted({ from: accounts[0]})
      await commercialOfferInstance.stakeTicket(BN(1), {from: accounts[1]})
      const ticket = await investTicketsInstance.getTicketByTokenId(BN(1),  {from: accounts[1]})
      expect(ticket.tokenId).to.be.bignumber.equal(BN(1))
      expect(ticket.ticketOwner).to.be.equal(accounts[1])
      expect(ticket.gweiValue).to.be.bignumber.equal(BN(1000000000000000))
      expect(ticket.isUsed).to.be.equal(false)
      expect(ticket.isMinted).to.be.equal(true)
      expect(ticket.isStaked).to.be.equal(true)
    })

    it("Should not let me stake the same ticket twice", async () => {
      await commercialOfferInstance.mintTicketRegistrationStarted({ from: accounts[0]})
      await commercialOfferInstance.stakeTicket(BN(1), {from: accounts[1]})
      await expectRevert(commercialOfferInstance.stakeTicket(BN(1), {from: accounts[1]}), 'Ticket already staked')
    })

    it("Should let me stake 3 tickets and return me a correct list", async() => {
      await commercialOfferInstance.mintTicketRegistrationStarted({ from: accounts[0]})
      await commercialOfferInstance.stakeTicket(BN(1), {from: accounts[1]})
      await commercialOfferInstance.stakeTicket(BN(2), {from: accounts[1]})
      await commercialOfferInstance.stakeTicket(BN(3), {from: accounts[1]})
      const tickets = await commercialOfferInstance.getStakedList()
      expect(tickets.length).to.be.equal(3)
      for(let i = 0; i< tickets.length-1; i++) {
        expect(tickets[i].investTicketOwner).to.be.equal(accounts[1])
        expect(tickets[i].tokenId).to.be.bignumber.equal(BN(i+1))
        expect(tickets[i].isStaked).to.be.equal(true)
      }
    })
  })

})