import { BigNumber } from 'ethers'

interface OfferDetail {
  address: string
  offerName: string
  ref: string
  minimumTickets: number
  maximumTickets: number
  ticketsCounter: number
  lockTimeLimit: Date
}

interface OfferDetailReturn {
  offerName: string
  ref: string
  minimumTickets: BigNumber
  maximumTickets: BigNumber
  ticketsCounter: BigNumber
  lockTimeLimit: BigNumber
}

function unboxOfferDetail (address: string, offerDetailReturn: OfferDetailReturn): OfferDetail {
  console.log('')
  return {
    address: address,
    offerName: offerDetailReturn.offerName,
    ref: offerDetailReturn.ref,
    minimumTickets: offerDetailReturn.minimumTickets.toNumber(),
    maximumTickets: offerDetailReturn.maximumTickets.toNumber(),
    ticketsCounter: offerDetailReturn.ticketsCounter.toNumber(),
    lockTimeLimit: new Date(offerDetailReturn.lockTimeLimit.toNumber() * 1000)
  }
}

export type { OfferDetail, OfferDetailReturn }

export { unboxOfferDetail }
