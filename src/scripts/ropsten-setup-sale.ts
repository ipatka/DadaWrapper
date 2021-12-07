// reserve address 0xDB4767fab12541A35b9D6C9f7ccB2D36B9EcF646
import { ethers } from 'hardhat'

import { DadaSale } from '../types/DadaSale'
import { DadaReserve } from '../types/DadaReserve'
import { AnyNft } from '../types/AnyNft'
import { CollectiblesOwnership } from '../types/CollectiblesOwnership'
import { CollectionBaseItemModel } from '../types/CollectionBaseItemModel'

import { drawingIds, salePrices } from '../util/simulation'
import { BigNumber } from 'ethers'
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const ownerRole = ethers.utils.solidityKeccak256(['string'], ['OWNER_ROLE'])
const testMultisig = '0xCb605F115A36875f78862B281Fe230aaBdE60d9E' // Replace with conservatory address on mainnet
const dadaReserveAddress = '0xDB4767fab12541A35b9D6C9f7ccB2D36B9EcF646'
const dadaCollectibleAddress = '0x3a4b0e28bb7f4b5a4e8302a677a2bdb43fecb3cf'
// const anyNftAddress = '0xe13A865bf7b7bb6B5f1C46DD7C050CD6969f26D5'
const dadaSaleAddress = '0x223c3FE815825b90f615355A966999193Ca3d0a3'

const dadaMetaAddress = '0xEC1858c9c17c7bAc8e7f8DA5579f3deD7b954394'

const dadaNftAddress = '0x8296c260f4A05A11320F55008Cf3F65d8D3a9bBC'

async function main() {
  const accounts = await ethers.getSigners()
  const AnyNft = await ethers.getContractFactory('AnyNFT')
  const DadaSale = await ethers.getContractFactory('DadaSale')
  const CollectiblesOwnership = await ethers.getContractFactory('CollectiblesOwnership')
  const CollectionBaseItemModel = await ethers.getContractFactory('CollectionBaseItemModel')

  const DadaReserve = await ethers.getContractFactory('DadaReserve')
  const dadaReserve = (await DadaReserve.attach(dadaReserveAddress)) as DadaReserve
  
  const prices: [number, BigNumber][] = drawingIds.map((value: number, index: number) => [value, BigNumber.from(salePrices[index])])

  const dadaSale = (await DadaSale.attach(dadaSaleAddress)) as DadaSale
  await dadaSale.setPriceList(1, prices)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
