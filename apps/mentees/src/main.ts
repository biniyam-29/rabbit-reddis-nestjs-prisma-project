import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MenteesModule } from './mentees.module';
import * as amqp from 'amqplib';

async function bootstrap() {
  const app = await NestFactory.create(MenteesModule);
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
  const connection = await amqp.connect(rabbitmqUrl);
  const channel = await connection.createChannel();
  
  
  const queue = 'mentee-messages';
  await channel.assertQueue(queue);

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

  // Send a message every 5 seconds
  setInterval(() => {
    const message = `Hello from Mentee at ${new Date().toISOString()}`;
    channel.sendToQueue(queue, Buffer.from(message));
    console.log('Message sent to RabbitMQ:', message);
  }, 5000);
}
bootstrap();
