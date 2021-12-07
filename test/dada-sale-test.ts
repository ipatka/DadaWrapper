import { ethers } from 'hardhat'
import { solidity } from 'ethereum-waffle'
import { BigNumber, BigNumberish, Contract, ContractFactory} from 'ethers'
import { use, expect } from 'chai'
import { DadaCollectible } from '../src/types/DadaCollectible'
import { DadaReserve } from '../src/types/DadaReserve'
import { DadaSale } from '../src/types/DadaSale'
import { AnyNft } from '../src/types/AnyNft'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import {
  drawingIds,
  initialPrices,
  initialPrintIndexes,
  totalSupplies,
} from '../src/util/simulation'
import {
  swapDrawingIds,
  printIds,
  tokenIds
} from '../src/util/swapList'
import { BaseProvider } from '@ethersproject/providers'

use(solidity)

describe.only('Dada Batch Reserve', function () {
  let DadaCollectible: ContractFactory
  let dada: DadaCollectible

  let DadaReserve: ContractFactory
  let dadaReserve: DadaReserve

  let AnyNft: ContractFactory
  let anyNft: AnyNft
  let anyNftAsBob: AnyNft

  let DadaSale: ContractFactory
  let dadaSale: DadaSale

  let dadaAsAlice: DadaCollectible
  let dadaAsBob: DadaCollectible
  let dadaAsCeleste: DadaCollectible
  let dadaReserveAsAlice: DadaReserve
  let dadaReserveAsCeleste: DadaReserve

  let dadaSaleAsBob: DadaSale
  let dadaSaleAsCeleste: DadaSale

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
  
  const minerTip = '10000000000000000'

  const operatorRole = ethers.utils.solidityKeccak256(['string'], ['OPERATOR_ROLE'])
  const ownerRole = ethers.utils.solidityKeccak256(['string'], ['OWNER_ROLE'])
  const adminRole = '0x0000000000000000000000000000000000000000000000000000000000000000'

  let initialBalance: BigNumber

  let provider: BaseProvider

  this.beforeAll(async function () {
    DadaCollectible = await ethers.getContractFactory('DadaCollectible')
    AnyNft = await ethers.getContractFactory('AnyNFT')
    DadaReserve = await ethers.getContractFactory('DadaReserve')
    DadaSale = await ethers.getContractFactory('DadaSale')
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
  
  describe.only('Operator Role', function () {
    let ownedPrints: Array<any> = []
    this.beforeAll(async function () {
      ownedPrints = []
      // Deploy ERC20 contract
      dada = (await DadaCollectible.deploy()) as DadaCollectible
      anyNft = (await AnyNft.deploy()) as AnyNft
      dadaReserve = (await DadaReserve.deploy(drawingIds, dada.address)) as DadaReserve
      dadaSale = (await DadaSale.deploy(dadaReserve.address, dada.address, anyNft.address, celesteAddress)) as DadaSale
      await dada.flipSwitchTo(true)

      const bobBalance = await bob.getBalance()
      await bob.sendTransaction({ to: dadaReserve.address, value: BigNumber.from('1000000000000000000000') })

      dadaAsAlice = await dada.connect(alice)
      dadaAsBob = await dada.connect(bob)
      dadaAsCeleste = await dada.connect(celeste)
      dadaReserveAsAlice = await dadaReserve.connect(alice)
      dadaReserveAsCeleste = await dadaReserve.connect(celeste)
      dadaSaleAsBob = await dadaSale.connect(bob)
      dadaSaleAsCeleste = await dadaSale.connect(celeste)
      await dadaReserve.grantRole(ownerRole, aliceAddress)
      await dadaReserve.grantRole(ownerRole, dadaSale.address)
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
      
      for (let index = 0; index < 5; index++) {
        await anyNft.mintItem(aliceAddress, 'test')
        await anyNft.mintItem(bobAddress, 'test')
      }


      const round = Array.from({ length: 108 }, (_, i) => 2)
      await dadaReserveAsAlice.createRound(1, round)
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})

    })
      it('Sets up the tests', async function () {
        expect(await dada.balanceOf(dadaReserve.address)).to.equal(216)
      })

      it('Allows operator to set contract state', async function () {
        await dadaSale.setContractState([true, true, false])
        expect(await dadaSale.state(0)).to.equal(true)
        expect(await dadaSale.state(1)).to.equal(true)
        expect(await dadaSale.state(2)).to.equal(false)
        await dadaSale.setContractState([false, false, true])
        expect(await dadaSale.state(0)).to.equal(false)
        expect(await dadaSale.state(1)).to.equal(false)
        expect(await dadaSale.state(2)).to.equal(true)
        await dadaSale.setContractState([false, false, false])
        expect(await dadaSale.state(0)).to.equal(false)
        expect(await dadaSale.state(1)).to.equal(false)
        expect(await dadaSale.state(2)).to.equal(false)
      })

      it('Does not allow anyone else to set state', async function () {
        expect(dadaSaleAsBob.setContractState([true, true, false])).to.be.revertedWith('!operator')
      })

      it('Allows operator to set full swap list', async function() {
        const swapList: [number, number, number][] = tokenIds.map((value: number, index: number) => [value, swapDrawingIds[index], printIds[index]])
        const swapList1 = swapList.slice(0,100)
        console.log({swapList1})
        const swapList2 = swapList.slice(410,840)
        const swapList23 = swapList.slice(840)
        const gas = await dadaSale.estimateGas.setSwapList(swapList1, true)
        console.log({gas: gas.toNumber()})
        await dadaSale.setSwapList(swapList1, true)
        const unsetGas = await dadaSale.estimateGas.setSwapList(swapList1, false)
        console.log({unsetGas: unsetGas.toNumber()})
        await dadaSale.setSwapList(swapList1, false)

      })

      
      it('Allows operator to set the swap list for NFTs to ERC20s', async function() {
        const swapList: [number, number, number][] = []
        for (let index = 0; index < 2; index++) {
          swapList.push([index + 1, drawingIds[index], initialPrintIndexes[index]])
        }
        await dadaSale.setSwapList(swapList, true)
        expect((await dadaSale.swapList(1)).DrawingId).to.equal(drawingIds[0])
        expect((await dadaSale.swapList(1)).PrintIndex).to.equal(initialPrintIndexes[0])
        expect((await dadaSale.swapList(2)).DrawingId).to.equal(drawingIds[1])
        expect((await dadaSale.swapList(2)).PrintIndex).to.equal(initialPrintIndexes[1])
        expect(await dadaSale.swapReserved(initialPrintIndexes[0])).to.equal(true)
        expect(await dadaSale.swapReserved(initialPrintIndexes[1])).to.equal(true)
      })

      it('Does not allow anyone else to set swap list', async function() {
        const swapList: [number, number, number][] = []
        for (let index = 0; index < 2; index++) {
          swapList.push([index + 1, drawingIds[index], initialPrintIndexes[index]])
        }
        expect(dadaSaleAsBob.setSwapList(swapList, true)).to.be.revertedWith('!operator')
      })

      it('Allows operator to remove items from the swap list for NFTs to ERC20s', async function() {
        const swapList: [number, number, number][] = []
        for (let index = 0; index < 2; index++) {
          swapList.push([index + 1, drawingIds[index], initialPrintIndexes[index]])
        }
        await dadaSale.setSwapList(swapList, false)
        expect((await dadaSale.swapList(1)).DrawingId).to.equal(0)
        expect((await dadaSale.swapList(1)).PrintIndex).to.equal(0)
        expect((await dadaSale.swapList(2)).DrawingId).to.equal(0)
        expect((await dadaSale.swapList(2)).PrintIndex).to.equal(0)
        expect(await dadaSale.swapReserved(initialPrintIndexes[0])).to.equal(false)
        expect(await dadaSale.swapReserved(initialPrintIndexes[1])).to.equal(false)
      })

      it('Allows operator to set the nft receiver', async function() {
        expect(await dadaSale.dadaNftReceiver()).to.equal(celesteAddress)
        await dadaSale.setNftReceiver(bobAddress)
        expect(await dadaSale.dadaNftReceiver()).to.equal(bobAddress)
        await dadaSale.setNftReceiver(celesteAddress)
      })

      it('Does not allow anyone else to set nft receiver', async function() {
        expect(dadaSaleAsBob.setNftReceiver(bobAddress)).to.be.revertedWith('!operator')
      })

      it('Does not allow operator to set reciever to 0', async function() {
        expect(dadaSale.setNftReceiver(zeroAddress)).to.be.revertedWith('!0-address')
      })

      it('Allows the operator to set the drawing caps for drawingIds', async function() {
        const drawingCaps: [number, number][] = drawingIds.map((value: number, index:number) => [value, 5]) 
        await dadaSale.setDrawingCap(1, drawingCaps)
        expect((await dadaSale.capsPerDrawing(1, drawingIds[0]))).to.equal(5)
        expect((await dadaSale.capsPerDrawing(1, drawingIds[1]))).to.equal(5)
      })
      
      it('Allows the operator to set the discount price list for drawing Ids', async function() {
        const priceList: [number, number][] = drawingIds.map((value: number, index:number) => [value, 10 + index]) 
        await dadaSale.setPriceList(1, priceList)
        expect((await dadaSale.priceLists(1, drawingIds[0]))).to.equal(10)
        expect((await dadaSale.priceLists(1, drawingIds[1]))).to.equal(11)
      })


      it('Does not allow anyone else to set the discount price list', async function() {
        const priceList: [number, number][] = drawingIds.map((value: number, index:number) => [value, 10 + index]) 
        expect(dadaSaleAsBob.setPriceList(1, priceList)).to.be.revertedWith('!operator')
      })
      
      it('Does not allow the operator to set price list for the swap round', async function() {
        const priceList: [number, number][] = drawingIds.map((value: number, index:number) => [value, 10 + index]) 
        expect(dadaSale.setPriceList(0, priceList)).to.be.revertedWith('invalid-round')

      })

      it('Allows the operator to set the price list for drawing Ids', async function() {
        const priceList: [number, number][] = drawingIds.map((value: number, index:number) => [value, 20 + index]) 
        await dadaSale.setPriceList(2, priceList)
        expect((await dadaSale.priceLists(2, drawingIds[0]))).to.equal(20)
        expect((await dadaSale.priceLists(2, drawingIds[1]))).to.equal(21)
      })

      it('Does not allow anyone else to set the price list', async function() {
        const priceList: [number, number][] = drawingIds.map((value: number, index:number) => [value, 20 + index]) 
        expect(dadaSaleAsBob.setPriceList(2, priceList)).to.be.revertedWith('!operator')
      })
      
      it('Allows the operator to set the allowList', async function() {
        await dadaSale.setAllowList(1, [aliceAddress, bobAddress], true)
        expect(await dadaSale.allowList(1, aliceAddress)).to.equal(true)
        expect(await dadaSale.allowList(1, bobAddress)).to.equal(true)
        await dadaSale.setAllowList(1, [aliceAddress, bobAddress], false)
        expect(await dadaSale.allowList(1, aliceAddress)).to.equal(false)
        expect(await dadaSale.allowList(1, bobAddress)).to.equal(false)
      })

      it('Does not allow anyone else to set the allowList', async function() {
        expect(dadaSaleAsBob.setAllowList(1, [aliceAddress, bobAddress], true)).to.be.revertedWith('!operator')
      })
      
    
  })
  describe('Purchaser', function () {
    let ownedPrints: Array<any> = []
    this.beforeAll(async function () {
      ownedPrints = []
      // Deploy ERC20 contract
      dada = (await DadaCollectible.deploy()) as DadaCollectible
      anyNft = (await AnyNft.deploy()) as AnyNft
      dadaReserve = (await DadaReserve.deploy(drawingIds, dada.address)) as DadaReserve
      dadaSale = (await DadaSale.deploy(dadaReserve.address, dada.address, anyNft.address, celesteAddress)) as DadaSale
      await dada.flipSwitchTo(true)

      const bobBalance = await bob.getBalance()
      await bob.sendTransaction({ to: dadaReserve.address, value: BigNumber.from('1000000000000000000000') })

      dadaAsAlice = await dada.connect(alice)
      dadaAsBob = await dada.connect(bob)
      anyNftAsBob = await anyNft.connect(bob)
      dadaAsCeleste = await dada.connect(celeste)
      dadaReserveAsAlice = await dadaReserve.connect(alice)
      dadaReserveAsCeleste = await dadaReserve.connect(celeste)
      dadaSaleAsBob = await dadaSale.connect(bob)
      dadaSaleAsCeleste = await dadaSale.connect(celeste)
      await dadaReserve.grantRole(ownerRole, aliceAddress)
      await dadaReserve.grantRole(ownerRole, dadaSale.address)
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
      
      for (let index = 0; index < 5; index++) {
        await anyNft.mintItem(bobAddress, 'test')
      }

      for (let index = 0; index < 5; index++) {
        await anyNft.mintItem(aliceAddress, 'test')
      }


      const round = Array.from({ length: 108 }, (_, i) => 2)
      await dadaReserveAsAlice.createRound(1, round)
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})
      await dadaReserveAsAlice.executeRound(1, minerTip, {gasLimit: 10000000})

      const swapList: [number, number, number][] = []
      for (let index = 0; index < 2; index++) {
        swapList.push([index + 1, drawingIds[index], initialPrintIndexes[index]])
      }
      await dadaSale.setSwapList(swapList, true)


    })
      it('Sets up the tests', async function () {
        expect(await dada.balanceOf(dadaReserve.address)).to.equal(216)
      })
      
      it('Prepares for swaps', async function () {
        await anyNftAsBob.setApprovalForAll(dadaSale.address, true)

      })

      it('Does not allow swaps if state not enabled', async function () {
        expect(await dadaSale.swapReserved(initialPrintIndexes[0])).to.equal(true)
        expect(await dada.DrawingPrintToAddress(initialPrintIndexes[0])).to.equal(dadaReserve.address)
        expect(dadaSaleAsBob.swapToken(1)).to.be.revertedWith('!swap-state')
      })

      it('Sets the state to swap only', async function () {
        await dadaSale.setContractState([true, false, false])
        expect(await dadaSale.state(0)).to.equal(true)
        expect(await dadaSale.state(1)).to.equal(false)
        expect(await dadaSale.state(2)).to.equal(false)
      })

      it('Allows an eligible buyer to swap NFT for ERC20', async function () {
        expect(await anyNft.ownerOf(1)).to.equal(bobAddress)
        expect(await dadaSale.swapReserved(initialPrintIndexes[0])).to.equal(true)
        expect(await dada.DrawingPrintToAddress(initialPrintIndexes[0])).to.equal(dadaReserve.address)
        await dadaSaleAsBob.swapToken(1)
        expect(await dada.DrawingPrintToAddress(initialPrintIndexes[0])).to.equal(bobAddress)
        expect(await anyNft.ownerOf(1)).to.equal(celesteAddress)
        expect(await dadaSale.swapReserved(initialPrintIndexes[0])).to.equal(false)
      })

      it('Sets the discount price list', async function () {
        const discountPriceList: [number, number][] = drawingIds.map((value: number, index:number) => [value, 10 + index]) 
        await dadaSale.setPriceList(1, discountPriceList)
      })
      
      it('Fails if contract state is not in discount mode', async function() {
        expect(await anyNft.ownerOf(2)).to.equal(bobAddress)
        expect(await dada.DrawingPrintToAddress(initialPrintIndexes[2])).to.equal(dadaReserve.address)
        expect(dadaSaleAsBob.purchase(1, drawingIds[2], initialPrintIndexes[2], {value: 12})).to.be.revertedWith('!round-state')

      })

      it('Sets the state to discount and swap only', async function () {
        await dadaSale.setContractState([true, true, false])
        expect(await dadaSale.state(0)).to.equal(true)
        expect(await dadaSale.state(1)).to.equal(true)
        expect(await dadaSale.state(2)).to.equal(false)
      })

      it('Sets the discount allowList', async function () {
        await dadaSale.setAllowList(1, [aliceAddress, bobAddress], true)
      })

      it('Fails if attempst to purchase swap reserved token', async function () {
        expect(await anyNft.ownerOf(2)).to.equal(bobAddress)
        expect(await dadaSale.swapReserved(initialPrintIndexes[1])).to.equal(true)
        expect(await dada.DrawingPrintToAddress(initialPrintIndexes[1])).to.equal(dadaReserve.address)
        expect(dadaSaleAsBob.purchase(1, drawingIds[1], initialPrintIndexes[1],  {value: 11})).to.be.revertedWith('reserved')
      })

      it('Fails purchase if not exact eth amount', async function () {
        expect(await anyNft.ownerOf(2)).to.equal(bobAddress)
        expect(await dadaSale.swapReserved(initialPrintIndexes[2])).to.equal(false)
        expect(await dada.DrawingPrintToAddress(initialPrintIndexes[2])).to.equal(dadaReserve.address)
        expect(dadaSaleAsBob.purchase(1, drawingIds[2], initialPrintIndexes[2], {value: 10})).to.be.revertedWith('!value')
      })
      
      it('Fails if not on allow list', async function () {
        expect(await dadaSale.state(1)).to.equal(true)
        expect(dadaSaleAsCeleste.purchase(1, drawingIds[2], initialPrintIndexes[2], {value: 12})).to.be.revertedWith('!allowList')
      })

      it('Allows an eligible buyer to buy ERC20 at discount', async function () {
        expect(await anyNft.ownerOf(2)).to.equal(bobAddress)
        expect(await dadaSale.purchases(1, bobAddress, drawingIds[2])).to.equal(0)
        expect(await dadaSale.swapReserved(initialPrintIndexes[2])).to.equal(false)
        expect(await dada.DrawingPrintToAddress(initialPrintIndexes[2])).to.equal(dadaReserve.address)
        await dadaSaleAsBob.purchase(1, drawingIds[2], initialPrintIndexes[2], {value: 12})
        expect(await dada.DrawingPrintToAddress(initialPrintIndexes[2])).to.equal(bobAddress)
        expect(await anyNft.ownerOf(2)).to.equal(bobAddress)
        expect(await dadaSaleAsBob.swapReserved(initialPrintIndexes[2])).to.equal(false)
      })
      
      it('Increases the purchases tracker for a drawing', async function() {
        expect(await dadaSale.purchases(1, bobAddress, drawingIds[2])).to.equal(1)
      })
      
      it('Sets the last sale on the collectible contract', async function () {
        const offer = await dada.OfferedForSale(initialPrintIndexes[2])
        expect(offer.lastSellValue).to.equal(12)
        expect(offer.isForSale).to.equal(false)
        expect(offer.seller).to.equal(bobAddress)

      })

      it('Sets the price list', async function () {
        const priceList: [number, number][] = drawingIds.map((value: number, index:number) => [value, 20 + index]) 
        await dadaSale.setPriceList(2, priceList)
      })

      it('Sets the purchase cap', async function () {
        const drawingCaps: [number, number][] = drawingIds.map((value: number, index:number) => [value, 2]) 
        await dadaSale.setDrawingCap(2, drawingCaps)
      })

      it('Sets the allowList', async function () {
        await dadaSale.setAllowList(2, [aliceAddress, bobAddress], true)
      })

      it('Fails if contract state is not in public mode', async function() {
        expect(dadaSaleAsBob.purchase(2, drawingIds[3], initialPrintIndexes[3], {value: 13})).to.be.revertedWith('!round-state')
      })

      it('Sets the state to discount, swap, and allowList', async function () {
        await dadaSale.setContractState([true, true, true])
        expect(await dadaSale.state(0)).to.equal(true)
        expect(await dadaSale.state(1)).to.equal(true)
        expect(await dadaSale.state(2)).to.equal(true)
      })

      it('Fails if attempst to purchase swap reserved token', async function () {
        await dadaSale.setSwapList([[3, drawingIds[1], initialPrintIndexes[1]]], true)
        expect(await dadaSale.swapReserved(initialPrintIndexes[1])).to.equal(true)
        expect(await dada.DrawingPrintToAddress(initialPrintIndexes[1])).to.equal(dadaReserve.address)
        expect(dadaSaleAsBob.purchase(2, drawingIds[1], initialPrintIndexes[1], {value: 21})).to.be.revertedWith('reserved')
      })

      it('Fails purchase if not exact eth amount', async function () {
        expect(await dadaSale.swapReserved(initialPrintIndexes[3])).to.equal(false)
        expect(await dada.DrawingPrintToAddress(initialPrintIndexes[3])).to.equal(dadaReserve.address)
        expect(dadaSaleAsBob.purchase(2, drawingIds[3], initialPrintIndexes[3], {value: 10})).to.be.revertedWith('!value')
      })
      

      it('Allows an eligible buyer to buy ERC20 if on allowList', async function () {
        expect(await dadaSale.swapReserved(initialPrintIndexes[3])).to.equal(false)
        expect(await dada.DrawingPrintToAddress(initialPrintIndexes[3])).to.equal(dadaReserve.address)
        await dadaSaleAsBob.purchase(2, drawingIds[3], initialPrintIndexes[3], {value: 23})
        expect(await dada.DrawingPrintToAddress(initialPrintIndexes[3])).to.equal(bobAddress)
      })
      
      it('Fails if eligible buyer tries to buy over the cap', async function() {
        await dadaSaleAsBob.purchase(2, drawingIds[3], initialPrintIndexes[3] + 1, {value: 23})
        expect(dadaSaleAsBob.purchase(2, drawingIds[3], initialPrintIndexes[3] + 1, {value: 23})).to.be.revertedWith('!cap');

      })
      
      it('Sets the last sale on the collectible contract', async function () {
        const offer = await dada.OfferedForSale(initialPrintIndexes[3])
        expect(offer.lastSellValue).to.equal(23)
        expect(offer.isForSale).to.equal(false)
        expect(offer.seller).to.equal(bobAddress)

      })

      it('Does not allow non-operator to withdraw eth', async function() {
        expect(dadaSaleAsBob.withdraw(bobAddress)).to.be.revertedWith('!operator')
      })

      it('Allows operator to withdraw eth', async function() {
        await bob.sendTransaction({to: dadaSale.address, value: BigNumber.from('1000000000000000000')})
        const bobBalanceBefore = await bob.getBalance()
        const saleBalance = await provider.getBalance(dadaSale.address)
        await dadaSale.grantRole(operatorRole, bobAddress)
        await dadaSaleAsBob.withdraw(bobAddress)
        const bobBalanceAfter = await bob.getBalance()
        expect(bobBalanceAfter.gt(bobBalanceBefore)).to.equal(true)
      })

  })

})
