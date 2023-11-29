require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
//require("@nomicfoundation/hardhat-toolbox");
//require("@nomicfoundation/hardhat-ethers");

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
//const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
      // gasPrice: 130000000000,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      //accounts: {
      //     mnemonic: MNEMONIC,
      // },
      saveDeployments: true,
      chainId: 11155111,
    },
    /* mainnet: {
      url: MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      //   accounts: {
      //     mnemonic: MNEMONIC,
      //   },
      saveDeployments: true,
      chainId: 1,
    },
     polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 137,
    },*/
  },
  solidity: {
    compilers: [
      { version: "0.8.7" },
      { version: "0.8.8" },
      { version: "0.6.0" },
      { version: "0.6.6" },
      { version: "0.4.19" },
      { version: "0.8.0" },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      { version: "0.8.18" },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
      //polygon: POLYGONSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: COINMARKETCAP_API_KEY,
    // token: "ETH",
  },
  contractSizer: {
    runOnCompile: false,
    only: ["Box"],
  },
  mocha: {
    timeout: 200000, // 200 seconds max
  },

  compilerOptions: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
