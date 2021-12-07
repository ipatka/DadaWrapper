
import { ethers } from 'hardhat'
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle')

import { BigNumber } from 'ethers'

import { DadaCollectible } from '../types/DadaCollectible'

import { privatekey } from '../util/util'

async function main() {
  const walletKey = privatekey()
  
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const mainnetDadaAddress = '0x068696A3cf3c4676B65F1c9975dd094260109d02'
  const DadaCollectible = await ethers.getContractFactory('DadaCollectible', admin)

  const dada = (await DadaCollectible.attach(mainnetDadaAddress)) as DadaCollectible  
  
  const gasPrice = 65000000000 // TODO mainnet gas
  
  const nonce = 954 // TODO specify nonce
  
  const flip = await dada.flipSwitchTo(false, {nonce, gasPrice})
  console.log({flip})
  await flip.wait()

  const tx = await dada.withdraw({nonce: nonce + 1, gasPrice})
  
  console.log({tx})
  await tx.wait()
  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
