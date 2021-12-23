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
import { wrap2017, wrap2019 } from './presets'

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

    provider = ethers.provider
  })

  let priceLookup: { [key: number]: string } = {}

  for (let index = 0; index < drawingIds.length; index++) {
    const drawingId = drawingIds[index]
    priceLookup[drawingId] = initialPrices[index]
  }

  describe('Simulation', function () {
    this.beforeEach(async function () {
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
        const printId = initialPrintIndexes[0]
        const price = ethers.utils.parseUnits(initialPrices[0], 'wei')

        await wrap2017(dadaAsAlice, price, dadaWrapperAsAlice, drawingId, printId)

        expect(await dada.DrawingPrintToAddress(printId)).to.equal(dadaWrapper.address)
        const tokenId = await dadaWrapper.get2017TokenId(drawingId, printId)
        expect(await dadaWrapper.ownerOf(tokenId)).to.equal(aliceAddress)
      })
      it('Fails if token is not offered to contract', async function () {
        const drawingId = drawingIds[0]
        const printId = initialPrintIndexes[0]
        const price = ethers.utils.parseUnits(initialPrices[0], 'wei')
        const tokenId = await dadaWrapper.get2017TokenId(drawingId, printId)

        await dadaAsAlice.alt_buyCollectible(drawingId, printId, { value: price })

        expect(dadaWrapperAsAlice.wrap2017(drawingId, printId)).to.be.reverted
        expect(await dada.DrawingPrintToAddress(printId)).to.equal(alice.address)
        expect(dadaWrapper.ownerOf(tokenId)).to.be.revertedWith('ERC721: owner query for nonexistent token')
      })

      it('Fails if Alice does not own token', async function () {
        const drawingId = drawingIds[0]
        const printId = initialPrintIndexes[0]
        const price = ethers.utils.parseUnits(initialPrices[0], 'wei')
        const tokenId = await dadaWrapper.get2017TokenId(drawingId, printId)

        await dadaAsAlice.alt_buyCollectible(drawingId, printId, { value: price })
        await dadaAsAlice.transfer(deployer.address, drawingId, printId)

        expect(dadaWrapperAsAlice.wrap2017(drawingId, printId)).to.be.revertedWith('!owner')
        expect(await dada.DrawingPrintToAddress(printId)).to.equal(deployer.address)
        expect(dadaWrapper.ownerOf(tokenId)).to.be.revertedWith('ERC721: owner query for nonexistent token')
      })

      it('Fails if Dada contract is paused', async function () {
        const drawingId = drawingIds[0]
        const printId = initialPrintIndexes[0]
        const price = ethers.utils.parseUnits(initialPrices[0], 'wei')
        const tokenId = await dadaWrapper.get2017TokenId(drawingId, printId)

        await dadaAsAlice.alt_buyCollectible(drawingId, printId, { value: price })
        await dadaAsAlice.offerCollectibleForSaleToAddress(drawingId, printId, 0, dadaWrapper.address)
        
        await dada.flipSwitchTo(false)
        

        expect(dadaWrapperAsAlice.wrap2017(drawingId, printId)).to.be.reverted
        expect(await dada.DrawingPrintToAddress(printId)).to.equal(alice.address)
        expect(dadaWrapper.ownerOf(tokenId)).to.be.revertedWith('ERC721: owner query for nonexistent token')
      })

      it('Allows alice to unwrap a token', async function () {
        const drawingId = drawingIds[0]
        const printId = initialPrintIndexes[0]
        const price = ethers.utils.parseUnits(initialPrices[0], 'wei')
        await wrap2017(dadaAsAlice, price, dadaWrapperAsAlice, drawingId, printId)
        const tokenId = await dadaWrapper.get2017TokenId(drawingId, printId)
        expect(await dada.DrawingPrintToAddress(printId)).to.equal(dadaWrapper.address)
        expect(await dadaWrapperAsAlice.ownerOf(tokenId)).to.equal(aliceAddress)

        await dadaWrapperAsAlice.unwrap2017(drawingId, printId)
        expect(dadaWrapper.ownerOf(tokenId)).to.be.revertedWith('ERC721: owner query for nonexistent token')
        expect(await dada.DrawingPrintToAddress(printId)).to.equal(aliceAddress)
      })
      it('Fails if sender does not own the wrapped token', async function () {
        const drawingId = drawingIds[0]
        const printId = initialPrintIndexes[0]
        const price = ethers.utils.parseUnits(initialPrices[0], 'wei')
        await wrap2017(dadaAsAlice, price, dadaWrapperAsAlice, drawingId, printId)
        const tokenId = await dadaWrapper.get2017TokenId(drawingId, printId)
        await dadaWrapperAsAlice.transferFrom(alice.address, deployer.address, tokenId)

        expect(dadaWrapperAsAlice.unwrap2017(drawingId, printId)).to.be.revertedWith('!owner')
      })
      it('Unwrap fails if dada contract is paused', async function () {
        const drawingId = drawingIds[0]
        const printId = initialPrintIndexes[0]
        const price = ethers.utils.parseUnits(initialPrices[0], 'wei')
        await wrap2017(dadaAsAlice, price, dadaWrapperAsAlice, drawingId, printId)
        
        await dada.flipSwitchTo(false)

        expect(dadaWrapperAsAlice.unwrap2017(drawingId, printId)).to.be.reverted
      })
      it('Allows alice to wrap the same token multiple times', async function () {
        const drawingId = drawingIds[0]
        const printId = initialPrintIndexes[0]
        const price = ethers.utils.parseUnits(initialPrices[0], 'wei')
        await wrap2017(dadaAsAlice, price, dadaWrapperAsAlice, drawingId, printId)
        const tokenId = await dadaWrapper.get2017TokenId(drawingId, printId)
        expect(await dada.DrawingPrintToAddress(printId)).to.equal(dadaWrapper.address)
        expect(await dadaWrapperAsAlice.ownerOf(tokenId)).to.equal(aliceAddress)

        await dadaWrapperAsAlice.unwrap2017(drawingId, printId)
        expect(dadaWrapper.ownerOf(tokenId)).to.be.revertedWith('ERC721: owner query for nonexistent token')
        expect(await dada.DrawingPrintToAddress(printId)).to.equal(aliceAddress)

        await dadaAsAlice.offerCollectibleForSaleToAddress(drawingId, printId, 0, dadaWrapperAsAlice.address)
        await dadaWrapperAsAlice.wrap2017(drawingId, printId)
        expect(await dada.DrawingPrintToAddress(printId)).to.equal(dadaWrapper.address)
        expect(await dadaWrapperAsAlice.ownerOf(tokenId)).to.equal(aliceAddress)
      })
      it('Retains the last sale price during wrapping', async function () {
        const drawingId = drawingIds[1]
        const printId = initialPrintIndexes[1]
        const price = ethers.utils.parseUnits(initialPrices[1], 'wei')
        await wrap2017(dadaAsAlice, price, dadaWrapperAsAlice, drawingId, printId)
        const offer = await dada.OfferedForSale(initialPrintIndexes[1])
        expect(offer.lastSellValue).to.equal(price)
        expect(offer.isForSale).to.equal(false)
        expect(offer.seller).to.equal(aliceAddress)
      })
    })
    describe('Wrapping 2019', function () {
      it('Allows alice to wrap a token', async function () {
        const tokenId = 1

        expect(await mockNft.ownerOf(tokenId)).to.equal(aliceAddress)
        await wrap2019(mockNftAsAlice, dadaWrapperAsAlice, tokenId)
        expect(await mockNft.ownerOf(tokenId)).to.equal(dadaWrapper.address)
        const wrappedTokenId = await dadaWrapper.get2019TokenId(mockConfig.nfts[0].itemId, tokenId)
        expect(await dadaWrapper.ownerOf(wrappedTokenId)).to.equal(aliceAddress)
      })
      it('Wrap fails if sender does not approve contract', async function () {
        const tokenId = 1

        expect(await mockNft.ownerOf(tokenId)).to.equal(aliceAddress)
        expect(dadaWrapperAsAlice.wrap2019(tokenId)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved')
      })
      it('Wrap fails if sender does not own token', async function () {
        const tokenId = 1

        expect(await mockNft.ownerOf(tokenId)).to.equal(aliceAddress)
        await mockNftAsAlice.transferFrom(alice.address, deployer.address,tokenId)
        expect(dadaWrapperAsAlice.wrap2019(tokenId)).to.be.revertedWith('!owner')
      })
      it('Allows multiple tokens from same item id to be wrapped', async function () {
        const tokenId = 1

        expect(await mockNft.ownerOf(tokenId)).to.equal(aliceAddress)
        await wrap2019(mockNftAsAlice, dadaWrapperAsAlice, tokenId)
        await wrap2019(mockNftAsAlice, dadaWrapperAsAlice, 2)
        expect(await mockNft.ownerOf(tokenId)).to.equal(dadaWrapper.address)
        expect(await mockNft.ownerOf(2)).to.equal(dadaWrapper.address)
        const wrappedTokenId = await dadaWrapper.get2019TokenId(mockConfig.nfts[0].itemId, tokenId)
        const wrappedTokenId2 = await dadaWrapper.get2019TokenId(mockConfig.nfts[0].itemId, 2)
        console.log({ wrappedTokenId, wrappedTokenId2 })
        expect(await dadaWrapper.ownerOf(wrappedTokenId)).to.equal(aliceAddress)
        expect(await dadaWrapper.ownerOf(wrappedTokenId2)).to.equal(aliceAddress)
      })
      it('Allows alice to unwrap a token', async function () {
        const tokenId = 1

        await wrap2019(mockNftAsAlice, dadaWrapperAsAlice, tokenId)
        const wrappedTokenId = await dadaWrapper.get2019TokenId(mockConfig.nfts[0].itemId, tokenId)
        expect(await mockNft.ownerOf(tokenId)).to.equal(dadaWrapper.address)
        expect(await dadaWrapper.ownerOf(wrappedTokenId)).to.equal(aliceAddress)

        await dadaWrapperAsAlice.unwrap2019(tokenId)
        expect(dadaWrapper.ownerOf(wrappedTokenId)).to.be.revertedWith('ERC721: owner query for nonexistent token')
        expect(await mockNft.ownerOf(tokenId)).to.equal(aliceAddress)
      })
      it('Unwrap fails if sender does not own token', async function () {
        const tokenId = 1

        await wrap2019(mockNftAsAlice, dadaWrapperAsAlice, tokenId)
        const wrappedTokenId = await dadaWrapper.get2019TokenId(mockConfig.nfts[0].itemId, tokenId)
        expect(await mockNft.ownerOf(tokenId)).to.equal(dadaWrapper.address)
        expect(await dadaWrapper.ownerOf(wrappedTokenId)).to.equal(aliceAddress)
        
        await dadaWrapperAsAlice.transferFrom(alice.address, deployer.address, wrappedTokenId)

        expect(dadaWrapperAsAlice.unwrap2019(tokenId)).to.be.revertedWith('!owner')
      })

      it('Allows alice to wrap a token multiple times', async function () {
        const tokenId = 1

        await wrap2019(mockNftAsAlice, dadaWrapperAsAlice, tokenId)
        const wrappedTokenId = await dadaWrapper.get2019TokenId(mockConfig.nfts[0].itemId, tokenId)
        expect(await mockNft.ownerOf(tokenId)).to.equal(dadaWrapper.address)
        expect(await dadaWrapper.ownerOf(wrappedTokenId)).to.equal(aliceAddress)

        await dadaWrapperAsAlice.unwrap2019(tokenId)
        expect(dadaWrapper.ownerOf(wrappedTokenId)).to.be.revertedWith('ERC721: owner query for nonexistent token')
        expect(await mockNft.ownerOf(tokenId)).to.equal(aliceAddress)

        await wrap2019(mockNftAsAlice, dadaWrapperAsAlice, tokenId)
        expect(await mockNft.ownerOf(tokenId)).to.equal(dadaWrapper.address)
        expect(await dadaWrapper.ownerOf(wrappedTokenId)).to.equal(aliceAddress)
      })
    })
    describe('Access control', function () {
      it('Allows owner to set base URI', async function () {
        const drawingId = drawingIds[0]
        const printId = initialPrintIndexes[0]
        const price = ethers.utils.parseUnits(initialPrices[0], 'wei')

        await wrap2017(dadaAsAlice, price, dadaWrapperAsAlice, drawingId, printId)

        const tokenId = await dadaWrapper.get2017TokenId(drawingId, printId)
        expect(await dadaWrapper.tokenURI(tokenId)).to.equal(mockConfig.baseUri + tokenId.toString() + '.json')

        await dadaWrapper.setBaseURI('newUri/')
        expect(await dadaWrapper.tokenURI(tokenId)).to.equal('newUri/' + tokenId.toString() + '.json')
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
