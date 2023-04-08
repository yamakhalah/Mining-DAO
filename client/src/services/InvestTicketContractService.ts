import { Contract, ethers } from 'ethers'
import { investTicketContractAddress, investTicketContractABI } from 'contracts/mintTicket/'

export class InvestTicketContractService {
  private static INSTANCE: InvestTicketContractService | null = null

  private readonly contract: Contract
  private readonly account: string

  private constructor (contract: Contract, account: string) {
    this.contract = contract
    this.account = account
  }

  static getInstance (account: string, signerOrProvider: any): InvestTicketContractService {
    const contract = new ethers.Contract(investTicketContractAddress, investTicketContractABI, signerOrProvider)
    contract.connect(account)
    this.INSTANCE = new InvestTicketContractService(contract, account)
    return this.INSTANCE
  }

  public async getOwner(): Promise<any> {
    const result = await this.contract.getOwner()
    return result
  }

  public async getTicketsByAddress (address: string): Promise<any> {
    const result = await this.contract.getTicketsByAddress(address)
    return result
  }

  public async getTicketByTokenId (tokenId: number): Promise<any> {
    const result = await this.contract.getTicketByTokenId(tokenId)
    return result
  }

  public async getTotalNFT (): Promise<any> {
    const result = await this.contract.getTotalNFT()
    return result
  }

  public async getTokenUri (): Promise<any> {
    const result = await this.contract.getTokenUri()
    return result
  }

  public async setTokenUri (tokenUri: string): Promise<any> {
    const result = await this.contract.setTokenUri(tokenUri)
    return result
  }

  public async getMintPriceETH (): Promise<any> {
    const result = await this.contract.getMintPriceETH()
    return result
  }

  public async setMintPriceETH (value: number): Promise<any> {
    const result = await this.contract.setMintPriceETH(value)
    return result
  }

  public async mintTicketETH (address: string): Promise<any> {
    const transaction = await this.contract.mintTicketETH(address, { value: ethers.utils.parseEther('0.001'), gasLimit: 5000000 })
    const result = await transaction.wait()
    return result
  }

  public async refundTicket (address: string, tokenId: number): Promise<any> {
    console.log('TOKEN ID', tokenId)
    const transaction = await this.contract.refundTicket(address, tokenId, { gasLimit: 5000000 })
    const result = await transaction.wait()
    return result
  }
}
