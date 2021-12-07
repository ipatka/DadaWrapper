
import { ethers } from 'hardhat'
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle')

import { BigNumber } from 'ethers'

import { DadaCollectible } from '../types/DadaCollectible'

import { privatekey } from '../util/util'

async function main() {
  const walletKey = privatekey()
  
  const adminAbstract = new ethers.Wallet(walletKey)
  const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/9a8b1c46717d4707bdeef517bf0ee00b' })
  const admin = await adminAbstract.connect(provider)

  const mainnetDadaAddress = '0x068696A3cf3c4676B65F1c9975dd094260109d02'
  const DadaCollectible = await ethers.getContractFactory('DadaCollectible', admin)
  
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    admin,
  );

  const dada = (await DadaCollectible.attach(mainnetDadaAddress)) as DadaCollectible
  
  
  const gasPrice = 50000000000 // TODO mainnet gas
  
  const firstNonce = 603 // TODO specify nonce
  
   // Create the bundle with withdraw
  const unlockTransaction = await dada.populateTransaction.flipSwitchTo(true, {nonce: firstNonce, gasLimit: 30000, gasPrice})
  const withdrawTransaction = await dada.populateTransaction.withdraw({gasPrice, gasLimit: 40000, nonce: (firstNonce + 1)})
  const relockTransaction = await dada.populateTransaction.flipSwitchTo(false, {nonce: (firstNonce + 2), gasLimit: 30000, gasPrice})

  
  console.log({unlockTransaction, withdrawTransaction, relockTransaction})
  const signedTransactions = await flashbotsProvider.signBundle([
    {
      signer: admin,
      transaction: unlockTransaction
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

  for (var i = 1; i <= 20; i++) {
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
