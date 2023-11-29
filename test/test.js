const {
  developmentChains,
  FUNC,
  NEW_STORE_VALUE,
  VOTING_DELAY,
  MIN_DELAY,
  PROPOSAL_DESCRIPTION,
} = require("../helper-hardhat-config");
const { moveTime } = require("../utils/move-time");
const { moveBlocks } = require("../utils/move-blocks");

const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
//const { solidity } = require("ethereum-waffle");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Governor Flow", function () {
      let governor, governanceToken, timeLock, box;
      const voteWay = 1; // for
      const reason = "my reason";

      beforeEach(async () => {
        await deployments.fixture(["all"]);
        governor = await ethers.getContract("GovernorContract");
        timeLock = await ethers.getContract("TimeLock");
        governanceToken = await ethers.getContract("GovernanceToken");
        box = await ethers.getContract("Box");
        const boxaddress = box.getAddress();
      });

      it("can only be changed through governance", async () => {
        await expect(box.store(4)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("proposes, votes, waits, queues, and then executes", async () => {
        // propose
        const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, [
          NEW_STORE_VALUE,
        ]);
        const boxaddress = box.getAddress();
        const proposeTx = await governor.propose(
          [boxaddress],
          [0],
          [encodedFunctionCall],
          PROPOSAL_DESCRIPTION
        );

        const proposeReceipt = await proposeTx.wait(1);
        const log = governor.interface.parseLog(proposeReceipt.logs[0]);
        const proposalId = log.args.proposalId;
        let proposalState = await governor.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);

        await moveBlocks(VOTING_DELAY + 1);
        // vote
        const voteTx = await governor.castVoteWithReason(
          proposalId,
          voteWay,
          reason
        );
        await voteTx.wait(1);
        proposalState = await governor.state(proposalId);
        assert.equal(proposalState.toString(), "1");
        console.log(`Current Proposal State: ${proposalState}`);
        await moveBlocks(VOTING_PERIOD + 1);

        // queue & execute
        const descriptionHash = ethers.keccak256(
          ethers.toUtf8Bytes(PROPOSAL_DESCRIPTION)
        );

        console.log(`descriptionHash   ${descriptionHash}`);
        console.log("queueing....");

        const queueTx = await governor.queue(
          [boxaddress],
          [0],
          [encodedFunctionCall],
          descriptionHash
        );
        await queueTx.wait(1);
        await moveTime(MIN_DELAY + 1);
        await moveBlocks(1);

        proposalState = await governor.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);

        console.log("Executing...");
        console.log;
        const exTx = await governor.execute(
          [boxaddress],
          [0],
          [encodedFunctionCall],
          descriptionHash
        );
        await exTx.wait(1);
        console.log((await box.retrieve()).toString());
      });
    });
