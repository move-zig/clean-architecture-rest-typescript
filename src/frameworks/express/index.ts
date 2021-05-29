import compression from 'compression';
import express from 'express';
import helmet from 'helmet';

import { errorHandler } from './errrorHandler';
import { router } from './routes';

const port = 3000;

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());

app.use(router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
