import { BigNumber } from 'ethers'

interface Ticket {
  tokenId: BigNumber
  index: BigNumber
  ticketOwner: string
  escrowContract: string
  gweiValue: BigNumber
  isUsed: boolean
  isMinted: boolean
  isStaked: boolean
}

export type { Ticket }