const MiningDAOInvestTickets = artifacts.require("MiningDAOInvestTickets");

module.exports = function (deployer) {
  deployer.deploy(MiningDAOInvestTickets, '0xf74B9BceEE48aeb9FA9F96D811c54D850C79B00A', 'https://gateway.pinata.cloud/ipfs/QmavcjZXHmzx9guhBaqwCFVy5BwcxRkEK3aDBEjr9PHriy');
};
