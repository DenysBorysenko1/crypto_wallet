import 'reflect-metadata';
import { database } from './core/database';
import { server } from './core/server';
import { configService } from './services/config.services';

Promise.all([
  database.initialize(),
  server.listen(configService.port, () => console.log(`Server running at http://127.0.0.1:${configService.port}`)),
]);
