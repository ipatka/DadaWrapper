import { DadaCollectibleWrapper } from '../types/DadaCollectibleWrapper'

const { ethers } = require('hardhat')

async function main() {
  const dadaCollectibleAddress = '0x068696A3cf3c4676B65F1c9975dd094260109d02'
  const dadaNftAddress = '0x34d77a17038491a2a9eaa6e690b7c7cd39fc8392'

  const Wrapper = await ethers.getContractFactory('DadaCollectibleWrapper')

  const uri = 'https://dada-metadata.s3.amazonaws.com/tokens/'
  const contractUri = 'https://dada-metadata.s3.amazonaws.com/contract.json'

  const gasPrice = 85000000000

  const wrapper = (await Wrapper.deploy(dadaCollectibleAddress, dadaNftAddress, uri, contractUri, { gasPrice })) as DadaCollectibleWrapper

  console.log({ wrapper })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
