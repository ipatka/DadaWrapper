import { ethers } from 'hardhat'
import { DadaCollectible } from '../src/types/DadaCollectible'
import { drawingIds, initialPrintIndexes } from '../src/util/simulation'

export const fastForwardTime = async (seconds: number) => {
  await ethers.provider.send('evm_increaseTime', [seconds])
  await ethers.provider.send("evm_mine", [])
}

export const fastForwardBlocks = async (blocks: number) => {
  for (let index = 0; index < blocks; index++) {
    await ethers.provider.send("evm_mine", [])
  }
}

export function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export const getNextOwnedPrint = async (drawingID: number, owner: string, dada: DadaCollectible) => {
  const index = drawingIds.indexOf(drawingID)
  if (index < 0) throw new Error('not found')
  
  const collectible = await dada.drawingIdToCollectibles(drawingID)
  const totalSupply = collectible.totalSupply.toNumber()
  
  const printIndexStart = initialPrintIndexes[index]
  const printIndexEnd = printIndexStart + totalSupply
  
  
  for (let index = 0; index < totalSupply; index++) {
    const printOwner = await dada.DrawingPrintToAddress(printIndexStart + index)
    if (printOwner.toLowerCase() === owner.toLowerCase()) return (printIndexStart + index)
  }
  throw new Error('no owned print')

}

export const getNextOwnedPrints = async (drawingID: number, numPerDrawing: number, owner: string, dada: DadaCollectible) => {
  const index = drawingIds.indexOf(drawingID)
  if (index < 0) throw new Error('not found')
  
  const collectible = await dada.drawingIdToCollectibles(drawingID)
  const totalSupply = collectible.totalSupply.toNumber()
  
  const printIndexStart = initialPrintIndexes[index]
  const printIndexEnd = printIndexStart + totalSupply
  
  
  const ownedPrints = []
  for (let index = 0; index < totalSupply; index++) {
    const printOwner = await dada.DrawingPrintToAddress(printIndexStart + index)
    if (printOwner.toLowerCase() === owner.toLowerCase()) ownedPrints.push(printIndexStart + index)
    if (ownedPrints.length === numPerDrawing) break
  }
  return ownedPrints
  // throw new Error(`no owned print: ${drawingIds.toString()}`)

}