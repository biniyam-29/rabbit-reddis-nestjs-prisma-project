import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MenteesModule } from './mentees.module';

async function bootstrap() {
  const app = await NestFactory.create(MenteesModule);

  // Connect RabbitMQ microservice
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ URL
      queue: 'mentees_queue',          // Queue for the Mentees app
      queueOptions: { durable: true }, // Ensure queue durability
    },
  });

  await app.startAllMicroservices();
  await app.listen( 3002);
  console.log('Mentees app is running on http://localhost:3002');
  console.log(`Mentees app running on port ${process.env.PORT}`);
}
bootstrap();
