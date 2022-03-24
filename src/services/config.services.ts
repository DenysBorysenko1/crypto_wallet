import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

class ConfigService {
  constructor(private env: Record<string, string>) {}

  private getValue(key: string): string {
    return this.env[key];
  }

  public get port(): string {
    return this.getValue('PORT');
  }

  public get tetherContractAddress(): string {
    return '0xdAC17F958D2ee523a2206206994597C13D831ec7';
  }

  public get tetherDecimalPlaces(): number {
    return 6;
  }

  public get web3HttpProvider(): string {
    return this.getValue('WEB3_HTTP_PROVIDER');
  }

  public get databaseConfig(): DataSourceOptions {
    return {
      type: 'postgres',
      host: this.getValue('DB_HOST'),
      port: Number(this.getValue('DB_PORT')),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),
      entities: ['**/*.entity{.ts,.js}'],
      synchronize: Boolean(this.getValue('DB_SYNCHRONIZE')),
    };
  }
}

const configService = new ConfigService(process.env);

export { configService };
