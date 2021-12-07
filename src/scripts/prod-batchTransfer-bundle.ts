
import { ethers } from 'hardhat'
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle')

import { BigNumber, Wallet } from 'ethers'

import { DadaCollectible } from '../types/DadaCollectible'
import { DadaReserve } from '../types/DadaReserve'

import { privatekey } from '../util/util'
import { DadaBatchManager } from '../types/DadaBatchManager'

import {conservatory1, conservatory2, conservatory3, conservatory4, conservatory5, metapurse, drawingIds} from '../util/transfer'

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

const conservatoryMultisig = '0x841120FF6d1e9f29e4FFbdB50edA696bbFD98EF6'
const metapurseAddress = '0x51Cd54fb353Cb29CA02876F79d5AA31Cef92E264'

async function broadcastToMempool(firstNonce: number, gasPrice: number, dada: DadaCollectible, dadaBatch: DadaBatchManager, admin: Wallet) {
  const unlockTransaction = await dada.populateTransaction.flipSwitchTo(true, {nonce: firstNonce, gasLimit: 30000, gasPrice})
  
  const transfer1Batch: [number, number][] = conservatory1.map((value: number, index: number) => [drawingIds[index], value])
  const transfer2Batch: [number, number][] = conservatory2.map((value: number, index: number) => [drawingIds[index], value])
  const transfer3Batch: [number, number][] = conservatory3.map((value: number, index: number) => [drawingIds[index], value])
  const transfer4Batch: [number, number][] = conservatory4.map((value: number, index: number) => [drawingIds[index], value])
  const transfer5Batch: [number, number][] = conservatory5.map((value: number, index: number) => [drawingIds[index], value])
  const transfer6Batch: [number, number][] = metapurse.map((value: number, index: number) => [drawingIds[index], value])
  console.log({transfer1Batch, transfer2Batch, transfer3Batch, transfer4Batch, transfer5Batch, transfer6Batch})

  const transfer1 = await dadaBatch.populateTransaction.batchTransferToAddress(conservatoryMultisig, transfer1Batch, {nonce: (firstNonce + 1), gasPrice})
  const transfer2 = await dadaBatch.populateTransaction.batchTransferToAddress(conservatoryMultisig, transfer2Batch,{nonce: (firstNonce + 2), gasPrice})
  const transfer3 = await dadaBatch.populateTransaction.batchTransferToAddress(conservatoryMultisig, transfer3Batch,{nonce: (firstNonce + 3), gasPrice})
  const transfer4 = await dadaBatch.populateTransaction.batchTransferToAddress(conservatoryMultisig, transfer4Batch,{nonce: (firstNonce + 4), gasPrice})
  const transfer5 = await dadaBatch.populateTransaction.batchTransferToAddress(conservatoryMultisig, transfer5Batch,{nonce: (firstNonce + 5), gasPrice})
  const transfer6 = await dadaBatch.populateTransaction.batchTransferToAddress(metapurseAddress, transfer6Batch,{nonce: (firstNonce + 6), gasPrice})

  let executeTransactions = [
    transfer1,
    transfer2,
    transfer3,
    transfer4,
    transfer5,
    transfer6,
  ]

  const relockTransaction = await dada.populateTransaction.flipSwitchTo(false, {nonce: (firstNonce + 1 + executeTransactions.length), gasLimit: 30000, gasPrice})

  let executeTxs = []
  // const unlockTx = await admin.sendTransaction(unlockTransaction)
  // for (let index = 0; index < executeTransactions.length; index++) {
  //   const executeTx= await admin.sendTransaction(executeTransactions[index])
  //   executeTxs.push(executeTx)
  // }
  // const relockTx = await admin.sendTransaction(relockTransaction)
  
  // console.log({unlockTx, executeTxs, relockTx})
  
}

async function main() {
  const walletKey = privatekey()
  
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const mainnetDadaAddress = '0x068696A3cf3c4676B65F1c9975dd094260109d02'
  const mainnetDadaReserve = '0x76bde5bef7071a87d1236f150e09c05e05457224'
  const mainnetDadaBatch = 'TODO'
  const DadaCollectible = await ethers.getContractFactory('DadaCollectible', admin)
  const DadaReserve = await ethers.getContractFactory('DadaReserve', admin)
  const DadaBatchManager = await ethers.getContractFactory('DadaBatchManager', admin)

  const dada = (await DadaCollectible.attach(mainnetDadaAddress)) as DadaCollectible
  const dadaReserve = (await DadaReserve.attach(mainnetDadaReserve)) as DadaReserve
  const dadaBatch = (await DadaBatchManager.attach(mainnetDadaBatch)) as DadaBatchManager
  
  const gasPrice = 50000000000 // TODO mainnet gas
  
  const firstNonce = 955 // TODO specify nonce
  
  await broadcastToMempool(firstNonce, gasPrice, dada, dadaBatch, admin)
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
