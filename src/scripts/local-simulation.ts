import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'

import { DadaCollectible } from '../types/DadaCollectible'
import { DadaReserve } from '../types/DadaReserve'
import {
  amountsPerRound,
  drawingIds,
  initialPrices,
  initialPrintIndexes,
  prepurchaseDrawingIds,
  prepurchasePrintIds,
  round1,
  round10,
  round11,
  round12,
  round13,
  round14,
  round15,
  round16,
  round2,
  round3,
  round4,
  round5,
  round6,
  round7,
  round8,
  round9,
  totalSupplies,
} from '../util/simulation'

async function main() {
  const DadaCollectible = await ethers.getContractFactory('DadaCollectible')
  const DadaReserve = await ethers.getContractFactory('DadaReserve')
  const signers = await ethers.getSigners()

  const operatorRole = ethers.utils.solidityKeccak256(['string'], ['OPERATOR_ROLE'])
  const ownerRole = ethers.utils.solidityKeccak256(['string'], ['OWNER_ROLE'])
  
  const provider = ethers.provider

  const deployer = signers[0]
  const admin = signers[1]
  
  const adminBalance = await admin.getBalance()
  console.log({adminBalance})

  const sliceSize = 25

  const dada = (await DadaCollectible.deploy()) as DadaCollectible
  const dadaReserve = (await DadaReserve.deploy(drawingIds, dada.address)) as DadaReserve

  const dadaAsAdmin = await dada.connect(admin)
  const dadaReserveAsAdmin = await dadaReserve.connect(admin)

    await dadaReserve.grantRole(operatorRole, admin.address)


  for (let index = 0; index < drawingIds.length; index++) {
    await dada.newCollectible(
      drawingIds[index],
      'test',
      totalSupplies[index],
      initialPrices[index],
      initialPrintIndexes[index],
      'testName',
      1,
      'rare'
    )
  }
  
  // Unpause the contract
  await dada.flipSwitchTo(true)

  let priceLookup: { [key: number]: string } = {}

  for (let index = 0; index < drawingIds.length; index++) {
    const drawingId = drawingIds[index]
    priceLookup[drawingId] = initialPrices[index]
  }

  // Prepurchase same ids that are purchased on mainnet
  for (let index = 0; index < prepurchasePrintIds.length; index++) {
    const printIndex = prepurchasePrintIds[index]
    const drawingId = prepurchaseDrawingIds[index]
    await dadaAsAdmin.alt_buyCollectible(drawingId, printIndex, { value: BigNumber.from(priceLookup[drawingId]) })
  }

  // create the rounds
  await dadaReserveAsAdmin.createRound(1, round1)
  await dadaReserveAsAdmin.createRound(2, round2)
  await dadaReserveAsAdmin.createRound(3, round3)
  await dadaReserveAsAdmin.createRound(4, round4)
  await dadaReserveAsAdmin.createRound(5, round5)
  await dadaReserveAsAdmin.createRound(6, round6)
  await dadaReserveAsAdmin.createRound(7, round7)
  await dadaReserveAsAdmin.createRound(8, round8)
  await dadaReserveAsAdmin.createRound(9, round9)
  await dadaReserveAsAdmin.createRound(10, round10)
  await dadaReserveAsAdmin.createRound(11, round11)
  await dadaReserveAsAdmin.createRound(12, round12)
  await dadaReserveAsAdmin.createRound(13, round13)
  await dadaReserveAsAdmin.createRound(14, round14)
  await dadaReserveAsAdmin.createRound(15, round15)
  await dadaReserveAsAdmin.createRound(16, round16)
  
  // move eth to reserve
  await deployer.sendTransaction({to: dadaReserve.address, value: BigNumber.from("2000000000000000000000")})

        // Execute simulation
      let runningBalance = 0
      for (let index = 1; index <= 16; index++) {
          const roundNumber = index
          const rounds = Math.ceil(amountsPerRound[roundNumber - 1] / sliceSize )
          console.log({ rounds })
          for (let index = 0; index < rounds; index++) {
            console.log(`executing round ${roundNumber.toString()} iteration ${index.toString()}`)
            const reserveEth = await provider.getBalance(dadaReserve.address)
            const adminEth = await admin.getBalance()
            console.log(`Reserve has ${reserveEth.toString()} left`)
            console.log(`Admin has ${adminEth.toString()} left`)
            try {
              const estimate = await dadaReserveAsAdmin.estimateGas.executeRound(roundNumber, 0, {gasLimit: 5000000})
              console.log({estimate: estimate.toString()})
              await dadaReserveAsAdmin.executeRound(roundNumber, 0, {gasLimit: 5000000})
            } catch (e: any) {
              console.log({ e })
              break
            }
          }
          runningBalance += amountsPerRound[roundNumber - 1]
          const reserveBalance = await dada.balanceOf(dadaReserve.address)
          console.log(`Reserve Balance: ${reserveBalance.toString()}, Expected: ${runningBalance.toString()}`)
      }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
