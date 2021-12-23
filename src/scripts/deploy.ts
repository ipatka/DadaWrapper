import { DadaCollectibleWrapper } from "../types/DadaCollectibleWrapper"

const { ethers } = require('hardhat')


async function main() {
const dadaCollectibleAddress = '0xAaDDe94e690EC67CD9AaE3f9D7bF38E065810111'
const dadaNftAddress = '0x7A8671a0b3b29268eED685da9CbF193157D85aF9'

  const Wrapper = await ethers.getContractFactory('DadaCollectibleWrapper')
  
  const uri = 'https://dada-metadata.s3.amazonaws.com/tokens/'
  const contractUri = 'https://dada-metadata.s3.amazonaws.com/contract.json'

  const wrapper = (await Wrapper.deploy(dadaCollectibleAddress, dadaNftAddress, uri, contractUri)) as DadaCollectibleWrapper
  
  
  console.log({wrapper})
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

