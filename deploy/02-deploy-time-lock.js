const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  MIN_DELAY,
} = require("../helper-hardhat-config");

const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  log("Deploying TimeLock");
  log("----------------------------------------------------");

  const timeLock = await deploy("TimeLock", {
    from: deployer,
    //second is list of proposals,third is list of executors
    args: [MIN_DELAY, [], [], deployer],
    log: true,
    // waitConfirmations: VERIFICATION_BLOCK_CONFIRMATIONS || 1,
  });
  log(`TimeLock at ${timeLock.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(governanceToken.address, []);
  }
};

module.exports.tags = ["all", "timeLock"];
