import { Module } from '@nestjs/common';
import { MentorsController } from './mentors.controller';
import { MentorsService } from './mentors.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // RabbitMQ configuration
    ClientsModule.register([
      {
        name: 'MENTORS_SERVICE', // A name for the service
        transport: Transport.RMQ, // Define the transport as RabbitMQ
        options: {
          urls: ['amqp://localhost:5672'], // RabbitMQ connection URL (localhost and default port)
          queue: 'mentors_queue', // The queue to use in RabbitMQ
          queueOptions: {
            durable: false, // Non-durable queue to avoid persistence for testing
          },
        },
      },
    ]),
  ],
  controllers: [MentorsController],
  providers: [MentorsService],
})
export class MentorsModule {}
