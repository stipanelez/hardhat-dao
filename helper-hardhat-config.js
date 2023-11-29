const networkConfig = {
  default: {
    name: "hardhat",
  },
  31337: {
    name: "localhost",
  },
  11155111: {
    name: "sepolia",
  },
  1: {
    name: "mainnet",
  },
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
const MIN_DELAY = 3600;
const VOTING_PERIOD = 5; //5 blocks
const VOTING_DELAY = 1; //1 block
const QUORUM_PERCENTAGE = 4; // 4% of voters always need to be voting
const ADDRESS_ZERO = "0x000000000000000000000000000000000000000";
const proposalsFile = "proposals.json";
const FUNC = "store";
const PROPOSAL_DESCRIPTION = "Proposal #1 77 in the Box!";
const NEW_STORE_VALUE = 77;

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  MIN_DELAY,
  VOTING_PERIOD,
  VOTING_DELAY,
  QUORUM_PERCENTAGE,
  ADDRESS_ZERO,
  proposalsFile,
  FUNC,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
};
