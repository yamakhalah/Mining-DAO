const MiningDAOInvestTickets = artifacts.require("MiningDAOInvestTickets");

module.exports = function (deployer) {
  deployer.deploy(MiningDAOInvestTickets);
};
