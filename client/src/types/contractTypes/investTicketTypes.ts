import { BigNumber } from 'ethers'

interface Ticket {
  tokenId: BigNumber
  ticketOwner: string
  gweiValue: BigNumber
  isUsed: boolean
  isMinted: boolean
  isStaked: boolean
}

export type { Ticket }