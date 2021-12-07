
import { ethers } from 'hardhat'
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle')

import { BigNumber, Wallet } from 'ethers'

import { DadaCollectible } from '../types/DadaCollectible'
import { DadaReserve } from '../types/DadaReserve'

import { privatekey } from '../util/util'
import { DadaBatchManager } from '../types/DadaBatchManager'

import {
  transferD1a,
  transferD2a,
  transferD2,
  transferD3,
  transferD4,
  transferD5,
  transferEnigmaD1,
  transferEnigmaP1,
  transferEnigmaD2,
  transferEnigmaP2,
  transferP1a,
  transferP2a,
  transferP2,
  transferP3,
  transferP4,
  transferP5,
  transferPurseD,
  transferPurseP,
} from '../util/transfer2'

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

const metapurseAddress = '0x71bc9751aE95d09a2dCA914f47bC009D3B003fb3'
const dadaCollectiveAddress = '0xb14ede9b92b3f1595fbac33c8ea319efece608f2'
const dadaEnigmaAddress = '0xFfc24820a55B94392307b49Bd6b952f9A00f5775'

async function broadcastToMempool(firstNonce: number, gasPrice: number, dada: DadaCollectible, dadaBatch: DadaBatchManager, admin: Wallet) {
  
  const gasLimit = 7500000
  let nonce = firstNonce
  
  const transfer1Batch: [number, number][] = transferD1a.map((value: number, index: number) => [value, transferP1a[index]])
  const transfer1aBatch: [number, number][] = transferD2a.map((value: number, index: number) => [value, transferP2a[index]])
  const transfer2Batch: [number, number][] = transferD2.map((value: number, index: number) => [value, transferP2[index]])
  const transfer3Batch: [number, number][] = transferD3.map((value: number, index: number) => [value, transferP3[index]])
  const transfer4Batch: [number, number][] = transferD4.map((value: number, index: number) => [value, transferP4[index]])
  const transfer5Batch: [number, number][] = transferD5.map((value: number, index: number) => [value, transferP5[index]])
  const transfer6Batch: [number, number][] = transferEnigmaD1.map((value: number, index: number) => [value, transferEnigmaP1[index]])
  const transfer6aBatch: [number, number][] = transferEnigmaD2.map((value: number, index: number) => [value, transferEnigmaP2[index]])
  const transfer7Batch: [number, number][] = transferPurseD.map((value: number, index: number) => [value, transferPurseP[index]])
  console.log({transfer1Batch, transfer2Batch, transfer3Batch, transfer4Batch, transfer5Batch, transfer6Batch})

  const transfer1 = await dadaBatch.populateTransaction.batchTransferToAddress(dadaCollectiveAddress, transfer1Batch, {nonce, gasPrice, gasLimit})
  nonce++
  const transfer1a = await dadaBatch.populateTransaction.batchTransferToAddress(dadaCollectiveAddress, transfer1aBatch, {nonce, gasPrice, gasLimit})
  nonce++
  const transfer2 = await dadaBatch.populateTransaction.batchTransferToAddress(dadaCollectiveAddress, transfer2Batch,{nonce, gasPrice, gasLimit})
  nonce++
  const transfer3 = await dadaBatch.populateTransaction.batchTransferToAddress(dadaCollectiveAddress, transfer3Batch,{nonce, gasPrice, gasLimit})
  nonce++
  const transfer4 = await dadaBatch.populateTransaction.batchTransferToAddress(dadaCollectiveAddress, transfer4Batch,{nonce, gasPrice, gasLimit})
  nonce++
  const transfer5 = await dadaBatch.populateTransaction.batchTransferToAddress(dadaCollectiveAddress, transfer5Batch,{nonce, gasPrice, gasLimit})
  nonce++
  const transfer6 = await dadaBatch.populateTransaction.batchTransferToAddress(dadaEnigmaAddress, transfer6Batch,{nonce, gasPrice, gasLimit})
  nonce++
  const transfer6a = await dadaBatch.populateTransaction.batchTransferToAddress(dadaEnigmaAddress, transfer6aBatch,{nonce, gasPrice, gasLimit})
  nonce++
  const transfer7 = await dadaBatch.populateTransaction.batchTransferToAddress(metapurseAddress, transfer7Batch,{nonce, gasPrice, gasLimit})

  let executeTransactions = [
    transfer1,
    transfer1a,
    transfer2,
    transfer3,
    transfer4,
    transfer5,
    transfer6,
    transfer6a,
    transfer7,
  ]

  let executeTxs = []
  for (let index = 0; index < executeTransactions.length; index++) {
    const executeTx= await admin.sendTransaction(executeTransactions[index])
    executeTxs.push(executeTx)
  }
  
  console.log({executeTxs})
  
}

async function main() {
  const walletKey = privatekey()
  
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const mainnetDadaAddress = '0x068696A3cf3c4676B65F1c9975dd094260109d02'
  const mainnetDadaBatch = '0x45d7021D24889785d0c43294922F44c7Baa868D8'
  const DadaCollectible = await ethers.getContractFactory('DadaCollectible', admin)
  const DadaBatchManager = await ethers.getContractFactory('DadaBatchManager', admin)

  const dada = (await DadaCollectible.attach(mainnetDadaAddress)) as DadaCollectible
  const dadaBatch = (await DadaBatchManager.attach(mainnetDadaBatch)) as DadaBatchManager
  
  const gasPrice = 50000000000 // TODO mainnet gas
  
  const firstNonce = 1707 // TODO specify nonce
  
  await broadcastToMempool(firstNonce, gasPrice, dada, dadaBatch, admin)
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
