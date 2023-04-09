import { Contract, ethers } from 'ethers'
import { commercialOfferContractABI } from 'contracts/commercialOffer/'
import { OfferDetail, unboxOfferDetail } from 'types/contractTypes/offerTypes'

export class CommercialOfferContractService {
  private static INSTANCE: CommercialOfferContractService | null = null

  private readonly contract: Contract
  private readonly account: string
  private readonly address: string

  private constructor (contract: Contract, account: string, address: string) {
    this.contract = contract
    this.account = account
    this.address = address
  }

  static getInstance (address: string, account: string, signerOrProvider: any): CommercialOfferContractService {
    const contract = new ethers.Contract(address, commercialOfferContractABI, signerOrProvider)
    contract.connect(account)
    this.INSTANCE = new CommercialOfferContractService(contract, account, address)
    return this.INSTANCE
  }

  public async getOwner (): Promise<string> {
    const result = await this.contract.owner()
    return result
  }

  public async getOfferDetail (): Promise<OfferDetail> {
    const result = await this.contract.getOfferDetail()
    console.log('OFFER DETAIL RESULT', result)
    return unboxOfferDetail(this.address, result)
  }
}
