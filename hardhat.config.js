require("dotenv").config()
const { utils } = require("ethers")
const fs = require("fs")
const chalk = require("chalk")
require("hardhat-deploy")
require("@nomiclabs/hardhat-vyper")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-solhint")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")

require('./tasks')

// Select the network you want to deploy to here:
const defaultNetwork = "localhost";
const mainnetGwei = 21;
const infuraId = process.env.WEB3_INFURA_PROJECT_ID || null

let mnemonicStr = null;
function mnemonic() {
  if (mnemonicStr === null) {
    try {
      mnemonicStr = fs.readFileSync(`./mnemonic.txt`).toString().trim();
    } catch (e) {
      if (defaultNetwork !== "localhost") {
        console.error(
          "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`."
        );
      }
    }
  }
  return mnemonicStr;
}

module.exports = {
  defaultNetwork,

  /**
   * gas reporter configuration that let's you know
   * an estimate of gas for contract deployments and function calls
   * More here: https://hardhat.org/plugins/hardhat-gas-reporter.html
   */
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP || null,
  },

  // if you want to deploy to a testnet, mainnet, or xdai, you will need to configure:
  // 1. An Infura key (or similar)
  // 2. A private key for the deployer
  // DON'T PUSH THESE HERE!!!
  // An `example.env` has been provided in the Hardhat root. Copy it and rename it `.env`
  // Follow the directions, and uncomment the network you wish to deploy to.

  networks: {
    localhost: {
      //gasPrice: mainnetGwei * 1000000000,
      url: "http://localhost:8545",
      accounts: { mnemonic: process.env.MNEMONIC_LOCALHOST, },
    },

    mainnet: {
      url: `https://mainnet.infura.io/v3/${infuraId}`, // <---- YOUR INFURA ID! (or it won't work)
      gasPrice: mainnetGwei * 1000000000,
      accounts: [
        process.env.DEPLOY_KEY_MAINNET,
      ],
    },

    goerli: {
      url: `https://goerli.infura.io/v3/${infuraId}`, // <---- YOUR INFURA ID! (or it won't work)
      accounts: { mnemonic: process.env.MNEMONIC_GOERLI, },
      //confirmations: 2,
      gas: 2100000,
      //gasPrice: 8000000000,
      gasPrice: mainnetGwei * 1000000000,
      saveDeployments: true,
    },

  }, // .networks

  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: { enabled: true, runs: 200, }, },
      },
      {
        version: "0.8.13",
        settings: {
          optimizer: { enabled: true, runs: 200, }, },
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: { enabled: true, runs: 200, }, },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: { enabled: true, runs: 200, }, },
      },
      {
        version: "0.6.7",
        settings: {
          optimizer: { enabled: true, runs: 200, }, },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: { enabled: true, runs: 200, }, },
      },
    ],
  },
  vyper: {
    compilers: [
      { version: "0.3.3", },
      { version: "0.3.1", },
      { version: "0.2.16", },
      { version: "0.2.12", },
      { version: "0.2.8", },
      { version: "0.2.7", },
      { version: "0.2.4", },
    ],
  },
  ovm: {
    solcVersion: "0.7.6",
  },

  namedAccounts: {
    deployer: {
      default: 0,
    },
    tokenOwner: {
      default: 0,
    },
    rando: {
      default: 1,
    },
    friendo: {
      default: 2,
    },
  },

  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || null,
      goerli: process.env.ETHERSCAN_API_KEY || null,
    },
    apiUrl: {
      mainnet: "https://api.etherscan.io",
      goerli: "https://api-goerli.etherscan.io",
    },
  },
  verify: {
    // INFO: https://github.com/wighawag/hardhat-deploy#4-hardhat-etherscan-verify
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY || null,
    },
  },

  contractSizer: {
    //alphaSort:         true,
    runOnCompile:      false,
    //disambiguatePaths: false,
  },

  //mocha: {
    //parallel: true,
  //},
};
