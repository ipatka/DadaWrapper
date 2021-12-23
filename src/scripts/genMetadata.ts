import * as fs from 'fs'
const srcMeta = require('../input/2019a.json')
const supplies = require('./supplies.json')

const basePath = '/Users/isaacpatka/dada/DadaWrapper/outputtest/'

const initialPrints = {}
const supplyMap = {}
for (let index = 0; index < supplies.length; index++) {
  const element = supplies[index]
  initialPrints[element['Drawing Id']] = element['Initial PrintIndex']
  supplyMap[element['Drawing Id']] = element['Total Supply']
}

console.log({ initialPrints })

const saveMeta = (metadata: string, filename: string) => {
  fs.writeFileSync(`${basePath}${filename}.json`, metadata)
}

const start = 0
const end = srcMeta.length
console.log({end})

let count = 0

for (let index = start; index < end; index++) {
  const element = srcMeta[index]
  console.log({element})
  const metadata = {
    name: element['name'],
    description: element['description'],
    image: element['Image reference'],
    attributes: [
      {
        trait_type: 'collection',
        value: element['Trait : Collection'],
      },
      {
        trait_type: 'artist',
        value: element['Trait : Artist'],
      },
      {
        trait_type: 'artist profile',
        value: element['Trait : Artist Profile'],
      },
      {
        trait_type: 'scarcity',
        value: element['Trait : Scarcity'],
      },
      {
        trait_type: 'supply',
        value: element['Trait : Supply'],
      },
      {
        trait_type: 'drawing date',
        value: element['Trait : Drawing Date'],
      },
      {
        trait_type: 'drawing name',
        value: element['Trait : Drawing Name'],
      },
      {
        trait_type: 'conversation',
        value: element['Trait : Conversation'],
      },
    ],
  }
  if (element['Trait : Scientific Name'])
    metadata.attributes.push({
      trait_type: 'scientific name',
      value: element['Trait : Scientific Name'],
    })
  if (element['Trait : Animal'])
    metadata.attributes.push({
      trait_type: 'animal',
      value: element['Trait : Animal'],
    })
  if (element['Trait : Occupation'])
    metadata.attributes.push({
      trait_type: 'occupation',
      value: element['Trait : Occupation'],
    })

  if (element['Year'] == 2019) {
    const tokenId = element['drawingId / _tokenId']
    const tokenNumber = element['printIndex / token number']
      const tokenNumberPadded = ('00000' + tokenNumber).slice(-5)
      const tokenIdPadded = ('00000' + tokenId).slice(-5)
      const wrappedTokenId = `2019${tokenIdPadded}${tokenNumberPadded}`
      console.log({ wrappedTokenId, metadata: JSON.stringify(metadata) })
      saveMeta(JSON.stringify(metadata), wrappedTokenId)
  }
  if (element['Year'] == 2017) {
    const drawingId = element['drawingId / _tokenId']
    const drawingIdPadded = ('00000' + drawingId).slice(-5)
    const totalSupply = supplyMap[drawingId]
    const initialPrint = initialPrints[drawingId]
    for (let j = 0; j < totalSupply; j++) {
      const tokenId = initialPrint + j
      const tokenIdPadded = ('00000' + tokenId).slice(-5)
      const wrappedTokenId = `2017${drawingIdPadded}${tokenIdPadded}`
      // console.log({ wrappedTokenId, metadata: JSON.stringify(metadata) })
      saveMeta(JSON.stringify(metadata), wrappedTokenId)
      count++
      console.log({ index, j, count })
    }
  }
}
