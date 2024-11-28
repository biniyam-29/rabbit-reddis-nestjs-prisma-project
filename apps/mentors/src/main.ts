import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MentorsModule } from './mentors.module';

async function bootstrap() {
  const app = await NestFactory.create(MentorsModule);

  // Connect RabbitMQ microservice
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ URL
      queue: 'mentors_queue',          // Queue for the Mentors app
      queueOptions: { durable: true }, // Ensure queue durability
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
  console.log('Mentors app is running on http://localhost:3001');
}
bootstrap();
