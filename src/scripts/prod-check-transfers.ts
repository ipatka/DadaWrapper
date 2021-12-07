import { ethers } from 'hardhat'
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle')

import { BigNumber } from 'ethers'

import { DadaReserve } from '../types/DadaReserve'
import { CollectiblesOwnership } from '../types/CollectiblesOwnership'
import { DadaCollectible } from '../types/DadaCollectible'

import { privatekey } from '../util/util'
import { drawingIds, initialPrintIndexes, totalSupplies } from '../util/simulation'
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
  const dadaSaleAddress = '0x223c3FE815825b90f615355A966999193Ca3d0a3'

  const DadaCollectible = await ethers.getContractFactory('DadaCollectible', admin)
  const DadaSale = await ethers.getContractFactory('DadaSale', admin)

  const dada = (await DadaCollectible.attach(mainnetDadaAddress)) as DadaCollectible
  const dadaSale = (await DadaSale.attach(dadaSaleAddress)) as DadaSale

  const transferDrawingLists = [transferD1, transferD2, transferD3, transferD4, transferD5, transferEnigmaD, transferPurseD]
  const transferPrintLists = [transferP1, transferP2, transferP3, transferP4, transferP5, transferEnigmaP, transferPurseP]

  // const collectiblesOwnership = (await CollectiblesOwnership.attach(dadaNFTAddress)) as CollectiblesOwnership
  for (let index = 0; index < transferDrawingLists.length; index++) {
    const drawingList = transferDrawingLists[index]
    const printList = transferPrintLists[index]
    console.log(drawingList.length, printList.length)
    for (let index = 0; index < drawingList.length; index++) {
      const drawingId = drawingList[index]
      const printId = printList[index]
      const owner = await dada.DrawingPrintToAddress(printId)
      const drawingIdx = drawingIds.indexOf(drawingId)
      const totalSupply = totalSupplies[drawingIdx]
      const initialPrint = initialPrintIndexes[drawingIdx]
      const maxPrint = initialPrint + totalSupply
      console.log({ swapDrawingId: drawingId, totalSupply, initialPrint, swapPrint: printId, maxPrint })
      console.log({ owner })
      if (printId < initialPrint || printId > maxPrint) throw new Error('wrong print')
      if (owner.toLowerCase() !== mainnetDadaReserve.toLowerCase()) throw new Error('not owner')
      await delay(100)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
