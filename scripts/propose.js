//propose something npr.box store value

const {
  developmentChains,
  VOTING_DELAY,
  proposalsFile,
  FUNC,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
} = require("../helper-hardhat-config");

const { network, ethers } = require("hardhat");
const { verify } = require("../utils/verify");
const { moveBlocks } = require("../utils/move-blocks");
const fs = require("fs");

async function propose(args, functionToCall, proposalDescription) {
  const governor = await ethers.getContract("GovernorContract");
  //want to propose the box contract changes the store value
  const box = await ethers.getContract("Box");
  const boxaddress = box.getAddress();

  //encoding all for calldata in propose  function
  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );
  console.log(`Proposing ${functionToCall} on ${boxaddress} with ${args}`);
  console.log(`Proposal Description:\n ${proposalDescription}`);

  //making proposal transactiona
  //will be same as creating
  const proposeTx = await governor.propose(
    [boxaddress],
    [0],
    [encodedFunctionCall], //bytes data
    proposalDescription
  );

  // If working on a development chain, we will push forward till we get to the voting period.
  if (developmentChains.includes(network.name)) {
    //have to wait for voting delay
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposeReceipt = await proposeTx.wait(1);

  //const proposalId = proposeReceipt.events[0].args.proposalId;
  const log = governor.interface.parseLog(proposeReceipt.logs[0]);
  const proposalId = log.args.proposalId;

  console.log(`Proposed with proposal ID:\n  ${proposalId}`);

  const proposalState = await governor.state(proposalId);
  const proposalSnapShot = await governor.proposalSnapshot(proposalId);
  const proposalDeadline = await governor.proposalDeadline(proposalId);
  // save the proposalId
  await storeProposalId(proposalId);
  /*
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  proposals[network.config.chainId.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
*/
  // the Proposal State is an enum data type, defined in the IGovernor contract.
  // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
  console.log(`Current Proposal State: ${proposalState}`);
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`);
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`);
}

async function storeProposalId(proposalId) {
  const chainId = await network.config.chainId.toString();
  console.log(`chainId ${chainId}`);
  let proposals;
  if (fs.existsSync(proposalsFile)) {
    //read all proposals,we can get list of proposals
    proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  } else {
    proposals = {};
    proposals[network.config.chainId.toString()] = [];
  }
  console.log(`proposals ${proposals}`);
  //push proposals on proposals list
  proposals[network.config.chainId.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals), "utf8");
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
