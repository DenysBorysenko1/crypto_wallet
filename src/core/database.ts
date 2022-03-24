import { DataSource } from 'typeorm';
import { configService } from '../services/config.services';

export const database = new DataSource(configService.databaseConfig);
