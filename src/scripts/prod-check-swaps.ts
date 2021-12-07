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
  swapDrawingIds,
  printIds,
  tokenIds,
} from '../util/swapList'
import { DadaSale } from '../types/DadaSale'

async function main() {
  const walletKey = privatekey()

  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://ropsten.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  // const mainnetDadaAddress = '0x068696A3cf3c4676B65F1c9975dd094260109d02'
const dadaCollectibleAddress = '0x3a4b0e28bb7f4b5a4e8302a677a2bdb43fecb3cf'
  // const mainnetDadaReserve = '0x76bde5bef7071a87d1236f150e09c05e05457224'
  const ropstenDadaReserve = '0xDB4767fab12541A35b9D6C9f7ccB2D36B9EcF646'
  const dadaSaleAddress = '0x223c3FE815825b90f615355A966999193Ca3d0a3'
  const dadaNFTAddress = '0x34d77a17038491a2a9eaa6e690b7c7cd39fc8392'

  const DadaCollectible = await ethers.getContractFactory('DadaCollectible', admin)
  const DadaReserve = await ethers.getContractFactory('DadaReserve', admin)
  const DadaSale = await ethers.getContractFactory('DadaSale', admin)
  const CollectiblesOwnership = await ethers.getContractFactory('CollectiblesOwnership', admin)

  const dada = (await DadaCollectible.attach(dadaCollectibleAddress)) as DadaCollectible
  const dadaReserve = (await DadaReserve.attach(ropstenDadaReserve)) as DadaReserve
  const dadaSale = (await DadaSale.attach(dadaSaleAddress)) as DadaSale

  // const collectiblesOwnership = (await CollectiblesOwnership.attach(dadaNFTAddress)) as CollectiblesOwnership
  console.log(swapDrawingIds.length, printIds.length, tokenIds.length)
  for (let index = 0; index < swapDrawingIds.length; index++) {
    const thisToken = tokenIds[index]
    // const tokenOwner = await collectiblesOwnership.ownerOf(thisToken)
    // console.log({thisToken, tokenOwner})
    const swapDrawingId = swapDrawingIds[index]
    const swapPrint = printIds[index]
    const swapReserved = await dadaSale.swapReserved(swapPrint)
    const swapDrawing = await dadaSale.swapList(thisToken)
    console.log({swapReserved})
    console.log({id: swapDrawing.DrawingId.toNumber(), index: swapDrawing.PrintIndex.toNumber()})
    const owner = await dada.DrawingPrintToAddress(swapPrint)
    const drawingIdx = drawingIds.indexOf(swapDrawingId)
    const totalSupply = totalSupplies[drawingIdx]
    const initialPrint = initialPrintIndexes[drawingIdx]
    const maxPrint = initialPrint + totalSupply
    console.log({ swapDrawingId, totalSupply, initialPrint, swapPrint, maxPrint })
    console.log({ owner })
    if (swapPrint < initialPrint || swapPrint > maxPrint) throw new Error('wrong print')
    if (owner.toLowerCase() !== ropstenDadaReserve.toLowerCase()) throw new Error('not owner')
    if (swapReserved == false) throw new Error('missed')
    await delay(100)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
