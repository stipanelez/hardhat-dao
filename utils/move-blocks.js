//this script and function are moving blocks for us

const { network } = require("hardhat");

async function moveBlocks(amount) {
  // amount is how many blocks we want to move
  console.log("Moving blocks...");
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      //mining for our local blockchain
      method: "evm_mine",
      params: [],
    });
  }
  console.log(`Moved ${amount} blocks`);
}

module.exports = {
  moveBlocks,
};
