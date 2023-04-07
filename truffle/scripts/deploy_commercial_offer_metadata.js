require('dotenv').config()
const key = process.env.PINATA_KEY
const secret = process.env.PINATA_SECRET
const pinataSDK = require('@pinata/sdk')
const deploy_invest_ticket_metadata = new pinataSDK(key, secret)
const fs = require('fs')
const readableStreamForFile = fs.createReadStream('/Users/dylandivito/DEV/Solidity/Mining-DAO/truffle/scripts/images/ticket.png')