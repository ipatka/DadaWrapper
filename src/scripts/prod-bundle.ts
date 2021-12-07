
import { ethers } from 'hardhat'
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle')

import { BigNumber, Wallet } from 'ethers'

import { DadaCollectible } from '../types/DadaCollectible'
import { DadaReserve } from '../types/DadaReserve'

import { privatekey } from '../util/util'

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

async function createSignedBundle(firstNonce: number, currentRound: number, gasPrice: number, gasLimit: number, minerTip: string, dada: DadaCollectible, dadaReserve: DadaReserve, flashbotsProvider: any, admin: Wallet) {
  const unlockTransaction = await dada.populateTransaction.flipSwitchTo(true, {nonce: firstNonce, gasLimit: 30000, gasPrice})
  const withdrawTransaction = await dada.populateTransaction.withdraw({gasPrice, gasLimit: 40000, nonce: (firstNonce + 1)})
  const executeTransaction = await dadaReserve.populateTransaction.executeRound(currentRound, minerTip, {gasLimit, gasPrice, nonce: (firstNonce + 2)})
  const relockTransaction = await dada.populateTransaction.flipSwitchTo(false, {nonce: (firstNonce + 3), gasLimit: 30000, gasPrice})
  
  console.log({unlockTransaction, executeTransaction, relockTransaction})
  const signedTransactions = await flashbotsProvider.signBundle([
    {
      signer: admin,
      transaction: unlockTransaction
    },
    {
      signer: admin,
      transaction: withdrawTransaction
    },
    {
      signer: admin,
      transaction: executeTransaction
    },
    {
      signer: admin,
      transaction: relockTransaction
    },
  ]);
  
  console.log({signedTransactions})
  return signedTransactions

}

async function broadcastBundle(signedTransactions: any, flashbotsProvider: any, blockNumber: number, numBlocks: number) {
  const simulation = await flashbotsProvider.simulate(
    signedTransactions,
    blockNumber + 1
  );
  
  console.log({simulation})
  if ("error" in simulation) {
    console.log(`Simulation Error: ${simulation.error.message}`);
  } else {
    console.log(
      `Simulation Success: ${blockNumber} ${JSON.stringify(
        simulation,
        null,
        2
      )}`
    );
  }

  for (var i = 1; i <= numBlocks; i++) {
    const bundleSubmission = flashbotsProvider.sendRawBundle(
      signedTransactions,
      blockNumber + i
    );
    console.log("submitted for block # ", blockNumber + i);
    // console.log({bundleSubmission})
  }

}

async function broadcastToMempool(firstNonce: number, numExecute: number, currentRound: number, gasPrice: number, gasLimit: number, minerTip: string, dada: DadaCollectible, dadaReserve: DadaReserve, admin: Wallet) {
  const unlockTransaction = await dada.populateTransaction.flipSwitchTo(true, {nonce: firstNonce, gasLimit: 30000, gasPrice})
  const withdrawTransaction = await dada.populateTransaction.withdraw({gasPrice, gasLimit: 40000, nonce: (firstNonce + 1)})

  let executeTransactions = []
  for (let index = 0; index < numExecute; index++) {
    const executeTransaction = await dadaReserve.populateTransaction.executeRound(currentRound, minerTip, {gasLimit, gasPrice, nonce: (firstNonce + 2 + index)})
    executeTransactions.push(executeTransaction)
  }
  const relockTransaction = await dada.populateTransaction.flipSwitchTo(false, {nonce: (firstNonce + 2 + numExecute), gasLimit: 30000, gasPrice})

  let executeTxs = []
  const unlockTx = await admin.sendTransaction(unlockTransaction)
  for (let index = 0; index < numExecute; index++) {
    const executeTx= await admin.sendTransaction(executeTransactions[index])
    executeTxs.push(executeTx)
  }
  const withdrawTx = await admin.sendTransaction(withdrawTransaction)
  const relockTx = await admin.sendTransaction(relockTransaction)
  
  console.log({unlockTx, executeTxs, withdrawTx, relockTx})
  
}

async function main() {
  const walletKey = privatekey()
  
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const mainnetDadaAddress = '0x068696A3cf3c4676B65F1c9975dd094260109d02'
  const mainnetDadaReserve = '0x76bde5bef7071a87d1236f150e09c05e05457224'
  const DadaCollectible = await ethers.getContractFactory('DadaCollectible', admin)
  const DadaReserve = await ethers.getContractFactory('DadaReserve', admin)

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    admin,
  );

  const dada = (await DadaCollectible.attach(mainnetDadaAddress)) as DadaCollectible
  const dadaReserve = (await DadaReserve.attach(mainnetDadaReserve)) as DadaReserve
  
  // const minerTip = '10000000000000000' // TODO find right tip
  const minerTip = '0' // TODO find right tip
  
  const gasPrice = 100000000000 // TODO mainnet gas
  const gasLimit = 5000000
  
  const currentRound = 11
  const firstNonce = 1212 // TODO specify nonce
  
  await broadcastToMempool(firstNonce, 4, currentRound, gasPrice, gasLimit, minerTip, dada, dadaReserve, admin)
  
  // const signedTransactions = await createSignedBundle(firstNonce, currentRound, gasPrice, gasLimit, minerTip, dada, dadaReserve, flashbotsProvider, admin)
  
  // console.log({signedTransactions})

  
  // const blockNumber = await provider.getBlockNumber();
  
  // await broadcastBundle(signedTransactions, flashbotsProvider, blockNumber, 20)

  // console.log("bundles submitted");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
