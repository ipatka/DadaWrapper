import { ethers } from 'hardhat'
import { solidity } from 'ethereum-waffle'
import { BigNumberish, Contract, ContractFactory } from 'ethers'
import { use, expect } from 'chai'
import { DadaCollectible } from '../src/types/DadaCollectible'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { fastForwardBlocks } from './util'

use(solidity)

describe('Dada Collectible', function () {
  let DadaCollectible: ContractFactory
  let dada: DadaCollectible

  let dadaAsAlice: DadaCollectible
  let dadaAsBob: DadaCollectible

  let signers: SignerWithAddress[]

  let deployer: SignerWithAddress
  let alice: SignerWithAddress
  let bob: SignerWithAddress
  let celeste: SignerWithAddress

  const zeroAddress = '0x0000000000000000000000000000000000000000'

  let deployerAddress: string
  let aliceAddress: string
  let celesteAddress: string
  let bobAddress: string

  let minQuorum: BigNumberish

  this.beforeAll(async function () {
    DadaCollectible = await ethers.getContractFactory('DadaCollectible')
    signers = await ethers.getSigners()
    deployer = signers[0]
    alice = signers[1]
    bob = signers[2]
    celeste = signers[3]

    deployerAddress = deployer.address
    aliceAddress = alice.address
    celesteAddress = celeste.address
    bobAddress = bob.address
  })

  describe('Dada', function () {
    this.beforeEach(async function () {
      // Deploy ERC20 contract
      dada = (await DadaCollectible.deploy()) as DadaCollectible

      dadaAsAlice = await dada.connect(alice)
      dadaAsBob = await dada.connect(bob)

      await fastForwardBlocks(5)
    })

    describe('newCollectible', function () {
      it('Allows owner to create newCollectible', async function () {
        await dada.newCollectible(1, 'test', 100, 1, 1000, 'testName', 1, 'rare')

        const collectible = await dada.drawingIdToCollectibles(1)

        expect(collectible.initialPrice).to.equal(1)
      })

      it('Does not allow anyone else to call newCollectible', async function () {
        expect(dadaAsAlice.newCollectible(1, 'test', 100, 1, 1000, 'testName', 1, 'rare')).to.be.reverted;
        const collectible = await dada.drawingIdToCollectibles(1)
        expect(collectible.initialPrice).to.equal(0)
      })

      it('Does not allow an owner to to overwrite a collectible', async function () {
        await dada.newCollectible(1, 'test', 100, 1, 1000, 'testName', 1, 'rare')
        let collectible = await dada.drawingIdToCollectibles(1)
        expect(collectible.initialPrice).to.equal(1)
        expect(dada.newCollectible(1, 'test', 100, 0, 1000, 'testName', 1, 'rare')).to.be.reverted;
        collectible = await dada.drawingIdToCollectibles(1)
        expect(collectible.initialPrice).to.equal(1)
      })

    })
    
    describe('flipswitchto', function() {
      it('Allows owner to flip switch', async function () {
        expect(dada.flipSwitchTo(true)).not.to.be.reverted;

      })

      it('Does not allow anyone else to flip switch', async function () {
        expect(dadaAsAlice.flipSwitchTo(true)).to.be.reverted;
      })

    })
    
    describe('alt_buyCollectible', function () {
      it('Does not allow purchases when first deployed', async function () {
        await dada.newCollectible(1, 'test', 100, 1, 1000, 'testName', 1, 'rare')

        expect(dadaAsAlice.alt_buyCollectible(1, 1000, { value: 1 })).to.be.reverted
      })

      it('Allows purchases when switched', async function () {
        await dada.newCollectible(1, 'test', 100, 1, 1000, 'testName', 1, 'rare')

        await dada.flipSwitchTo(true)

        await dadaAsAlice.alt_buyCollectible(1, 1000, { value: 1 })

        expect(await dada.DrawingPrintToAddress(1000)).to.equal(aliceAddress)
      })
    })

    describe('offers', function () {
      it('Allows owner to make available for sale', async function () {
        await dada.newCollectible(1, 'test', 100, 1, 1000, 'testName', 1, 'rare')

        await dada.flipSwitchTo(true)

        await dadaAsAlice.alt_buyCollectible(1, 1000, { value: 1 })
        
        await dadaAsAlice.offerCollectibleForSale(1, 1000, 1)
        
        await dadaAsBob.buyCollectible(1, 1000, {value: 1})

        expect(await dada.DrawingPrintToAddress(1000)).to.equal(bobAddress)
      })

      it('Allows owner to make unavailable for sale', async function () {
        await dada.newCollectible(1, 'test', 100, 1, 1000, 'testName', 1, 'rare')

        await dada.flipSwitchTo(true)

        await dadaAsAlice.alt_buyCollectible(1, 1000, { value: 1 })
        
        await dadaAsAlice.offerCollectibleForSale(1, 1000, 1)
        await dadaAsAlice.withdrawOfferForCollectible(1, 1000)
        
        expect(dadaAsBob.buyCollectible(1, 1000, {value: 1})).to.be.reverted;

        expect(await dada.DrawingPrintToAddress(1000)).to.equal(aliceAddress)
      })

      it('Allows owner to manipulate last order', async function () {
        await dada.newCollectible(1, 'test', 100, 1, 1000, 'testName', 1, 'rare')

        await dada.flipSwitchTo(true)

        await dadaAsAlice.alt_buyCollectible(1, 1000, { value: 1 })
        
        let offer  = await dada.OfferedForSale(1000)
        
        expect(offer.seller).to.equal(aliceAddress)
        expect(offer.lastSellValue).to.equal(1)
        
        await dadaAsAlice.makeCollectibleUnavailableToSale(bobAddress, 1, 1000, 2)

        offer  = await dada.OfferedForSale(1000)
        
        expect(offer.seller).to.equal(bobAddress)
        expect(offer.lastSellValue).to.equal(2)
        
      })
    })
  })
})
