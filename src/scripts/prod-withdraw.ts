
import { ethers } from 'hardhat'
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle')

import { BigNumber } from 'ethers'

import { DadaReserve } from '../types/DadaReserve'

import { privatekey } from '../util/util'

async function main() {
  const walletKey = privatekey()
  
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const mainnetDadaReserve = '0x76bde5bef7071a87d1236f150e09c05e05457224'
  const DadaReserve = await ethers.getContractFactory('DadaReserve', admin)
  

  const dadaReserve = (await DadaReserve.attach(mainnetDadaReserve)) as DadaReserve
  
  
  const gasPrice = 35000000000 // TODO mainnet gas
  
  const nonce = 891 // TODO specify nonce
  
  const tx = await dadaReserve.withdraw('0x60775dCC868EcE33B6AC45A1Dd5D448aea3B7a71', {nonce, gasPrice})
  
  console.log({tx})
  await tx.wait()
  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
