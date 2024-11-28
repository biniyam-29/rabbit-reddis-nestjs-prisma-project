import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class MentorsService {
  private client: ClientProxy;

  constructor() {
    // Create a RabbitMQ client to communicate with 'mentees_queue'
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'mentees_queue',
        queueOptions: { durable: true },
      },
    });
  }

  getHello(): string {
    return 'Hello from Mentors!';
  }

  async sendMessageToMentees(message: any) {
    return this.client.emit('mentors_to_mentees', message); // Publish to the mentees queue
  }
}
