const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  MIN_DELAY,
  VOTING_PERIOD,
  VOTING_DELAY,
  QUORUM_PERCENTAGE,
} = require("../helper-hardhat-config");

const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  //get function give us address what we need
  const governanceToken = await get("GovernanceToken");
  const timeLock = await get("TimeLock");

  log("----------------------------------------------------");
  log("Deploying Governor contract");
  log("----------------------------------------------------");

  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    //second is list of proposals,third is list of executors
    args: [
      governanceToken.address,
      timeLock.address,
      VOTING_PERIOD,
      VOTING_DELAY,
      QUORUM_PERCENTAGE,
    ],
    log: true,
    // waitConfirmations: VERIFICATION_BLOCK_CONFIRMATIONS || 1,
  });
  log(`GovernorContract at ${governorContract.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(governorContract.address, args);
  }
};

module.exports.tags = ["all", "governorContract"];
