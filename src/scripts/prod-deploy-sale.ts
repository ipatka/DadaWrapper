// reserve address 0xDB4767fab12541A35b9D6C9f7ccB2D36B9EcF646
import { ethers } from "hardhat";
import { privatekey } from '../util/util'

import { DadaSale } from '../types/DadaSale'
import { DadaReserve } from '../types/DadaReserve'
import { CollectiblesOwnership } from '../types/CollectiblesOwnership'

const ownerRole = ethers.utils.solidityKeccak256(['string'], ['OWNER_ROLE'])
const dadaConservatory = '0x014D90CAb18eC418dDe367d4F12B58a1f7a32B02'
const dadaReserveAddress = '0x76bde5bef7071a87d1236f150e09c05e05457224'
const dadaCollectibleAddress = '0x068696A3cf3c4676B65F1c9975dd094260109d02'
const dadaNFTAddress = '0x34d77a17038491a2a9eaa6e690b7c7cd39fc8392'

async function main() {
  const accounts = await ethers.getSigners();
  const walletKey = privatekey()
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const DadaSale = await ethers.getContractFactory('DadaSale', admin)
  const CollectiblesOwnership = await ethers.getContractFactory('CollectiblesOwnership', admin)
  
  const collectiblesOwnership = (await CollectiblesOwnership.attach(dadaNFTAddress)) as CollectiblesOwnership

  const DadaReserve = await ethers.getContractFactory('DadaReserve', admin)
  const dadaReserve = (await DadaReserve.attach(dadaReserveAddress)) as DadaReserve

const dadaSale = await DadaSale.deploy(dadaReserveAddress, dadaCollectibleAddress, dadaNFTAddress, dadaConservatory)
await dadaReserve.grantRole(ownerRole, dadaSale.address)
await collectiblesOwnership.setClaimEnabler(dadaSale.address)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });