import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import mongoose from "mongoose";
import { routes } from './routes';
import { config } from './config/configs';
import Logging from './library/logging';
import Role from "./models/role.model";

const router: Express = express();

/** Connect to Mongo */
mongoose
  .connect(config.mongo.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    Logging.info('Mongo connected successfully.');
    StartDatabase();
    StartServer();
  })
  .catch((error) => {
    Logging.error(error)
  });

/** Only Start Server if Mongoose Connects */

const StartServer = () => {
  /** Log the request */
  router.use((req: Request, res: Response, next: NextFunction) => {
    /** Log the req */
    Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
      /** Log the res */
      Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
    });

    next();
  });

  /** Parse requests of content-type - application/x-www-form-urlencoded */
  router.use(express.urlencoded({ extended: true }));
  /** Parse requests of content-type - application/json */
  router.use(express.json());
  router.use(cors({ origin: '*' }));

  /** Rules of our API */
  router.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }

    next();
  });

  /** Routes */
  router.use("/api", routes);

  /** Error handling */
  router.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Not found');

    Logging.error(error);

    res.status(404).json({
      message: error.message
    });
  });

  http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
};

const StartDatabase = async () => {
  try {
    const documentCount = await Role.estimatedDocumentCount();
    if (documentCount === 0) {
      Role.insertMany(config.server.roles.map((name: string) => ({ name }))).then(() => {
        Logging.info("Added 'user', 'moderator', 'admin' to roles collection");
      }).catch((error) => { Logging.error(error) });
    }
  } catch (error) {
    Logging.error(error)
  }
}
