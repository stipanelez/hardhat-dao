# DAO

Propose a new value to be added, Vote on that proposal, Queue & Execute proposal.

## Fuctions

1.Propose a new value

2.Vote on that proposal

3.Queue & Execute proposal


# Getting Started

## Requirements

-   [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    -   You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
-   [Nodejs](https://nodejs.org/en/)
    -   You'll know you've installed nodejs right if you can run:
        -   `node --version` and get an ouput like: `vx.x.x`
-   [Yarn](https://yarnpkg.com/getting-started/install) instead of `npm`
    -   You'll know you've installed yarn right if you can run:
        -   `yarn --version` and get an output like: `x.x.x`
        -   You might need to [install it with `npm`](https://classic.yarnpkg.com/lang/en/docs/install/) or `corepack`

## Quickstart


1. Clone this repo:
```
git clone https://github.com/stipanelez/hardhat-dao.git
cd hardhat-dao
```
2. Install dependencies
```
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv
```


I did it all manually on my own local network:


1. Setup local blockchain 
```
yarn hardhat node
```

2. Propose a new value to be added to our Box contract

In a second terminal (leave your blockchain running)
```
yarn hardhat run scripts/propose.js --network localhost
```

3. Vote on that proposal

```
yarn hardhat run scripts/vote.js --network localhost
```

4. Queue & Execute proposal

```
yarn hardhat run scripts/queue-and-execute.js --network localhost
```


In natuknice file I wrote down some comments on English and Croatian language.

# Thank you!