import { ethers } from 'hardhat'
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle')

import { BigNumber } from 'ethers'

import { DadaReserve } from '../types/DadaReserve'
import { DadaCollectible } from '../types/DadaCollectible'

import { privatekey } from '../util/util'
import { drawingIds } from '../util/simulation'
import { delay, getNextOwnedPrints } from '../../test/util'

async function main() {
  const walletKey = privatekey()
  
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://ropsten.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const ropstenDadaAddress = '0x3a4b0e28bb7f4b5a4e8302a677a2bdb43fecb3cf'
  const ropstenDadaReserve = '0xDB4767fab12541A35b9D6C9f7ccB2D36B9EcF646'

  const DadaCollectible = await ethers.getContractFactory('DadaCollectible', admin)
  const DadaReserve = await ethers.getContractFactory('DadaReserve', admin)
  

  const dada = (await DadaCollectible.attach(ropstenDadaAddress)) as DadaCollectible
  const dadaReserve = (await DadaReserve.attach(ropstenDadaReserve)) as DadaReserve
  
        const ownedPrints = []
        for (let index = 0; index < drawingIds.length; index++) {
          const ownedPrint = await getNextOwnedPrints(drawingIds[index], 2 ,dadaReserve.address, dada)
          console.log({ownedPrint})
          ownedPrints.push([drawingIds[index], ownedPrint])
          await delay(100)
        }
        console.log({ownedPrints: JSON.stringify(ownedPrints)})

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
