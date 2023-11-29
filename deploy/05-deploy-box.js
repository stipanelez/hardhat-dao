const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  MIN_DELAY,
  VOTING_PERIOD,
  VOTING_DELAY,
  QUORUM_PERCENTAGE,
} = require("../helper-hardhat-config");

const { network, ethers } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const governanceToken = await get("GovernanceToken");

  log("----------------------------------------------------");
  log("Deploying Box");
  log("----------------------------------------------------");

  //this is box deployment obj, doesnt have box contract
  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    // waitConfirmations: VERIFICATION_BLOCK_CONFIRMATIONS || 1,
  });

  const timeLock = await ethers.getContract("TimeLock");
  const timeLockaddress = timeLock.getAddress();

  //getting the box contract
  const boxContract = await ethers.getContractAt("Box", box.address);

  //we are going to transfer ownership of box to timelock
  const transferOwnerTx = await boxContract.transferOwnership(timeLockaddress);

  await transferOwnerTx.wait(1);
  log("Transfer Ownership Done");

  log(`Box deployed at ${box.address}`);
};

module.exports.tags = ["all", "Boxdeploy"];
