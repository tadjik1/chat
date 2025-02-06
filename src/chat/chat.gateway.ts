import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      return client.disconnect(true);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;

      this.server.emit('message', {
        username: 'System',
        text: `User ${client.data.user.username} joined the chat.`,
      });
    } catch (error) {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('chatMessage')
  chatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: { text: string },
  ) {
    this.server.emit('message', {
      username: client.data.user.username,
      text: message.text,
    });
    // client.emit("...", "...");
    // client.broadcast.emit("...","...");
  }
}
