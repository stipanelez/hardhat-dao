const { network, ethers } = require("hardhat");
//const { ethers } = require("ethers");
const {
  developmentChains,
  FUNC,
  NEW_STORE_VALUE,
  MIN_DELAY,
  PROPOSAL_DESCRIPTION,
} = require("../helper-hardhat-config");
const { moveTime } = require("../utils/move-time");
const { moveBlocks } = require("../utils/move-blocks");

async function queueAndExecute() {
  //const governorContractAddress = ethers.utils.getAddress("GovernorContract");
  const governorContract = await ethers.getContract("GovernorContract");
  // const governorContract = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");
  const boxaddress = box.getAddress();
  const encodedData = box.interface.encodeFunctionData(FUNC, [NEW_STORE_VALUE]);
  const descriptionHash = ethers.keccak256(
    ethers.toUtf8Bytes(PROPOSAL_DESCRIPTION)
  );

  console.log(`descriptionHash   ${descriptionHash}`);
  console.log("queueing....");

  //  const queueTx = await governorContractAddress.queue(
  const queueTx = await governorContract.queue(
    [boxaddress],
    [0],
    [encodedData],
    descriptionHash
  );
  await queueTx.wait(1);
  console.log("queued....");

  if (developmentChains.includes(network.name)) {
    //speedup time
    //min delay is looking for some time
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }
  console.log("executing....");

  const executeTx = await governorContract.execute(
    [boxaddress],
    [0],
    [encodedData],
    descriptionHash
  );
  await executeTx.wait(1);

  console.log("executed...");
  const newBoxValue = await box.retrieve();
  console.log(newBoxValue.toString());
}

queueAndExecute()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
