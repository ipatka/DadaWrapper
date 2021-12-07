import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'

import { DadaBatchManager } from '../types/DadaBatchManager'
import { DadaReserve } from '../types/DadaReserve'

import { privatekey } from '../util/util'

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
  const mainnetDadaReserveAddress = '0x76BDE5bef7071A87D1236F150e09c05e05457224'
  const ownerRole = '0xb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e'
  const adminAddress = '0x60775dCC868EcE33B6AC45A1Dd5D448aea3B7a71'

  const walletKey = privatekey()
  
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const DadaBatchManager = await ethers.getContractFactory('DadaBatchManager', admin)
  const DadaReserve = await ethers.getContractFactory('DadaReserve', admin)
  
  const gasPrice = 50000000000 // TODO mainnet gas price

  // const dada = (await DadaCollectible.deploy()) as DadaCollectible
  // const dadaReserve = (await DadaReserve.deploy(drawingIds, dada.address, {gasPrice})) as DadaReserve
  const dadaReserve = (await DadaReserve.attach(mainnetDadaReserveAddress)) as DadaReserve
  const dadaBatchManager = (await DadaBatchManager.deploy(mainnetDadaReserveAddress, {gasPrice})) as DadaBatchManager
  console.log('waiting for deploy')
  await dadaReserve.deployTransaction.wait()
  
  await dadaReserve.grantRole(ownerRole, dadaBatchManager.address, {gasPrice})

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
