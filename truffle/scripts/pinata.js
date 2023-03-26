require('dotenv').config()
const key = process.env.PINATA_KEY
const secret = process.env.PINATA_SECRET
const pinataSDK = require('@pinata/sdk')
const pinata = new pinataSDK(key, secret)
const fs = require('fs')
const readableStreamForFile = fs.createReadStream('./images/MINING-NFT-ORANGE.png')

const options = {
  pinataMetadata: {
    name: 'Mining DAO - Invest Ticket'
  },
  pinataOptions: {
    cidVersion: 0
  }
}

pinata.pinFilesToIPFS(readableStreamForFile, options).then((result) => {
  const body = {
    description: 'Investment Ticket',
    image: result.IpfsHash,
    name: 'Mining DAO - Invest Ticket Name'
  }

  pinata.pinJSONToIPFS(body, options).then((json) => {
    console.log(json)
  }).catch((err) => {
    console.log(err)
  })
}).catch((err) => {
  console.log(err)
})

