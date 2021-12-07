// reserve address 0xDB4767fab12541A35b9D6C9f7ccB2D36B9EcF646
import { ethers } from 'hardhat'
import { privatekey } from '../util/util'

import { DadaSale } from '../types/DadaSale'

import { BigNumber } from '@ethersproject/bignumber'
import {
  commonIds,
  dadakin,
  discountPrice,
  drawingIds,
  friends,
  fullPrice,
  public1a,
  public2,
  public2a,
  public3,
  public3a,
  public4,
  public4a,
  publicList1,
  swappersA,
  swappersB,
} from '../util/salePrep'

const operatorRole = ethers.utils.solidityKeccak256(['string'], ['OPERATOR_ROLE'])

// const dadaReserveAddress = '0x76bde5bef7071a87d1236f150e09c05e05457224'
const dadaSaleAddress = '0xd7862aef3458ec0bf9c72bb8e731cf7b01cbf830'
const dadaMultisig = '0x4Dd7aC46603d0F566455c489d3A92d48727E7Aa8'
// const dadaSaleAddress = '0xd7862aef3458ec0bf9c72bb8e731cf7b01cbf830'

// todo for rounds

// 1 - set price lists (dadakin, discount, holders, public)
// 1a - set drawing cap (0, 10, 5, 5) per commons
// 2 - set allow lists (dadakin, discount, holders, public)
// 3 - enable dadakin round

async function main() {
  const walletKey = privatekey()
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const DadaSale = await ethers.getContractFactory('DadaSale', admin)

  const dadaSale = (await DadaSale.attach(dadaSaleAddress)) as DadaSale

  const gasPrice = '50000000000'
  let nonce = 1707

  const discountPriceList: [number, BigNumber][] = drawingIds.map((value: number, index: number) => [
    value,
    ethers.utils.parseEther(discountPrice[index].toString()),
  ])
  const priceList: [number, BigNumber][] = drawingIds.map((value: number, index: number) => [
    value,
    ethers.utils.parseEther(fullPrice[index].toString()),
  ])

  const round2caps: [number, number][] = commonIds.map((value: number, index: number) => [value, 10])
  const round3caps: [number, number][] = commonIds.map((value: number, index: number) => [value, 5])
  const round4caps: [number, number][] = commonIds.map((value: number, index: number) => [value, 5])

  // await dadaSale.setPriceList(1, discountPriceList, { gasPrice, nonce })

  // nonce++
  // await dadaSale.setPriceList(2, discountPriceList, { gasPrice, nonce })

  // nonce++
  // await dadaSale.setDrawingCap(2, round2caps, { gasPrice, nonce })

  // nonce++
  // await dadaSale.setAllowList(1, dadakin, true, { gasPrice, nonce })

  // nonce++
  // await dadaSale.setAllowList(2, friends, true, { gasPrice, nonce })

  // nonce++
  // await dadaSale.setContractState([true, true], { gasPrice, nonce })
  
  // nonce++
  // await dadaSale.grantRole(operatorRole, dadaMultisig, {gasPrice, nonce})

  // // Public rounds
  // nonce++
  // await dadaSale.setPriceList(3, discountPriceList, { gasPrice, nonce })

  // nonce++
  // await dadaSale.setPriceList(4, priceList, { gasPrice, nonce })


  // nonce++
  // await dadaSale.setDrawingCap(3, round3caps, { gasPrice, nonce })

  // nonce++
  // await dadaSale.setDrawingCap(4, round4caps, { gasPrice, nonce })


  // nonce++
  // await dadaSale.setAllowList(3, swappers1, true, { gasPrice })
  nonce++
  await dadaSale.setAllowList(3, swappersA, true, { gasPrice })
  nonce++
  await dadaSale.setAllowList(3, swappersB, true, { gasPrice })

  nonce++
  await dadaSale.setAllowList(4, publicList1, true, { gasPrice })
  nonce++
  await dadaSale.setAllowList(4, public1a, true, { gasPrice })
  nonce++
  await dadaSale.setAllowList(4, public2, true, { gasPrice })
  nonce++
  await dadaSale.setAllowList(4, public2a, true, { gasPrice })
  nonce++
  await dadaSale.setAllowList(4, public3, true, { gasPrice })
  // nonce++
  // await dadaSale.setAllowList(4, public3a, true, { gasPrice })
  nonce++
  await dadaSale.setAllowList(4, public4, true, { gasPrice })
  // nonce++
  // await dadaSale.setAllowList(4, public4a, true, { gasPrice })

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
