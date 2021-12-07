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

  const gasPrice = '5000000000'
  const nonce = 1739
  await admin.sendTransaction({to: admin.address, value: 0, gasPrice, nonce})
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
