import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'

import { DadaCollectible } from '../types/DadaCollectible'
import { DadaReserve } from '../types/DadaReserve'

import { amountsPerRound, drawingIds, initialDemoPrices, initialPrintIndexes, round1, round10, round11, round12, round13, round14, round15, round16, round2, round3, round4, round5, round6, round7, round8, round9, totalSupplies} from '../util/simulation'
import { privatekey } from '../util/util'

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
  const mainnetDadaAddress = '0x068696A3cf3c4676B65F1c9975dd094260109d02'

  const walletKey = privatekey()
  
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const DadaCollectible = await ethers.getContractFactory('DadaCollectible', admin)
  const DadaReserve = await ethers.getContractFactory('DadaReserve', admin)
  
  const adminBalance = await admin.getBalance()
  console.log({adminBalance})

  const gasPrice = 90000000000 // TODO mainnet gas price

  // const dada = (await DadaCollectible.deploy()) as DadaCollectible
  const dada = (await DadaCollectible.attach(mainnetDadaAddress)) as DadaCollectible
  // const dadaReserve = (await DadaReserve.deploy(drawingIds, dada.address, {gasPrice})) as DadaReserve
  const dadaReserve = (await DadaReserve.attach('0x76BDE5bef7071A87D1236F150e09c05e05457224')) as DadaReserve
  // console.log('waiting for deploy')
  // await dadaReserve.deployTransaction.wait()

  // create the rounds
  const rounds = [
    // round1,
    // round2,
    // round3,
    // round4,
    // round5,
    // round6,
    // round7,
    // round8,
    // round9,
    // round10,
    // round11,
    // round12,
    // round13,
    // round14,
    // round15,
    // round16,
  ]
  const nonceStart = 1189 // TODO make sure this is updated
  // for (let index = 0; index < rounds.length; index++) {
    // const round = rounds[index];
    // console.log({index})
    // const tx = await dadaReserve.createRound(index + 1, round, {nonce: nonceStart + index, gasPrice}) 
    const tx = await dadaReserve.createRound(11, round11, {nonce: nonceStart, gasPrice})
    console.log({tx})
    await delay(500)
  // }
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
