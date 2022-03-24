import '../controllers/wallet.controller';
import { Container } from 'inversify';
import { WalletService } from '../services/wallet.service';
import { TYPES } from './types';
import { Wallet } from '../entities/wallet.entity';
import { database } from './database';
import { configService } from '../services/config.services';
import Web3 from 'web3';

export const container = new Container();

container.bind(TYPES.WalletService).to(WalletService);
container
  .bind(TYPES.WalletRepository)
  .toDynamicValue(() => database.getRepository(Wallet));
container
  .bind(TYPES.Web3Client)
  .toDynamicValue(() => new Web3(configService.web3HttpProvider));
