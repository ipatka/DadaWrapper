import { ethers } from 'hardhat'
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle')

import { BigNumber } from 'ethers'

import { DadaReserve } from '../types/DadaReserve'
import { DadaCollectible } from '../types/DadaCollectible'

import { privatekey } from '../util/util'
import { drawingIds, totalSupplies } from '../util/simulation'
import { delay, getNextOwnedPrints } from '../../test/util'

async function main() {
  const walletKey = privatekey()
  
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const mainnetDadaAddress = '0x068696A3cf3c4676B65F1c9975dd094260109d02'
  const mainnetDadaReserve = '0x76bde5bef7071a87d1236f150e09c05e05457224'

  const DadaCollectible = await ethers.getContractFactory('DadaCollectible', admin)
  const DadaReserve = await ethers.getContractFactory('DadaReserve', admin)
  

  const dada = (await DadaCollectible.attach(mainnetDadaAddress)) as DadaCollectible
  const dadaReserve = (await DadaReserve.attach(mainnetDadaReserve)) as DadaReserve
  
        const ownedPrints = []
        for (let index = 0; index < drawingIds.length; index++) {
          try {
            const ownedPrint = await getNextOwnedPrints(drawingIds[index], totalSupplies[index],dadaReserve.address, dada)
            console.log({ownedPrint})
            ownedPrints.push([drawingIds[index], ownedPrint])
          } catch (error) {
            console.log('no more')
            continue
          }
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
