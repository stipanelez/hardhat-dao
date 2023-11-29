//After proposal we are voting
const { network, ethers } = require("hardhat");
const { verify } = require("../utils/verify");
const { moveBlocks } = require("../utils/move-blocks");
const fs = require("fs");
const {
  proposalsFile,
  developmentChains,
  VOTING_PERIOD,
} = require("../helper-hardhat-config");

//first index in our proposals we are going to use
const index = 0;

async function main(proposalIndex) {
  //grab a list of proposals
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  const chainId = await network.config.chainId.toString();
  //const proposalId = proposals[network.config.chainId][proposalIndex];
  const proposalId = proposals[chainId][proposalIndex];
  const voteWay = 1; //0:against,1:in,2:abstain
  const reason = "my reason";
  await vote(proposalId, voteWay, reason);
}

async function vote(proposalId, voteWay, reason) {
  console.log("voting.....");
  const governorContract = await ethers.getContract("GovernorContract");
  const proposalState = await governorContract.state(proposalId);
  console.log(`Current Proposal State: ${proposalState}`);

  const voteTx = await governorContract.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );

  await voteTx.wait(1);

  console.log(`Current Proposal State: ${proposalState}`);
  // Check if the proposal exists
  if (proposalState === 2) {
    throw new Error("GovernorNonexistentProposal");
  }
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log("you have voted...");
}
main(index)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
