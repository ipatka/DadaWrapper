
import { ethers } from 'hardhat'
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle')

import { BigNumber } from 'ethers'

import { DadaCollectible } from '../types/DadaCollectible'
import { DadaReserve } from '../types/DadaReserve'

import { privatekey } from '../util/util'

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
  const mainnetDadaReserve = '0x76bde5bef7071a87d1236f150e09c05e05457224'
  const DadaReserve = await ethers.getContractFactory('DadaReserve')
  
  const walletKey = privatekey()
  
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)
  
  const amountToDeposit = '7';
  const nonce = 1211;

  
  const tx = await admin.sendTransaction({to: mainnetDadaReserve, value: ethers.utils.parseEther(amountToDeposit), nonce, gasPrice: 100000000000})
  console.log({tx})

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
