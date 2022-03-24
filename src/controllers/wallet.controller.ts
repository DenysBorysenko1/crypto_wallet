import { Request, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../core/types';
import { WalletService } from '../services/wallet.service';
import { WalletBallance } from '../types/wallet.types';
import { body, ValidationError, validationResult } from 'express-validator';
import { Wallet } from '../entities/wallet.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { WalletMiddleware } from '../middleware/wallet.middleware';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  request,
  requestParam,
  response,
} from 'inversify-express-utils';

@controller('/wallet')
export class WallerController {
  constructor(
    @inject(TYPES.WalletService) private readonly walletService: WalletService,
  ) {}

  @httpGet('/:id')
  public async get(
    @requestParam('id') id: number,
    @response() response: Response,
  ): Promise<WalletBallance | Response<ValidationError>> {
    const wallet = await this.walletService.getById(id);

    if (!wallet) {
      return response.status(400).json();
    }

    return this.walletService.getBalance(wallet);
  }

  @httpPost('/', body('address').custom(WalletMiddleware.isCorrectAddress))
  public store(
    @request() request: Request,
    @response() response: Response,
  ): Promise<Wallet> | Response<ValidationError> {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(400).json(errors);

    return this.walletService.create(request.body.address);
  }

  @httpPut('/:id', body('address').custom(WalletMiddleware.isCorrectAddress))
  public update(
    @requestParam('id') id: number,
    @request() request: Request,
    @response() response: Response,
  ): Promise<UpdateResult> | Response<ValidationError> {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(400).json(errors);

    return this.walletService.update(id, request.body.address);
  }

  @httpDelete('/:id')
  public delete(@requestParam('id') id: number): Promise<DeleteResult> {
    return this.walletService.delete(id);
  }
}
