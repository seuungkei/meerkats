import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import routes from './routes/index';
import { errorMiddleware } from './middlewares/error';

dotenv.config();

class Server {
  private static instance: Server;
  public app: express.Application;
  private PORT: string | undefined;

  constructor() {
    const app: express.Application = express();
    this.app = app;
    this.PORT = process.env.PORT;
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  private setMiddleware() {
    this.app.use(cors());
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(routes);
  }

  private setErrorHandlers() {
    this.app.use(errorMiddleware);
  }

  private get() {
    this.app.get('/ping', (req, res) => {
      res.status(200).json({ message: 'pong' });
    });
  }

  public listen() {
    this.setMiddleware();
    this.setErrorHandlers();
    this.get();

    this.app.listen(this.PORT, () => {
      console.log(`server is listening on ${this.PORT}🔥🔥🔥🔥🔥🔥🔥`);
    });
  }
}

const server = Server.getInstance();
server.listen();

export default server;
