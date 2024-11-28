import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class MenteesService {
  private client: ClientProxy;

  constructor() {
    // Create a RabbitMQ client to communicate with 'mentors_queue'
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'mentors_queue',
        queueOptions: { durable: true },
      },
    });
  }

  getHello(): string {
    return 'Hello from Mentees!';
  }

  async sendMessageToMentors(message: any) {
    return this.client.emit('mentees_to_mentors', message); // Publish to the mentors queue
  }
}
