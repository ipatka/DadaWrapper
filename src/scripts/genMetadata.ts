import * as fs from 'fs'
const srcMeta = require('./csvjson(1).json')
const supplies = require('./supplies.json')

const basePath = '/Users/isaacpatka/dada/DadaWrapper/output2019/'

const initialPrints = {}
for (let index = 0; index < supplies.length; index++) {
  const element = supplies[index]
  initialPrints[element['Drawing Id']] = element['Initial PrintIndex']
}

console.log({ initialPrints })

const saveMeta = (metadata: string, filename: string) => {
  fs.writeFileSync(`${basePath}${filename}.json`,metadata)
}

for (let index = 0; index < srcMeta.length; index++) {
  const element = srcMeta[index]
  const metadata = {
    name: `${element['Year']} ${element['name']}`,
    image: element['image'],
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
        trait_type: 'conversation',
        value: element['Trait : Conversation'],
      },
    ],
  }
  if (element['Year'] == 2019) {
    const tokenId = element['drawingId / _tokenId']
    const tokenNumber = element['printIndex / token number']
    if (tokenNumber) {
      const tokenNumberPadded = ('00000' + tokenNumber).slice(-5)
      const tokenIdPadded = ('00000' + tokenId).slice(-5)
      const wrappedTokenId = `2019${tokenIdPadded}${tokenNumberPadded}`
      console.log({ wrappedTokenId })
      saveMeta(JSON.stringify(metadata), wrappedTokenId)
    }
  }
  if (element['Year'] == 2017) {
    const drawingId = element['drawingId / _tokenId']
    const drawingIdPadded = ('00000' + drawingId).slice(-5)
    const totalSupply = initialPrints[drawingId]
    const initialPrint = initialPrints[drawingId]
    console.log({ totalSupply })
    for (let index = 0; index < totalSupply; index++) {
      const tokenId = initialPrint + index
      const tokenIdPadded = ('00000' + tokenId).slice(-5)
      const wrappedTokenId = `2017${drawingIdPadded}${tokenIdPadded}`
      console.log({ wrappedTokenId, metadata: JSON.stringify(metadata) })
      saveMeta(JSON.stringify(metadata), wrappedTokenId)
    }
  }
}
