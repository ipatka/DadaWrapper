import { DadaCollectibleWrapper } from "../types/DadaCollectibleWrapper"

const { ethers } = require('hardhat')


async function main() {
const dadaCollectibleAddress = '0x3a4b0e28bb7f4b5a4e8302a677a2bdb43fecb3cf'
const dadaNftAddress = '0xDc4298E4673F8Dc2799bf1b0D1D621Cc14D410F1'

  const Wrapper = await ethers.getContractFactory('DadaCollectibleWrapper')
  
  const uri = 'placeholder/'
  const contractUri = 'placeholder.json'

  const wrapper = (await Wrapper.deploy(dadaCollectibleAddress, dadaNftAddress, uri, contractUri)) as DadaCollectibleWrapper
  
  
  console.log({wrapper})
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

