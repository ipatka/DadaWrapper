import { BigNumber } from '@ethersproject/bignumber'
import { DadaCollectible } from '../src/types/DadaCollectible'
import { DadaCollectibleWrapper } from '../src/types/DadaCollectibleWrapper'
import { MockDadaNft } from '../src/types/MockDadaNft'

export const wrap2017 = async (dada: DadaCollectible, price: BigNumber, wrapper: DadaCollectibleWrapper, drawingId: number, printId: number) => {
  await dada.alt_buyCollectible(drawingId, printId, { value: price })

  await dada.offerCollectibleForSaleToAddress(drawingId, printId, 0, wrapper.address)
  await wrapper.wrap2017(drawingId, printId)
}

export const wrap2019 = async (dada: MockDadaNft, wrapper: DadaCollectibleWrapper, tokenId: number) => {
  await dada.approve(wrapper.address, tokenId)

  await wrapper.wrap2019(tokenId)
}
