import { DadaCollectible } from "../types/DadaCollectible"
import { drawingIds, initialDemoPrices, initialPrintIndexes, totalSupplies } from "../util/simulation"

const { ethers } = require('hardhat')


function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
async function main() {
// const dadaCollectibleAddress = '0x3a4b0e28bb7f4b5a4e8302a677a2bdb43fecb3cf'
// const dadaNftAddress = '0x8296c260f4A05A11320F55008Cf3F65d8D3a9bBC'
const to = '0x744222844bFeCC77156297a6427B5876A6769e19'

  const Dada = await ethers.getContractFactory('DadaCollectible')
  
  const dada = (await Dada.deploy()) as DadaCollectible
  await dada.deployTransaction.wait()

  let nonceTracker = 1
  for (let index = 0; index < drawingIds.length; index++) {
    try {
      console.log(`minting drawing id ${drawingIds[index].toString()} at index ${index.toString()}} with nonce ${(nonceTracker).toString()}`)
    dada.newCollectible(
      drawingIds[index],
      'test',
      totalSupplies[index],
      initialDemoPrices[index],
      initialPrintIndexes[index],
      'testName',
      1,
      'rare',
      {nonce: nonceTracker}
    )
    // console.log({newMint})
    // await newMint.wait()
    nonceTracker = nonceTracker + 1
    await delay(500)

    } catch (e: any) {
      console.log({e})
      break
    }
    // console.log({mintTx})
    // await mintTx.wait()
  }
  
  // Unpause the contract
  await dada.flipSwitchTo(true, {nonce: nonceTracker})
  // console.log({flipTx})
  
  // await flipTx.wait()
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

