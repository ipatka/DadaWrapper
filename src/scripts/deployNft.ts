import { MockDadaNft } from "../types/MockDadaNft"

const { ethers } = require('hardhat')


async function main() {
// const dadaCollectibleAddress = '0x3a4b0e28bb7f4b5a4e8302a677a2bdb43fecb3cf'
// const dadaNftAddress = '0x8296c260f4A05A11320F55008Cf3F65d8D3a9bBC'
const to = '0x744222844bFeCC77156297a6427B5876A6769e19'

  const Mock = await ethers.getContractFactory('MockDadaNFT')
  
  const mock = (await Mock.deploy()) as MockDadaNft
  await mock.mintItem(to, 101)
  await mock.mintItem(to, 102)
  await mock.mintItem(to, 103)
  
  console.log({mock})
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

