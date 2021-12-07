
import { ethers } from 'hardhat'
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle')

import { BigNumber } from 'ethers'

import { DadaCollectible } from '../types/DadaCollectible'
import { DadaReserve } from '../types/DadaReserve'

import { amountsPerRound, drawingIds, initialDemoPrices, initialPrintIndexes, round1, round10, round11, round12, round13, round14, round15, round16, round2, round3, round4, round5, round6, round7, round8, round9, totalSupplies} from '../util/simulation'
import { mnemonic } from '../util/util'

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
  // const ropstenDadaAddress = '0x3A4B0E28Bb7f4B5A4E8302a677A2BDB43FeCB3cF'
  const goerliDadaAddress = '0xb060e218723C53ecA17a47B8e2bF2B0d871c0863'
  const DadaCollectible = await ethers.getContractFactory('DadaCollectible')
  const DadaReserve = await ethers.getContractFactory('DadaReserve')
  const signers = await ethers.getSigners()
  
  const walletMnemonic = mnemonic()
  
  if (!walletMnemonic) throw new Error('No wallet')
  
  const adminAbstract = ethers.Wallet.fromMnemonic(walletMnemonic)

  // const admin = signers[0]
  
  // const provider = ethers.getDefaultProvider("goerli");
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://goerli.infura.io/v3/3b1129f091bb4719bb2bf99dadc44cf0' })
  const admin = await adminAbstract.connect(provider)


  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    admin,
    "https://relay-goerli.flashbots.net",
    "goerli"
  );

  const dada = (await DadaCollectible.attach(goerliDadaAddress)) as DadaCollectible
  const dadaReserve = (await DadaReserve.attach('0x6C86Fb7311D939bDCa8819715Aa2aD8EfF4cDDF9')) as DadaReserve
  const firstNonce = 191
  
  const minerTip = '10000000000000000'
  
  const gasPrice = 10000000000
  
  const unlockTransaction = await dada.populateTransaction.flipSwitchTo(true, {nonce: firstNonce, gasLimit: 30000, gasPrice})
  const executeTransaction = await dadaReserve.populateTransaction.executeRound(1, minerTip, {gasLimit: 5000000, gasPrice, nonce: (firstNonce + 1)})
  const withdrawTransaction = await dada.populateTransaction.withdraw({gasPrice, gasLimit: 40000, nonce: (firstNonce + 2)})
  const relockTransaction = await dada.populateTransaction.flipSwitchTo(false, {nonce: (firstNonce + 3), gasLimit: 30000, gasPrice})
  
  // await admin.sendTransaction(unlockTransaction)
  // await admin.sendTransaction(executeTransaction)
  // await admin.sendTransaction(withdrawTransaction)
  // await admin.sendTransaction(relockTransaction)

  console.log({unlockTransaction, executeTransaction, withdrawTransaction, relockTransaction})
  const signedTransactions = await flashbotsProvider.signBundle([
    {
      signer: admin,
      transaction: unlockTransaction
    },
    {
      signer: admin,
      transaction: executeTransaction
    },
    {
      signer: admin,
      transaction: withdrawTransaction
    },
    {
      signer: admin,
      transaction: relockTransaction
    },
  ]);
  
  console.log({signedTransactions})

  
  const blockNumber = await provider.getBlockNumber();

  console.log(new Date());
  const simulation = await flashbotsProvider.simulate(
    signedTransactions,
    blockNumber + 1
  );
  
  console.log({simulation})
  if ("error" in simulation) {
    console.log(`Simulation Error: ${simulation.error.message}`);
  } else {
    console.log(
      `Simulation Success: ${blockNumber} ${JSON.stringify(
        simulation,
        null,
        2
      )}`
    );
  }

  for (var i = 1; i <= 10; i++) {
    const bundleSubmission = flashbotsProvider.sendRawBundle(
      signedTransactions,
      blockNumber + i
    );
    console.log("submitted for block # ", blockNumber + i);
  }
  console.log("bundles submitted");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
