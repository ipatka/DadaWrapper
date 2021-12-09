import { ethers } from 'hardhat'
import { solidity } from 'ethereum-waffle'
import { ContractFactory } from 'ethers'
import { use, expect } from 'chai'
import { DadaCollectible } from '../src/types/DadaCollectible'
import { MockDadaNft } from '../src/types/MockDadaNft'
import { DadaCollectibleWrapper } from '../src/types/DadaCollectibleWrapper'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { drawingIds, initialPrices, initialPrintIndexes, totalSupplies } from '../src/util/simulation'
import { BaseProvider } from '@ethersproject/providers'

use(solidity)

describe.only('Dada Wrapper', function () {
  let DadaCollectible: ContractFactory
  let dada: DadaCollectible

  let DadaWrapper: ContractFactory
  let dadaWrapper: DadaCollectibleWrapper

  let MockNft: ContractFactory
  let mockNft: MockDadaNft

  let dadaAsAlice: DadaCollectible
  let dadaWrapperAsAlice: DadaCollectibleWrapper
  let dadaAsBob: DadaCollectible
  let dadaAsCeleste: DadaCollectible
  let mockNftAsAlice: MockDadaNft

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

  const mockConfig = {
    baseUri: 'baseuri/',
    contractUri: 'contracturi.json',
    nfts: [
      {
        itemId: 123,
      },
      {
        itemId: 456,
      },
      {
        itemId: 8662,
      },
    ],
  }

  let provider: BaseProvider

  this.beforeAll(async function () {
    DadaCollectible = await ethers.getContractFactory('DadaCollectible')
    DadaWrapper = await ethers.getContractFactory('DadaCollectibleWrapper')
    MockNft = await ethers.getContractFactory('MockDadaNFT')
    signers = await ethers.getSigners()
    deployer = signers[0]
    alice = signers[1]
    bob = signers[2]
    celeste = signers[3]

    deployerAddress = deployer.address
    aliceAddress = alice.address
    celesteAddress = celeste.address
    bobAddress = bob.address

    console.log({ deployerAddress, aliceAddress, celesteAddress, bobAddress })

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
      mockNft = (await MockNft.deploy()) as MockDadaNft
      // todo NFT address
      dadaWrapper = (await DadaWrapper.deploy(dada.address, mockNft.address, mockConfig.baseUri, mockConfig.contractUri)) as DadaCollectibleWrapper
      await dada.flipSwitchTo(true)

      dadaAsAlice = await dada.connect(alice)
      dadaWrapperAsAlice = await dadaWrapper.connect(alice)
      mockNftAsAlice = await mockNft.connect(alice)

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

      for (let index = 0; index < mockConfig.nfts.length; index++) {
        await mockNft.mintItem(aliceAddress, mockConfig.nfts[index].itemId)
      }
    })

    describe('Wrapping', function () {
      it('Allows alice to wrap a token', async function () {
        const drawingId = drawingIds[0]
        const printIdx = initialPrintIndexes[0]

        await dadaAsAlice.alt_buyCollectible(drawingId, printIdx)
        expect(await dada.DrawingPrintToAddress(printIdx)).to.equal(aliceAddress)

        await dadaAsAlice.offerCollectibleForSaleToAddress(drawingId, printIdx, 0, dadaWrapper.address)
        await dadaWrapperAsAlice.wrapCreep(drawingId, printIdx)
        expect(await dada.DrawingPrintToAddress(printIdx)).to.equal(dadaWrapper.address)
        const tokenId = await dadaWrapper.get2017TokenId(drawingId, printIdx)
        expect(await dadaWrapper.ownerOf(tokenId)).to.equal(aliceAddress)
      })
      it('Allows alice to unwrap a token', async function () {
        const drawingId = drawingIds[0]
        const printIdx = initialPrintIndexes[0]
        const tokenId = await dadaWrapper.get2017TokenId(drawingId, printIdx)
        console.log({ aliceAddress })
        expect(await dada.DrawingPrintToAddress(printIdx)).to.equal(dadaWrapper.address)
        expect(await dadaWrapperAsAlice.ownerOf(tokenId)).to.equal(aliceAddress)

        await dadaWrapperAsAlice.unwrapCreep(drawingId, printIdx)
        expect(dadaWrapper.ownerOf(tokenId)).to.be.revertedWith('ERC721: owner query for nonexistent token')
        expect(await dada.DrawingPrintToAddress(printIdx)).to.equal(aliceAddress)
      })
    })
    describe('Wrapping 2019', function () {
      it('Allows alice to wrap a token', async function () {
        const tokenId = 1

        expect(await mockNft.ownerOf(tokenId)).to.equal(aliceAddress)
        await mockNftAsAlice.approve(dadaWrapper.address, tokenId)

        await dadaWrapperAsAlice.wrapWeirdo(tokenId)
        expect(await mockNft.ownerOf(tokenId)).to.equal(dadaWrapper.address)
        const wrappedTokenId = await dadaWrapper.get2019TokenId(mockConfig.nfts[0].itemId, tokenId)
        console.log({ wrappedTokenId })
        expect(await dadaWrapper.ownerOf(wrappedTokenId)).to.equal(aliceAddress)
      })
      it('Allows alice to unwrap a token', async function () {
        const tokenId = 1

        const wrappedTokenId = await dadaWrapper.get2019TokenId(mockConfig.nfts[0].itemId, tokenId)
        expect(await mockNft.ownerOf(tokenId)).to.equal(dadaWrapper.address)
        expect(await dadaWrapper.ownerOf(wrappedTokenId)).to.equal(aliceAddress)

        await dadaWrapperAsAlice.unwrapWeirdo(tokenId)
        expect(dadaWrapper.ownerOf(wrappedTokenId)).to.be.revertedWith('ERC721: owner query for nonexistent token')
        expect(await mockNft.ownerOf(tokenId)).to.equal(aliceAddress)
      })
    })
    describe('Access control', function () {
      it('Allows owner to set base URI', async function () {
        const drawingId = drawingIds[0]
        const printIdx = initialPrintIndexes[0]

        await dadaAsAlice.offerCollectibleForSaleToAddress(drawingId, printIdx, 0, dadaWrapper.address)
        await dadaWrapperAsAlice.wrapCreep(drawingId, printIdx)
        const tokenId = await dadaWrapper.get2017TokenId(drawingId, printIdx)
        expect(await dadaWrapper.tokenURI(tokenId)).to.equal(mockConfig.baseUri + tokenId.toString())

        await dadaWrapper.setBaseURI('newUri/')
        expect(await dadaWrapper.tokenURI(tokenId)).to.equal('newUri/' + tokenId.toString())
        await dadaWrapper.setBaseURI(mockConfig.baseUri)
      })
      it('Does not allow anyone else to set base uri', async function () {
        expect(dadaWrapperAsAlice.setBaseURI('another/')).to.be.revertedWith('Ownable: caller is not the owner')
      })
      it('Allows owner to set contract URI', async function () {
        expect(await dadaWrapper.contractURI()).to.eq(mockConfig.contractUri)
        await dadaWrapper.setContractURI('another.json')
        expect(await dadaWrapper.contractURI()).to.eq('another.json')
        await dadaWrapper.setContractURI(mockConfig.contractUri)
      })
      it('Does not allow anyone else to set contract uri', async function () {
        expect(dadaWrapperAsAlice.setContractURI('another2.json')).to.be.revertedWith('Ownable: caller is not the owner')
      })
    })
  })
})
