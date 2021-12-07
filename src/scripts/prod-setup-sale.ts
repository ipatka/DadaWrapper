// reserve address 0xDB4767fab12541A35b9D6C9f7ccB2D36B9EcF646
import { ethers } from "hardhat";
import { privatekey } from '../util/util'

import { DadaSale } from '../types/DadaSale'
import { DadaReserve } from '../types/DadaReserve'

import { swapDrawingIds, tokenIds, printIds } from "../util/swapList";

const ownerRole = ethers.utils.solidityKeccak256(['string'], ['OWNER_ROLE'])

// const dadaReserveAddress = '0x76bde5bef7071a87d1236f150e09c05e05457224'
const dadaReserveAddress = '0xDB4767fab12541A35b9D6C9f7ccB2D36B9EcF646'
const dadaSaleAddress = '0x223c3FE815825b90f615355A966999193Ca3d0a3'
// const dadaSaleAddress = '0xd7862aef3458ec0bf9c72bb8e731cf7b01cbf830'

async function main() {
  const accounts = await ethers.getSigners();
  const walletKey = privatekey()
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://ropsten.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const DadaSale = await ethers.getContractFactory('DadaSale', admin)

  const DadaReserve = await ethers.getContractFactory('DadaReserve', admin)
  // const dadaReserve = (await DadaReserve.attach(dadaReserveAddress)) as DadaReserve
  const dadaSale = (await DadaSale.attach(dadaSaleAddress)) as DadaSale

  const swapList: [number, number, number][] = tokenIds.map((value: number, index: number) => [value, swapDrawingIds[index], printIds[index]])
  const swapLists: [number, number, number][][] = []
  
  for (let index = 0; index < 7; index++) {
    const start = index * 100
    const end = index * 100 + (index === 6 ? 62 : 100)
    console.log({ start, end })
    const slice = swapList.slice(start, end)
    const sliceLength = slice.length
    console.log(sliceLength)
    console.log({ slice })
    swapLists.push(slice)
  }

  for (let index = 0; index < swapLists.length; index++) {
    await dadaSale.setSwapList(swapLists[index], true)
  }
  
  // enable swaps
  await dadaSale.setContractState([true])

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });