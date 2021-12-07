// reserve address 0xDB4767fab12541A35b9D6C9f7ccB2D36B9EcF646
import { ethers } from "hardhat";

import { DadaSale } from '../types/DadaSale'
import { DadaReserve } from '../types/DadaReserve'
import { AnyNft } from '../types/AnyNft'

const ownerRole = ethers.utils.solidityKeccak256(['string'], ['OWNER_ROLE'])
const testMultisig = '0xCb605F115A36875f78862B281Fe230aaBdE60d9E' // Replace with conservatory address on mainnet
const dadaReserveAddress = '0xDB4767fab12541A35b9D6C9f7ccB2D36B9EcF646'
const dadaCollectibleAddress = '0x3a4b0e28bb7f4b5a4e8302a677a2bdb43fecb3cf'
// const anyNftAddress = '0xe13A865bf7b7bb6B5f1C46DD7C050CD6969f26D5'
const anyNftAddress = '0x8296c260f4A05A11320F55008Cf3F65d8D3a9bBC'
const dadaSaleAddress = '0x86e2C1f4b4B803c85A47a5Bd13E05D30850e3D4D'

async function main() {
  const accounts = await ethers.getSigners();
const AnyNft = await ethers.getContractFactory('AnyNFT')
const DadaSale = await ethers.getContractFactory('DadaSale')

const DadaReserve = await ethers.getContractFactory('DadaReserve')
const dadaReserve = (await DadaReserve.attach(dadaReserveAddress)) as DadaReserve

  // const anyNft = (await AnyNft.attach(anyNftAddress)) as AnyNft
// const dadaSale = await DadaSale.deploy(dadaReserveAddress, dadaCollectibleAddress, anyNft.address, testMultisig)
const dadaSale = await DadaSale.deploy(dadaReserveAddress, dadaCollectibleAddress, anyNftAddress, testMultisig)
// const dadaSale = await DadaSale.attach(dadaSaleAddress)
// await dadaReserve.grantRole(ownerRole, dadaSale.address)

// for (let index = 0; index < 5; index++) {
//   await anyNft.mint(accounts[0].address)
// }


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });