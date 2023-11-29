const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");

const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  log("----------------------------------------------------");
  log("Deploying Governance Token");
  log("----------------------------------------------------");

  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: waitBlockConfirmations || 1,
  });
  log(`GovernanceToken at ${governanceToken.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(governanceToken.address, []);
  }
  //Here nobody has a voting power yet,bcz nobody has token delegated to them
  //we want to delegate token to our deployer

  log(`Delegating to ${deployer}`);
  await delegate(governanceToken.address, deployer);
  log("Delegated!");
};

async function delegate(governanceTokenAddress, delegatedAccount) {
  //fetch the governance token instance
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );
  //call delegate and passing in the address of the account to which the tokens will be delegated
  const transactionResponse = await governanceToken.delegate(delegatedAccount);
  //wait for the transaction to be confirmed by the network
  await transactionResponse.wait(1);
  //if is 0 we have to delegate again
  console.log(
    `Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`
  );
}

module.exports.tags = ["all", "governor"];
