import { ethers } from 'hardhat'
import { solidity } from 'ethereum-waffle'
import { BigNumber, BigNumberish, Contract, ContractFactory } from 'ethers'
import { use, expect } from 'chai'
import { DadaCollectible } from '../src/types/DadaCollectible'
import { DadaReserve } from '../src/types/DadaReserve'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { fastForwardBlocks } from './util'
import {
  amountsPerRound,
  drawingIds,
  initialPrices,
  initialDemoPrices,
  initialPrintIndexes,
  prePurchased,
  prepurchaseDrawingIds,
  prepurchasePrintIds,
  round1,
  round10,
  round11,
  round12,
  round13,
  round14,
  round15,
  round16,
  round2,
  round3,
  round4,
  round5,
  round6,
  round7,
  round8,
  round9,
  totalSupplies,
} from '../src/util/simulation'
import { BaseProvider } from '@ethersproject/providers'

use(solidity)

describe('Dada Reserve', function () {
  let DadaCollectible: ContractFactory
  let dada: DadaCollectible

  let DadaReserve: ContractFactory
  let dadaReserve: DadaReserve

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

  const rounds = [
    round1,
    // round2,
    round3,
    // round4,
    // round5,
    // round6,
    // round7,
    // round8,
    // round9,
    // round10,
    // round11,
    // round12,
    // round13,
    // round14,
    // round15,
    // round16,
  ]

  const operatorRole = ethers.utils.solidityKeccak256(['string'], ['OPERATOR_ROLE'])
  const ownerRole = ethers.utils.solidityKeccak256(['string'], ['OWNER_ROLE'])
  const adminRole = '0x0000000000000000000000000000000000000000000000000000000000000000'

  let initialBalance: BigNumber

  let provider: BaseProvider

  this.beforeAll(async function () {
    DadaCollectible = await ethers.getContractFactory('DadaCollectible')
    DadaReserve = await ethers.getContractFactory('DadaReserve')
    signers = await ethers.getSigners()
    deployer = signers[0]
    alice = signers[1]
    bob = signers[2]
    celeste = signers[3]

    deployerAddress = deployer.address
    aliceAddress = alice.address
    celesteAddress = celeste.address
    bobAddress = bob.address
    
    console.log({deployerAddress, aliceAddress, celesteAddress, bobAddress})

    provider = ethers.provider
  })

  let priceLookup: { [key: number]: string } = {}

  for (let index = 0; index < drawingIds.length; index++) {
    const drawingId = drawingIds[index]
    priceLookup[drawingId] = initialPrices[index]
  }

  describe('Simulation', function () {
    this.beforeAll(async function () {
      // Deploy ERC20 contract
      dada = (await DadaCollectible.deploy()) as DadaCollectible
      dadaReserve = (await DadaReserve.deploy(drawingIds, dada.address)) as DadaReserve
      await dada.flipSwitchTo(true)

      const bobBalance = await bob.getBalance()
      await bob.sendTransaction({ to: dadaReserve.address, value: BigNumber.from('1000000000000000000000') })

      dadaAsAlice = await dada.connect(alice)
      dadaReserveAsAlice = await dadaReserve.connect(alice)
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

      await fastForwardBlocks(5)
      initialBalance = await provider.getBalance(dadaReserve.address)
    })

    describe('Operation', function () {
      let runningBalance = 0
      it('Pre purchases the items', async function () {
        for (let index = 0; index < prepurchasePrintIds.length; index++) {
          const printIndex = prepurchasePrintIds[index]
          const drawingId = prepurchaseDrawingIds[index]
          await dadaAsAlice.alt_buyCollectible(drawingId, printIndex, { value: BigNumber.from(priceLookup[drawingId]) })
        }
        expect(await dada.balanceOf(aliceAddress)).to.equal(813)
      })
      it('Creates the rounds', async function () {
        for (let index = 0; index < rounds.length; index++) {
          const round = rounds[index];
          await dadaReserveAsAlice.createRound(index + 1, round) 
        }
      })
      
      for (let index = 1; index <= rounds.length; index++) {
        it(`Allows owner to execute round ${index.toString()} until depleted`, async function () {
          const roundNumber = index
          const amountInRound = rounds[index - 1].reduce(function (accumulator, currentValue) {
            return accumulator + currentValue
          }, 0)
          const numRounds = Math.ceil(amountInRound / sliceSize )
          console.log({ rounds: numRounds })
          for (let index = 0; index < numRounds; index++) {
            console.log(`executing round ${roundNumber.toString()} iteration ${index.toString()}`)
            try {
              await dadaReserveAsAlice.executeRound(roundNumber, minerTip)
            } catch (e: any) {
              console.log({ e })
              break
            }
          }
          runningBalance += amountInRound
          const reserveBalance = await dada.balanceOf(dadaReserve.address)
          console.log(`Reserve Balance: ${reserveBalance.toString()}, Expected: ${runningBalance.toString()}`)
          expect(reserveBalance).to.equal(runningBalance)
        })
        
      }


    })

    this.afterEach(async function () {
      const afterBalance = await provider.getBalance(dadaReserve.address)
      console.log({ afterBalance: afterBalance.toString() })
    })
    this.afterAll(async function () {
      const afterBalance = await provider.getBalance(dadaReserve.address)
      const spent = initialBalance.sub(afterBalance)
      console.log({ spent: spent.toString() })
    })
  })
  
  describe('Public Access', function() {
    this.beforeEach(async function () {
      // Deploy ERC20 contract
      dada = (await DadaCollectible.deploy()) as DadaCollectible
      dadaReserve = (await DadaReserve.deploy(drawingIds, dada.address)) as DadaReserve
      await dada.flipSwitchTo(true)

      await bob.sendTransaction({ to: dadaReserve.address, value: BigNumber.from('1000000000000000000000') })

      dadaAsAlice = await dada.connect(alice)
      dadaAsBob = await dada.connect(bob)
      dadaAsCeleste = await dada.connect(celeste)
      dadaReserveAsAlice = await dadaReserve.connect(alice)
      dadaReserveAsCeleste = await dadaReserve.connect(celeste)
      await dadaReserve.grantRole(operatorRole, aliceAddress)
      await dadaReserve.grantRole(ownerRole, aliceAddress)

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

      await fastForwardBlocks(5)
      initialBalance = await provider.getBalance(dadaReserve.address)
    })

      it('Does not allow public purchases while locked', async function () {
        expect(dadaReserveAsCeleste.purchaseNextExternal(drawingIds[0], {value: initialPrices[0]})).to.be.revertedWith('locked')
      })

      it('Allows public purchases once unlocked', async function () {
        expect(await dada.balanceOf(celesteAddress)).to.equal(0)
        await dadaReserveAsAlice.unlock();
        await dadaReserveAsCeleste.purchaseNextExternal(drawingIds[0], {value: initialPrices[0]})
        expect(await dada.balanceOf(celesteAddress)).to.equal(1)
      })

      it('Allows public purchases to be relocked', async function () {
        expect(await dada.balanceOf(celesteAddress)).to.equal(0)
        await dadaReserveAsAlice.unlock();
        await dadaReserveAsCeleste.purchaseNextExternal(drawingIds[0], {value: initialPrices[0]})
        expect(await dada.balanceOf(celesteAddress)).to.equal(1)
        await dadaReserveAsAlice.lock();
        expect(dadaReserveAsCeleste.purchaseNextExternal(drawingIds[0], {value: initialPrices[0]})).to.be.revertedWith('locked')
        expect(await dada.balanceOf(celesteAddress)).to.equal(1)
      })

  })

  describe('Post operation', function () {
    this.beforeAll(async function () {
      // Deploy ERC20 contract
      dada = (await DadaCollectible.deploy()) as DadaCollectible
      dadaReserve = (await DadaReserve.deploy(drawingIds, dada.address)) as DadaReserve
      await dada.flipSwitchTo(true)

      const bobBalance = await bob.getBalance()
      await bob.sendTransaction({ to: dadaReserve.address, value: BigNumber.from('1000000000000000000000') })

      dadaAsAlice = await dada.connect(alice)
      dadaAsBob = await dada.connect(bob)
      dadaAsCeleste = await dada.connect(celeste)
      dadaReserveAsAlice = await dadaReserve.connect(alice)
      dadaReserveAsCeleste = await dadaReserve.connect(celeste)
      await dadaReserve.grantRole(ownerRole, aliceAddress)
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

      await fastForwardBlocks(5)
      initialBalance = await provider.getBalance(dadaReserve.address)
    })

    describe('Reserve Proxy', function () {
      it('Completes a purchasing round', async function () {
        const drawingIds = Array.from({ length: 108 }, (_, i) => (i === 0 ? 25 : 0))
        await dadaReserveAsAlice.createRound(1, drawingIds)
        await dadaReserveAsAlice.executeRound(1, minerTip)
      })

      it('Enables the admin to transfer an owned collectible', async function () {
        expect(await dada.DrawingPrintToAddress(3170)).to.equal(dadaReserve.address)
        await dadaReserveAsAlice.transfer(bobAddress, 86667, 3170)
        await dadaReserveAsAlice.transfer(bobAddress, 86667, 3171)
        expect(await dada.DrawingPrintToAddress(3170)).to.equal(bobAddress)
        expect(await dada.DrawingPrintToAddress(3171)).to.equal(bobAddress)
      })

      it('Does not allow anyone else to transfer an owned collectible', async function () {
        expect(await dada.DrawingPrintToAddress(3171)).to.equal(dadaReserve.address)
        expect(dadaReserveAsCeleste.transfer(bobAddress, 86667, 3171)).to.be.revertedWith('!owner')
        expect(await dada.DrawingPrintToAddress(3171)).to.equal(dadaReserve.address)
      })

      it('Enables the admin to offer collectible to sale to a specific individual', async function () {
        expect(await dada.DrawingPrintToAddress(3171)).to.equal(dadaReserve.address)
        await dadaReserveAsAlice.offerCollectibleForSaleToAddress(86667, 3171, BigNumber.from('500000000000000000'), celesteAddress)
        await dadaAsCeleste.buyCollectible(86667, 3171, { value: BigNumber.from('500000000000000000') })
        expect(await dada.DrawingPrintToAddress(3171)).to.equal(celesteAddress)
      })

      it('Does not allow anyone else to buy it', async function () {
        expect(await dada.DrawingPrintToAddress(3172)).to.equal(dadaReserve.address)
        await dadaReserveAsAlice.offerCollectibleForSaleToAddress(86667, 3172, BigNumber.from('500000000000000000'), celesteAddress)
        expect(dadaAsBob.buyCollectible(86667, 3172, { value: BigNumber.from('500000000000000000') })).to.be.reverted
        expect(await dada.DrawingPrintToAddress(3172)).to.equal(dadaReserve.address)
      })

      it('Allows admin to withdraw sale proceeds back into reserve', async function () {
        const beforeBalance = await provider.getBalance(dadaReserve.address)
        await dadaReserveAsAlice.withdrawFromDada()
        const afterBalance = await provider.getBalance(dadaReserve.address)
        expect(afterBalance.gt(beforeBalance)).to.be.true
      })

      it('Allows admin to withdraw eth from reserve', async function () {
        const beforeBalance = await alice.getBalance()
        await dadaReserveAsAlice.withdraw(aliceAddress)
        const afterBalance = await alice.getBalance()
        expect(afterBalance.gt(beforeBalance)).to.be.true
      })

      it('Allows admin to withdraw eth from reserve to somewhere else', async function () {
        await alice.sendTransaction({ to: dadaReserve.address, value: BigNumber.from('2000000000000000000') })
        const beforeBalance = await bob.getBalance()
        await dadaReserveAsAlice.withdraw(bobAddress)
        const afterBalance = await bob.getBalance()
        expect(afterBalance.gt(beforeBalance)).to.be.true
      })

      it('Enables the admin to offer collectible to sale to anyone', async function () {
        expect(await dada.DrawingPrintToAddress(3173)).to.equal(dadaReserve.address)
        await dadaReserveAsAlice.offerCollectibleForSale(86667, 3173, BigNumber.from('500000000000000000'))
        await dadaAsBob.buyCollectible(86667, 3173, { value: BigNumber.from('500000000000000000') })
        expect(await dada.DrawingPrintToAddress(3173)).to.equal(bobAddress)
      })

      it('Enables the admin to withdraw a sale offer', async function () {
        expect(await dada.DrawingPrintToAddress(3174)).to.equal(dadaReserve.address)
        await dadaReserveAsAlice.offerCollectibleForSale(86667, 3174, BigNumber.from('500000000000000000'))
        await dadaReserveAsAlice.withdrawOfferForCollectible(86667, 3174)
        expect(dadaAsBob.buyCollectible(86667, 3174, { value: BigNumber.from('500000000000000000') })).to.be.reverted
        expect(await dada.DrawingPrintToAddress(3174)).to.equal(dadaReserve.address)
      })
    })
  })

  describe('Edge cases', function() {
    this.beforeEach(async function () {
      // Deploy ERC20 contract
      dada = (await DadaCollectible.deploy()) as DadaCollectible
      dadaReserve = (await DadaReserve.deploy([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], dada.address)) as DadaReserve
      await dada.flipSwitchTo(true)

      await bob.sendTransaction({ to: dadaReserve.address, value: BigNumber.from('1000000000000000000000') })

      dadaAsAlice = await dada.connect(alice)
      dadaAsBob = await dada.connect(bob)
      dadaAsCeleste = await dada.connect(celeste)
      dadaReserveAsAlice = await dadaReserve.connect(alice)
      dadaReserveAsCeleste = await dadaReserve.connect(celeste)
      await dadaReserve.grantRole(operatorRole, aliceAddress)
      await dadaReserve.grantRole(ownerRole, aliceAddress)

      for (let index = 0; index < 10; index++) {
        await dada.newCollectible(
          index + 1,
          'test',
          5,
          '10',
          index * 5,
          'testName',
          1,
          'rare'
        )
      }
      const localRounds = [
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1
      ],
      [
        0, 0, 0, 2, 2, 3, 0, 0, 0, 5
      ],
      [
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6
      ],
    ]
        await dadaReserveAsAlice.createRound(1, localRounds[0])
        await dadaReserveAsAlice.createRound(2, localRounds[1])
        await dadaReserveAsAlice.createRound(3, localRounds[2])
    })
      

      it('Allows rounds to be executed with quantities greater than total supply', async function () {
        await dadaReserveAsAlice.executeRound(3, 0)
        expect (await dada.balanceOf(dadaReserve.address)).to.equal(50)
      })

      it('Allows rounds and public purchases to happen at the same time', async function () {
        await dadaReserveAsAlice.unlock()
        await dadaReserveAsAlice.executeRound(1, 0)
        await dadaReserveAsCeleste.purchaseNextExternal(1, {value: '10'})
        await dadaReserveAsCeleste.purchaseNextExternal(4, {value: '10'})
        await dadaReserveAsCeleste.purchaseNextExternal(8, {value: '10'})
        await dadaReserveAsAlice.executeRound(3, 0)
        expect (await dada.balanceOf(dadaReserve.address)).to.equal(47)
        expect (await dada.balanceOf(celesteAddress)).to.equal(3)
      })
      
      it('Allows public purchases until depleted', async function() {
        await dadaReserveAsAlice.unlock()
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 5; j++) {
            await dadaReserveAsCeleste.purchaseNextExternal(i+ 1, {value: '10'})
          }
          expect(dadaReserveAsCeleste.purchaseNextExternal(i + 1, {value: '10'})).to.be.revertedWith('depleted')
        }
        expect (await dada.balanceOf(celesteAddress)).to.equal(50)
      })

      it('Allows rounds to be executed if stuff is already gone', async function() {
        await dadaReserveAsAlice.unlock()
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 5; j++) {
            await dadaReserveAsCeleste.purchaseNextExternal(i+ 1, {value: '10'})
          }
          expect(dadaReserveAsCeleste.purchaseNextExternal(i + 1, {value: '10'})).to.be.revertedWith('depleted')
        }
        expect (await dada.balanceOf(celesteAddress)).to.equal(50)
        await dadaReserveAsAlice.executeRound(3, 0)
        expect(dadaReserveAsAlice.executeRound(3, 0)).to.be.revertedWith('!round')
      })


  })
  
  // Access control
  
  //
})
