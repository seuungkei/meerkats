import { Server as SocketIoServer, Socket } from 'socket.io';
import express from 'express';
import { createServer, Server } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const WEBSOCKET_CORS = {
  origin: '*',
  path: '/chatting/',
  methods: ['GET', 'POST'],
};

class SocketServer {
  private static instance: SocketServer;

  private app: express.Application;
  private httpServer: Server;

  private SOCKET_PORT: string | undefined;
  private io: SocketIoServer;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIoServer(this.httpServer, {
      cors: WEBSOCKET_CORS,
    });
    this.SOCKET_PORT = process.env.SOCKET_PORT;
  }

  public static getInstance(): SocketServer {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer();
    }
    return SocketServer.instance;
  }

  private countRoom(roomId: string) {
    return this.io.sockets.adapter.rooms.get(roomId)?.size ?? 0;
  }

  private configureIo() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Socket ${socket.id} connected`);

      socket.on('join_room', (roomId: string) => {
        socket.join(roomId);

        this.io.to(roomId).emit('count', this.countRoom(roomId));
        console.log(this.countRoom(roomId));
        console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
      });

      socket.on('send_message', (data: any) => {
        socket.to(data.room).emit('receive_message', data);
        console.log(data);
      });

      socket.on('leave', (roomId: string) => {
        socket.leave(roomId);

        socket.to(roomId).emit('count', this.countRoom(roomId));
        console.log(this.countRoom(roomId));
        console.log(`User with ID: ${socket.id} leave room: ${roomId}`);
      });

      socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
      });
    });
  }

  public listen() {
    this.app.use(cors());
    this.configureIo();

    this.httpServer.listen(this.SOCKET_PORT, () => {
      console.log(`server is listening on ${this.SOCKET_PORT}🔥🔥🔥🔥🔥🔥🔥`);
    });
  }
}

export { SocketServer };
