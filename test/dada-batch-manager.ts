import { ethers } from 'hardhat'
import { solidity } from 'ethereum-waffle'
import { BigNumber, BigNumberish, Contract, ContractFactory} from 'ethers'
import { use, expect } from 'chai'
import { DadaCollectible } from '../src/types/DadaCollectible'
import { DadaReserve } from '../src/types/DadaReserve'
import { DadaBatchManager } from '../src/types/DadaBatchManager'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { fastForwardBlocks, getNextOwnedPrint } from './util'
import {
  drawingIds,
  initialPrices,
  initialPrintIndexes,
  prepurchaseDrawingIds,
  prepurchasePrintIds,
  round1,
  totalSupplies,
} from '../src/util/simulation'
import { BaseProvider } from '@ethersproject/providers'

use(solidity)

describe('Dada Batch Reserve', function () {
  let DadaCollectible: ContractFactory
  let dada: DadaCollectible

  let DadaReserve: ContractFactory
  let dadaReserve: DadaReserve

  let DadaBatchManager: ContractFactory
  let dadaBatch: DadaBatchManager

  let dadaAsAlice: DadaCollectible
  let dadaAsBob: DadaCollectible
  let dadaAsCeleste: DadaCollectible
  let dadaReserveAsAlice: DadaReserve
  let dadaReserveAsCeleste: DadaReserve

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
  
  const sliceSize = 25
  const minerTip = '10000000000000000'

  const operatorRole = ethers.utils.solidityKeccak256(['string'], ['OPERATOR_ROLE'])
  const ownerRole = ethers.utils.solidityKeccak256(['string'], ['OWNER_ROLE'])
  const adminRole = '0x0000000000000000000000000000000000000000000000000000000000000000'

  let initialBalance: BigNumber

  let provider: BaseProvider

  this.beforeAll(async function () {
    DadaCollectible = await ethers.getContractFactory('DadaCollectible')
    DadaReserve = await ethers.getContractFactory('DadaReserve')
    DadaBatchManager = await ethers.getContractFactory('DadaBatchManager')
    signers = await ethers.getSigners()
    deployer = signers[0]
    alice = signers[1]
    bob = signers[2]
    celeste = signers[3]

    deployerAddress = deployer.address
    aliceAddress = alice.address
    celesteAddress = celeste.address
    bobAddress = bob.address
    
    provider = ethers.provider
  })
  
  describe('Batches', function () {
    let ownedPrints: Array<any> = []
    this.beforeEach(async function () {
      ownedPrints = []
      // Deploy ERC20 contract
      dada = (await DadaCollectible.deploy()) as DadaCollectible
      dadaReserve = (await DadaReserve.deploy(drawingIds, dada.address)) as DadaReserve
      dadaBatch = (await DadaBatchManager.deploy(dadaReserve.address)) as DadaBatchManager
      await dada.flipSwitchTo(true)

      const bobBalance = await bob.getBalance()
      await bob.sendTransaction({ to: dadaReserve.address, value: BigNumber.from('1000000000000000000000') })

      dadaAsAlice = await dada.connect(alice)
      dadaAsBob = await dada.connect(bob)
      dadaAsCeleste = await dada.connect(celeste)
      dadaReserveAsAlice = await dadaReserve.connect(alice)
      dadaReserveAsCeleste = await dadaReserve.connect(celeste)
      await dadaReserve.grantRole(ownerRole, aliceAddress)
      await dadaReserve.grantRole(ownerRole, dadaBatch.address)
      await dadaReserve.grantRole(operatorRole, aliceAddress)

      for (let index = 0; index < drawingIds.length; index++) {
        await dada.newCollectible(
          drawingIds[index],
          'test',
          totalSupplies[index],
          initialPrices[index],
          initialPrintIndexes[index],
          'testName',
          1,
          'rare'
        )
      }


      const round = Array.from({ length: 108 }, (_, i) => 2)
      await dadaReserveAsAlice.createRound(1, round)
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})

      for (let index = 0; index < drawingIds.length; index++) {
        const ownedPrint = await getNextOwnedPrint(drawingIds[index], dadaReserve.address, dada)
        ownedPrints.push([drawingIds[index], ownedPrint])
      }
    })
    describe('Batch Transfer to address', function () {
      it('Sets up the tests', async function () {
        expect(await dada.balanceOf(dadaReserve.address)).to.equal(216)
      })

      it('Creates the individual transfer array', async function () {
        const testOwnedPrints = []
        for (let index = 0; index < drawingIds.length; index++) {
          const ownedPrint = await getNextOwnedPrint(drawingIds[index], dadaReserve.address, dada)
          testOwnedPrints.push([drawingIds[index], ownedPrint])
        }
        expect(testOwnedPrints.length).to.equal(drawingIds.length)
      })
      
      it('Allows operator to transfer one of each drawing', async function() {
        await dadaBatch.batchTransferToAddress(bobAddress, ownedPrints)
        expect(await dada.balanceOf(bobAddress)).to.equal(108)
      })

      it('Allows multiple rounds when available', async function() {
        await dadaBatch.batchTransferToAddress(bobAddress, ownedPrints)
        const nextOwnedPrints: any = []
        for (let index = 0; index < drawingIds.length; index++) {
          const nextOwnedPrint = await getNextOwnedPrint(drawingIds[index], dadaReserve.address, dada)
          nextOwnedPrints.push([drawingIds[index], nextOwnedPrint])
        }
        await dadaBatch.batchTransferToAddress(bobAddress, nextOwnedPrints)
        expect(await dada.balanceOf(bobAddress)).to.equal(216)
      })

      it('Does not allow anyone else to transfer', async function() {
        await dadaBatch.revokeRole(operatorRole, deployerAddress)
        expect(dadaBatch.batchTransferToAddress(bobAddress, ownedPrints)).to.be.revertedWith('!operator')
        expect(await dada.balanceOf(bobAddress)).to.equal(0)
      })

    })

    describe('Batch Transfer to multiple addresses', function () {
      it('Sets up the tests', async function () {
        expect(await dada.balanceOf(dadaReserve.address)).to.equal(216)
      })

      it('Creates the individual transfer array', async function () {
        const testOwnedPrints = []
        for (let index = 0; index < drawingIds.length; index++) {
          const ownedPrint = await getNextOwnedPrint(drawingIds[index], dadaReserve.address, dada)
          testOwnedPrints.push([drawingIds[index], ownedPrint])
        }
        expect(testOwnedPrints.length).to.equal(drawingIds.length)
      })
      
      it('Allows operator to transfer one of each drawing', async function() {
        const to = Array.from({length: 108}, (_,k) => k % 2 == 0 ? bobAddress : celesteAddress)
        await dadaBatch.batchTransferToAddresses(to, ownedPrints)
        expect(await dada.balanceOf(bobAddress)).to.equal(54)
        expect(await dada.balanceOf(celesteAddress)).to.equal(54)
      })

      it('Allows multiple rounds when available', async function() {
        const to = Array.from({length: 108}, (_,k) => k % 2 == 0 ? bobAddress : celesteAddress)
        await dadaBatch.batchTransferToAddresses(to, ownedPrints)
        const nextOwnedPrints: any = []
        for (let index = 0; index < drawingIds.length; index++) {
          const nextOwnedPrint = await getNextOwnedPrint(drawingIds[index], dadaReserve.address, dada)
          nextOwnedPrints.push([drawingIds[index], nextOwnedPrint])
        }
        await dadaBatch.batchTransferToAddresses(to, nextOwnedPrints)
        expect(await dada.balanceOf(bobAddress)).to.equal(108)
        expect(await dada.balanceOf(celesteAddress)).to.equal(108)
      })

      it('Does not allow anyone else to transfer', async function() {
        const to = Array.from({length: 108}, (_,k) => k % 2 == 0 ? bobAddress : celesteAddress)
        await dadaBatch.revokeRole(operatorRole, deployerAddress)
        expect(dadaBatch.batchTransferToAddresses(to, ownedPrints)).to.be.revertedWith('!operator')
        expect(await dada.balanceOf(bobAddress)).to.equal(0)
      })

    })
    
    describe('ETH Rescue', function () {
      it('Allows ETH sent to contract to be retrieved by operator', async function() {
        await alice.sendTransaction({to: dadaBatch.address, value: 1000})
        expect(await provider.getBalance(dadaBatch.address)).to.equal(1000)
        await dadaBatch.withdraw(deployerAddress)
        expect(await provider.getBalance(dadaBatch.address)).to.equal(0)
      })

      it('Does not allow anyone else to retrieve ETH', async function() {
        await alice.sendTransaction({to: dadaBatch.address, value: 1000})
        expect(await provider.getBalance(dadaBatch.address)).to.equal(1000)
        await dadaBatch.revokeRole(operatorRole, deployerAddress)
        expect(dadaBatch.withdraw(deployerAddress)).to.be.revertedWith('!operator')
        expect(await provider.getBalance(dadaBatch.address)).to.equal(1000)
      })

    })
    
    // batch offer to address
    describe('Batch Offer to address', function () {

      it('Allows operator to offer one of each drawing to a single buyer', async function() {
        const price = 100
        const offers = ownedPrints.map((value: [number, number], index: number) => {
          const offer: [number, number, number] = [value[0], value[1], price]
          return offer
        }
          )
        await dadaBatch.batchOfferCollectiblesForSaleToAddress(bobAddress, offers)
        await dadaAsBob.buyCollectible(offers[0][0], offers[0][1], {value: 100})
        expect(await dada.balanceOf(bobAddress)).to.equal(1)
        expect(dadaAsBob.buyCollectible(offers[1][0], offers[1][1], {value: 1})).to.be.reverted
        expect(dadaAsCeleste.buyCollectible(offers[1][0], offers[1][1], {value: 100})).to.be.reverted
        
      })

      it('Does not allow anyone else to offer', async function() {
        const price = 100
        const offers = ownedPrints.map((value: [number, number], index: number) => {
          const offer: [number, number, number] = [value[0], value[1], price]
          return offer
        }
          )
        await dadaBatch.revokeRole(operatorRole, deployerAddress)
        expect(dadaBatch.batchOfferCollectiblesForSaleToAddress(bobAddress, offers)).to.be.revertedWith('!operator')
      })

    })

    describe('Batch Offer to addresses', function () {

      it('Allows operator to offer one of each drawing to multiple buyers', async function() {
        const to = Array.from({length: 108}, (_,k) => k % 2 == 0 ? bobAddress : celesteAddress)
        const price = 100
        const offers = ownedPrints.map((value: [number, number], index: number) => {
          const offer: [number, number, number] = [value[0], value[1], price]
          return offer
        }
          )
        await dadaBatch.batchOfferCollectiblesForSaleToAddresses(to, offers)
        await dadaAsBob.buyCollectible(offers[0][0], offers[0][1], {value: 100})
        await dadaAsCeleste.buyCollectible(offers[1][0], offers[1][1], {value: 100})
        expect(await dada.balanceOf(bobAddress)).to.equal(1)
        expect(await dada.balanceOf(celesteAddress)).to.equal(1)
        
      })

      it('Does not allow anyone else to offer', async function() {
        const to = Array.from({length: 108}, (_,k) => k % 2 == 0 ? bobAddress : celesteAddress)
        const price = 100
        const offers = ownedPrints.map((value: [number, number], index: number) => {
          const offer: [number, number, number] = [value[0], value[1], price]
          return offer
        }
          )
        await dadaBatch.revokeRole(operatorRole, deployerAddress)
        expect(dadaBatch.batchOfferCollectiblesForSaleToAddresses(to, offers)).to.be.revertedWith('!operator')
      })

    })
    // batch accept bid
    describe('Batch accept bids', function () {

      it('Allows operator to accept multiple bids', async function() {
        const price = 100
        const offers = ownedPrints.map((value: [number, number], index: number) => {
          const offer: [number, number, number] = [value[0], value[1], price]
          return offer
        }
          )
        for (let index = 0; index < offers.length; index++) {
          await dadaAsBob.enterBidForCollectible(offers[index][0], offers[index][1], {value: 100})
        }
        await dadaBatch.batchAcceptBidForCollectibles(offers)
        expect(await dada.balanceOf(bobAddress)).to.equal(108)
        
      })

      it('Does not allow anyone else to accept', async function() {
        const price = 100
        const offers = ownedPrints.map((value: [number, number], index: number) => {
          const offer: [number, number, number] = [value[0], value[1], price]
          return offer
        }
          )
        for (let index = 0; index < offers.length; index++) {
          await dadaAsBob.enterBidForCollectible(offers[index][0], offers[index][1], {value: 100})
        }
        await dadaBatch.revokeRole(operatorRole, deployerAddress)
        expect(dadaBatch.batchAcceptBidForCollectibles(offers)).to.be.revertedWith('!operator')
      })

    })
    
    // batch offer to anyone
    describe('Batch Offer to anyone', function () {

      it('Allows operator to offer one of each drawing to anyone', async function() {
        const price = 100
        const offers = ownedPrints.map((value: [number, number], index: number) => {
          const offer: [number, number, number] = [value[0], value[1], price]
          return offer
        }
          )
        await dadaBatch.batchOfferCollectiblesForSale(offers)
        await dadaAsBob.buyCollectible(offers[0][0], offers[0][1], {value: 100})
        await dadaAsCeleste.buyCollectible(offers[1][0], offers[1][1], {value: 100})
        expect(await dada.balanceOf(bobAddress)).to.equal(1)
        expect(await dada.balanceOf(celesteAddress)).to.equal(1)
        
      })

      it('Does not allow anyone else to offer', async function() {
        const price = 100
        const offers = ownedPrints.map((value: [number, number], index: number) => {
          const offer: [number, number, number] = [value[0], value[1], price]
          return offer
        }
          )
        await dadaBatch.revokeRole(operatorRole, deployerAddress)
        expect(dadaBatch.batchOfferCollectiblesForSale(offers)).to.be.revertedWith('!operator')
      })

    })
    
    describe('Batch cancel offer', function () {

      it('Allows operator to cancel multiple offers', async function() {
        const price = 100
        const offers = ownedPrints.map((value: [number, number], index: number) => {
          const offer: [number, number, number] = [value[0], value[1], price]
          return offer
        }
          )
        await dadaBatch.batchOfferCollectiblesForSale(offers)
        
        await dadaBatch.batchWithdrawOffersForCollectibles(ownedPrints.slice(0,2))
        expect(dadaAsBob.buyCollectible(offers[0][0], offers[0][1], {value: 100})).to.be.reverted
        await dadaAsBob.buyCollectible(offers[3][0], offers[3][1], {value: 100})
        expect(await dada.balanceOf(bobAddress)).to.equal(1)
        
      })

      it('Does not allow anyone else to withdraw offer', async function() {
        const price = 100
        const offers = ownedPrints.map((value: [number, number], index: number) => {
          const offer: [number, number, number] = [value[0], value[1], price]
          return offer
        }
          )
        await dadaBatch.batchOfferCollectiblesForSale(offers)
        await dadaBatch.revokeRole(operatorRole, deployerAddress)
        expect(
          dadaBatch.batchWithdrawOffersForCollectibles(ownedPrints.slice(0,2))
          ).to.be.revertedWith('!operator')
      })

    })
    
  })

})
