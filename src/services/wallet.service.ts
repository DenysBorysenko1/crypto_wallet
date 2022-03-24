import { inject, injectable } from 'inversify';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { TYPES } from '../core/types';
import { Wallet } from '../entities/wallet.entity';
import { WalletBallance } from '../types/wallet.types';
import { configService } from './config.services';

@injectable()
export class WalletService {
  constructor(
    @inject(TYPES.WalletRepository) private walletRepository: Repository<Wallet>,
    @inject(TYPES.Web3Client) private web3Client: Web3,
  ) {}

  public async getBalance({ address }: Wallet): Promise<WalletBallance> {
    const tetherBalance = await this.getTetherBallance(address);
    const ethBalance = await this.getEthBallance(address);

    return { tetherBalance, ethBalance };
  }

  private async getTetherBallance(walletAddress: string): Promise<number> {
    const abi = [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
    ] as Array<AbiItem>;

    const contract = new this.web3Client.eth.Contract(
      abi,
      configService.tetherContractAddress,
    );
    const tetherBalance = await contract.methods
      .balanceOf(walletAddress)
      .call();

    return (
      Number(tetherBalance) / Math.pow(10, configService.tetherDecimalPlaces)
    );
  }

  private async getEthBallance(walletAddress: string): Promise<number> {
    const balance = await this.web3Client.eth.getBalance(walletAddress);
    const formatted = this.web3Client.utils.fromWei(balance);

    return Number(formatted);
  }

  public create(address: string): Promise<Wallet> {
    const wallet = new Wallet();
    wallet.address = address;

    return this.walletRepository.save(wallet);
  }

  public update(id: number, address: string): Promise<UpdateResult> {
    return this.walletRepository.update(id, { address });
  }

  public delete(id: number): Promise<DeleteResult> {
    return this.walletRepository.delete(id);
  }

  public getById(id: number): Promise<Wallet> {
    return this.walletRepository.findOneBy({ id });
  }
}
