//nobody own time controler, it is going throught governance

const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  MIN_DELAY,
  VOTING_PERIOD,
  VOTING_DELAY,
  QUORUM_PERCENTAGE,
  ADDRESS_ZERO,
} = require("../helper-hardhat-config");

const { network, ethers } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  //we need contract to interact with them
  //contract attached to deployer

  const timeLock = await ethers.getContract("TimeLock", deployer);
  const governor = await ethers.getContract("GovernorContract", deployer);

  log("Setting up roles");
  //only the governor can send things to TimeLock
  //get the bytecodes of different roles
  //we want to setup that anyone can be  proposer
  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.DEFAULT_ADMIN_ROLE();

  //let put Governor the only one who can do anything
  //once we tell time lock to do something we will wait Time lock over
  const proposerTx = await timeLock.grantRole(
    proposerRole,
    governor.getAddress()
  );
  await proposerTx.wait(1);

  //give executor role to nobody,means anybody can execute
  const executorTx = await timeLock.grantRole(executorRole, ethers.ZeroAddress);
  await executorTx.wait(1);

  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeTx.wait(1);
};

module.exports.tags = ["all", "setuproles"];
