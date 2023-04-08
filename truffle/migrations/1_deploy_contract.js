const MiningDAOInvestTickets = artifacts.require("MiningDAOInvestTickets");
const MiningDAOCommercialOffer = artifacts.require("MiningDAOCommercialOffer")
const testAddress = "0xf74B9BceEE48aeb9FA9F96D811c54D850C79B00A"

module.exports = function (deployer) {
  deployer.then(async () => {
    await deployer.deploy(
      MiningDAOInvestTickets,
      '0xf74B9BceEE48aeb9FA9F96D811c54D850C79B00A',
      'https://gateway.pinata.cloud/ipfs/QmavcjZXHmzx9guhBaqwCFVy5BwcxRkEK3aDBEjr9PHriy'
    )
    await deployer.deploy(
      MiningDAOCommercialOffer,
      MiningDAOInvestTickets.address,
      'Test Offer Name',
      'Test Ref',
      'Test Collection Name',
      testAddress,
      [testAddress],
      testAddress,
      1,
      5,
      1683495251
    )
  })
}
