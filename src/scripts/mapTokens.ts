import { MockDadaNft } from "../types/MockDadaNft"

const { ethers } = require('hardhat')


async function main() {
const dadaNftAddress = '0x34d77a17038491a2a9eaa6e690b7c7cd39fc8392'

const Dada721 = await ethers.getContractFactory('MockDadaNFT')
const nft = (await Dada721.attach(dadaNftAddress)) as MockDadaNft
  
  

for (let index = 0; index < 2258; index++) {
  const info = await nft.collectibleInfo(index)
  console.log(`${index} ${info[0]}`)
  
}
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

