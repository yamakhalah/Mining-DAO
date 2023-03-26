require('dotenv').config()
const key = process.env.PINATA_KEY
const secret = process.env.PINATA_SECRET
const pinataSDK = require('@pinata/sdk')
const pinata = new pinataSDK(key, secret)
const fs = require('fs')
const readableStreamForFile = fs.createReadStream('/Users/dylandivito/DEV/Solidity/Mining-DAO/truffle/scripts/images/MINING-NFT-ORANGE.png')

const options = {
  pinataMetadata: {
    name: 'Mining DAO - Invest Ticket'
  },
  pinataOptions: {
    cidVersion: 0
  }
}

pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
  const body = {
    description: 'On your way to heaven',
    image: result.IpfsHash,
    name: 'Investment Ticket '
  }

  pinata.pinJSONToIPFS(body, options).then((json) => {
    console.log(json)
  }).catch((err) => {
    console.log(err)
  })
}).catch((err) => {
  console.log(err)
})

