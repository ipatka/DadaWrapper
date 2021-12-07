# Rescue Mission

Batch purchase pre-ERC721 collectibles from an ERC20 style contract

Data model:

There are 108 drawings IDs

Each drawing ID has a different number of prints (rarity)

The goal is to purchase a set number of prints from each drawing ID

The purchases are prioritized by 'rounds' where certain drawing IDs should be purchased first

Rounds are gas heavy (180k gas per purchase) so we need to split them into multiple transactions, and keep track of our progress

It is important to be fault tolerant in cases that prints are not available (purchased by others while we do this, or were already purchased before)

The collectible contract is currently paused but will be unpaused prior to execution

The current plan is to use flashbots to bundle transactions of:

1. Unpause
2. Purchase a number of collectibles (~25)
3. Repause

Flashbots will be used to avoid submitting to the mempool where the activity will be made public too early


## Repo structure

### Contracts

DADACollectible.sol : Old collectible contract that is currently paused

DADAReserve.sol : My contract which allows admin to define purchasing rounds and execute batches. There is also a public interface for future public sales via this contract

### Scripts

local-simulation.ts : A simulation to deploy, match a state close to what is on mainnet, and execute purchasing rounds

bundle.ts : Goerli flashbots implementation

## Getting Started

Use Node version 14

`yarn install`

`yarn chain` to run the local testnet

`npx hardhat run src/scripts/local-simulation.ts --network localhost`

This will do a full simulation of deploying, creating rounds, executing all rounds

### Running tests

`yarn test`
