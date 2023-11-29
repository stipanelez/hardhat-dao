const { network } = require("hardhat");

async function moveTime(amount) {
  console.log("moving time...");
  await network.provider.request({
    method: "evm_increaseTime",
    params: [amount],
  });
  console.log("time passed");
}
module.exports = { moveTime };
