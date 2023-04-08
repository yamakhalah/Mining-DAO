require('dotenv').config()
const key = process.env.PINATA_KEY
const secret = process.env.PINATA_SECRET
const pinataSDK = require('@pinata/sdk')
const pinata = new pinataSDK(key, secret)
const fs = require('fs')
const readableStreamForFile = fs.createReadStream('/Users/dylandivito/DEV/Solidity/Mining-DAO/truffle/scripts/images/MINING-NFT-GRIS.png')

const options = {
  pinataMetadata: {
    name: 'Mining DAO - Offer Ticket',
    description: 'Test',
    "attributes": [
      {
        "trait_type": "Mining Power",
        "value": "0"
      },
      {
        "trait_type": "DAO Vote Power",
        "value": "0"
      }
      ]
  },
  pinataOptions: {
    cidVersion: 0
  }
}

pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
  const body = {
    description: 'Your private mining ticket',
    image: result.IpfsHash,
    name: 'Offer Ticket'
  }

  pinata.pinJSONToIPFS(body, options).then((json) => {
    console.log(json)
  }).catch((err) => {
    console.log(err)
  })
}).catch((err) => {
  console.log(err)
})