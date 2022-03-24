import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './container';
import * as bodyParser from 'body-parser';

const application = new InversifyExpressServer(container);

application.setConfig((app) => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
});

export const server = application.build();
