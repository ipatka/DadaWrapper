import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'

import { DadaCollectible } from '../types/DadaCollectible'
import { DadaReserve } from '../types/DadaReserve'

import { amountsPerRound, drawingIds, initialDemoPrices, initialPrintIndexes, round1, round10, round11, round12, round13, round14, round15, round16, round2, round3, round4, round5, round6, round7, round8, round9, totalSupplies} from '../util/simulation'

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
  // const ropstenDadaAddress = '0x3A4B0E28Bb7f4B5A4E8302a677A2BDB43FeCB3cF'
  const goerliDadaAddress = '0xb060e218723C53ecA17a47B8e2bF2B0d871c0863'
  const DadaCollectible = await ethers.getContractFactory('DadaCollectible')
  const DadaReserve = await ethers.getContractFactory('DadaReserve')
  const signers = await ethers.getSigners()
  
  const provider = ethers.provider

  const deployer = signers[0]
  const admin = signers[1]
  
  const adminBalance = await admin.getBalance()
  console.log({adminBalance})

  // const dada = (await DadaCollectible.deploy()) as DadaCollectible
  const dada = (await DadaCollectible.attach(goerliDadaAddress)) as DadaCollectible
  // await dada.deployTransaction.wait()
  // const dadaReserve = (await DadaReserve.deploy(drawingIds, dada.address)) as DadaReserve
  const dadaReserve = (await DadaReserve.attach('0x6C86Fb7311D939bDCa8819715Aa2aD8EfF4cDDF9')) as DadaReserve
  // console.log('waiting for deploy')
  // await dadaReserve.deployTransaction.wait()

  // let nonceTracker = 164
  // for (let index = 0; index < drawingIds.length; index++) {
  //   try {
  //     console.log(`minting drawing id ${drawingIds[index].toString()} at index ${index.toString()}} with nonce ${(nonceTracker).toString()}`)
  //   dada.newCollectible(
  //     drawingIds[index],
  //     'test',
  //     totalSupplies[index],
  //     initialDemoPrices[index],
  //     initialPrintIndexes[index],
  //     'testName',
  //     1,
  //     'rare',
  //     {nonce: nonceTracker}
  //   )
  //   // console.log({newMint})
  //   // await newMint.wait()
  //   nonceTracker = nonceTracker + 1
  //   await delay(500)

  //   } catch (e: any) {
  //     console.log({e})
  //     break
  //   }
  //   // console.log({mintTx})
  //   // await mintTx.wait()
  // }
  
  // // Unpause the contract
  // await dada.flipSwitchTo(true, {nonce: nonceTracker})
  // // console.log({flipTx})
  
  // // await flipTx.wait()

  // let priceLookup: { [key: number]: string } = {}

  // for (let index = 0; index < drawingIds.length; index++) {
  //   const drawingId = drawingIds[index]
  //   priceLookup[drawingId] = initialDemoPrices[index]
  // }

  // Prepurchase same ids that are purchased on mainnet
  // for (let index = 0; index < prepurchasePrintIds.length; index++) {
  //   const printIndex = prepurchasePrintIds[index]
  //   const drawingId = prepurchaseDrawingIds[index]
  //   await dadaAsAdmin.alt_buyCollectible(drawingId, printIndex, { value: BigNumber.from(priceLookup[drawingId]) })
  // }

  // create the rounds
  const rounds = [
    round1,
    round2,
    round3,
    round4,
    round5,
    round6,
    round7,
    round8,
    round9,
    round10,
    round11,
    round12,
    round13,
    round14,
    round15,
    round16,
  ]
  const nonceStart = 164
  for (let index = 0; index < rounds.length; index++) {
    const round = rounds[index];
    console.log({index})
    dadaReserve.createRound(index + 1, round, {nonce: nonceStart + index}) 
    await delay(500)
  }
  
  // // move eth to reserve
  // await deployer.sendTransaction({to: dadaReserve.address, value: BigNumber.from("2000000000000000000000")})

        // Execute simulation
      // let nonceTracker = 275
      // let runningBalance = 0
      // for (let index = 1; index <= 16; index++) {
      //     const roundNumber = index
      //     const rounds = Math.ceil(amountsPerRound[roundNumber - 1] / sliceSize )
      //     console.log({ rounds })
      //     for (let index = 0; index < rounds; index++) {
      //       console.log(`executing round ${roundNumber.toString()} iteration ${index.toString()}`)
      //       const reserveEth = await provider.getBalance(dadaReserve.address)
      //       const adminEth = await admin.getBalance()
      //       console.log(`Reserve has ${reserveEth.toString()} left`)
      //       console.log(`Admin has ${adminEth.toString()} left`)
      //       try {
      //         const estimate = await dadaReserve.estimateGas.executeRound(roundNumber, {gasLimit: 5000000})
      //         console.log({estimate: estimate.toString()})
      //         dadaReserve.executeRound(roundNumber, {gasLimit: 5000000, nonce: nonceTracker})
      //         nonceTracker = nonceTracker + 1
      //         await delay(500)
      //       } catch (e: any) {
      //         console.log({ e })
      //         break
      //       }
      //     }
      //     runningBalance += amountsPerRound[roundNumber - 1]
      //     const reserveBalance = await dada.balanceOf(dadaReserve.address)
      //     console.log(`Reserve Balance: ${reserveBalance.toString()}, Expected: ${runningBalance.toString()}`)
      // }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
