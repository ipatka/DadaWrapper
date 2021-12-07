import { ethers } from 'hardhat'
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle')

import { BigNumber } from 'ethers'

import { DadaReserve } from '../types/DadaReserve'
import { CollectiblesOwnership } from '../types/CollectiblesOwnership'
import { DadaCollectible } from '../types/DadaCollectible'

import { privatekey } from '../util/util'
import { commonIds, dadakin, discountPrice, drawingIds, friends, fullPrice} from '../util/salePrep'
import { delay, getNextOwnedPrints } from '../../test/util'
import {
  transferEnigmaP1,
  transferEnigmaP2,
  transferP1a,
  transferP2a,
  transferP2,
  transferP3,
  transferP4,
  transferP5,
  transferPurseP,
} from '../util/transfer2'
import { DadaSale } from '../types/DadaSale'

async function main() {
  const walletKey = privatekey()

  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const mainnetDadaAddress = '0x068696A3cf3c4676B65F1c9975dd094260109d02'
  // const dadaCollectibleAddress = '0x3a4b0e28bb7f4b5a4e8302a677a2bdb43fecb3cf'
  const mainnetDadaReserve = '0x76bde5bef7071a87d1236f150e09c05e05457224'
  // const ropstenDadaReserve = '0xDB4767fab12541A35b9D6C9f7ccB2D36B9EcF646'
  const dadaSaleAddress = '0xD7862Aef3458Ec0Bf9c72bB8E731CF7B01cBF830'

  const metapurseAddress = '0x71bc9751aE95d09a2dCA914f47bC009D3B003fb3'
  const dadaCollectiveAddress = '0xb14ede9b92b3f1595fbac33c8ea319efece608f2'
  const dadaEnigmaAddress = '0xFfc24820a55B94392307b49Bd6b952f9A00f5775'

  const DadaCollectible = await ethers.getContractFactory('DadaCollectible', admin)
  const DadaSale = await ethers.getContractFactory('DadaSale', admin)

  const dada = (await DadaCollectible.attach(mainnetDadaAddress)) as DadaCollectible
  const dadaSale = (await DadaSale.attach(dadaSaleAddress)) as DadaSale

  const transferPrintLists = [transferP1a, transferP2a, transferP2, transferP3, transferP4, transferP5]
  const transferEnigmaPrintLists = [transferEnigmaP1, transferEnigmaP2]

  // const collectiblesOwnership = (await CollectiblesOwnership.attach(dadaNFTAddress)) as CollectiblesOwnership
  // for (let index = 0; index < transferPrintLists.length; index++) {
  //   const printList = transferPrintLists[index]
  //   for (let index = 0; index < printList.length; index++) {
  //     const printId = printList[index]
  //     const owner = await dada.DrawingPrintToAddress(printId)
  //     console.log({printId, owner })
  //     if (owner.toLowerCase() !== dadaCollectiveAddress.toLowerCase()) throw new Error('not owner')
  //     await delay(100)
  //   }
  // }
  // for (let index = 0; index < transferEnigmaPrintLists.length; index++) {
  //   const printList = transferEnigmaPrintLists[index]
  //   for (let index = 0; index < printList.length; index++) {
  //     const printId = printList[index]
  //     const owner = await dada.DrawingPrintToAddress(printId)
  //     console.log({printId, owner, dadaEnigmaAddress})
  //     if (owner.toLowerCase() !== dadaEnigmaAddress.toLowerCase()) throw new Error('not owner')
  //     await delay(100)
  //   }
  // }
  // for (let index = 0; index < transferPurseP.length; index++) {
  //   const printId = transferPurseP[index]
  //   const owner = await dada.DrawingPrintToAddress(printId)
  //   console.log({printId, owner, metapurseAddress})
  //   if (owner.toLowerCase() !== metapurseAddress.toLowerCase()) throw new Error('not owner')
  //   await delay(100)
  // }
  
  // Check prices lists
  
  // for (let index = 0; index < drawingIds.length; index++) {
  //   const priceRound1 = ethers.utils.formatEther(await dadaSale.priceLists(1, drawingIds[index]))
  //   const priceRound2 = ethers.utils.formatEther(await dadaSale.priceLists(2, drawingIds[index]))
  //   const priceRound3 = ethers.utils.formatEther(await dadaSale.priceLists(3, drawingIds[index]))
  //   const priceRound4 = ethers.utils.formatEther(await dadaSale.priceLists(4, drawingIds[index]))
    
  //   console.log({drawing: drawingIds[index], priceRound1, priceRound2, priceRound3, priceRound4})
  //   if (parseFloat(priceRound1) != discountPrice[index]) throw new Error('price 1')
  //   if (parseFloat(priceRound2) != discountPrice[index]) throw new Error('price 2')
  //   if (parseFloat(priceRound3) != discountPrice[index]) throw new Error('price 3')
  //   if (parseFloat(priceRound4) != fullPrice[index]) throw new Error('price 4')
    
  // }
  
  // check caps
  // for (let index = 0; index < commonIds.length; index++) {
  //   const cap1 = await dadaSale.capsPerDrawing(1, commonIds[index])
  //   const cap2 = await dadaSale.capsPerDrawing(2, commonIds[index])
  //   const cap3 = await dadaSale.capsPerDrawing(3, commonIds[index])
  //   const cap4 = await dadaSale.capsPerDrawing(4, commonIds[index])
    
  //   console.log({drawing: commonIds[index], cap1, cap2, cap3, cap4})
  //   if (cap1.toNumber() != 0) throw new Error('cap 1')
  //   if (cap2.toNumber() != 10) throw new Error('cap 2')
  //   if (cap3.toNumber() != 5) throw new Error('cap 3')
  //   if (cap4.toNumber() != 5) throw new Error('cap 4')
    
  // }
  
  // check allow lists
  for (let index = 0; index < friends.length; index++) {
    const allowed = await dadaSale.allowList(2, friends[index])
    console.log(friends[index])
    if (!allowed) throw new Error(`not allowed ${dadakin[index]}`)
    
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
