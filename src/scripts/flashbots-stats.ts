import { ethers } from 'hardhat'

import axios from 'axios'

import { utils } from 'ethers'

import { privatekey } from '../util/util'

async function getUserStats(admin: any, blockNumber: string) {
  const getUserStatsBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'flashbots_getUserStats',
    params: [
      {
        blockNumber, // String, a hex encoded recent block number, in order to prevent replay attacks. Must be within 20 blocks of the current chain tip.
      },
    ],
  }
  const userStatsSignature = admin.address + ':' + (await admin.signMessage(utils.id(JSON.stringify(getUserStatsBody))))

  const userStats = await axios.post('https://relay.flashbots.net', getUserStatsBody, {
    headers: { 'X-Flashbots-Signature': userStatsSignature, 'Content-Type': 'application/json' },
  })

  console.log({ userStats: userStats.data })
}

async function getBundleStats(admin: any, blockNumber: string, bundleHash: string) {
  const getBundleStatsBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'flashbots_getBundleStats',
    params: [
      {
        bundleHash, // String, returned by the flashbots api when calling eth_sendBundle
        blockNumber, // String, a hex encoded block number
      },
    ],
  }

  const bundleStatsSignature = admin.address + ':' + (await admin.signMessage(utils.id(JSON.stringify(getBundleStatsBody))))
  const bundleStats = await axios.post('https://relay.flashbots.net', getBundleStatsBody, {
    headers: { 'X-Flashbots-Signature': bundleStatsSignature, 'Content-Type': 'application/json' },
  })
  console.log({ bundleStats: bundleStats.data })

}

async function main() {
  const walletKey = privatekey()

  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)


  const bundleHash = 'todo'
  const blockNumber = '0xC790E1' // has to be hex encoded


  await getUserStats(admin, blockNumber)
  // await getBundleStats(admin, blockNumber, bundleHash)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
