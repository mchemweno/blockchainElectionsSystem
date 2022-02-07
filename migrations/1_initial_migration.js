const Migrations = artifacts.require("Migrations");
const Elections = artifacts.require("Elections");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Elections);
};
