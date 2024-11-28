import { Module } from '@nestjs/common';
import { MenteesController } from './mentees.controller';
import { MenteesService } from './mentees.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // RabbitMQ configuration
    ClientsModule.register([
      {
        name: 'MENTEES_SERVICE', // A name for the service
        transport: Transport.RMQ, // Define the transport as RabbitMQ
        options: {
          urls: ['amqp://localhost:5672'], // RabbitMQ connection URL
          queue: 'mentees_queue', // The queue to use in RabbitMQ
          queueOptions: {
            durable: false, // Non-durable queue for testing
          },
        },
      },
    ]),
  ],
  controllers: [MenteesController],
  providers: [MenteesService],
})
export class MenteesModule {}
