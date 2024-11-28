import { createClient } from 'redis';
import { NestFactory } from '@nestjs/core';
import { MentorsModule } from './mentors.module';
import * as amqp from 'amqplib';

async function bootstrap() {
  const app = await NestFactory.create(MentorsModule);

  // RabbitMQ connection
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
  const rabbitConnection = await amqp.connect(rabbitmqUrl);
  const channel = await rabbitConnection.createChannel();
  const queue = 'mentee-messages';

  await channel.assertQueue(queue);

  // Redis connection
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const redisClient = createClient({ url: redisUrl });

  redisClient.on('error', (err) => console.error('Redis Error:', err));
  await redisClient.connect();

  // Consume messages from RabbitMQ and store them in Redis
  channel.consume(queue, async (message) => {
    if (message) {
      const content = message.content.toString();
      console.log('Received from RabbitMQ:', content);

      // Store message in Redis
      await redisClient.rPush('mentee-messages', content);
      console.log('Message stored in Redis:', content);

      channel.ack(message);
    }
  });

  // Example of sending messages (stored in Redis first)
  async function sendMessageToRabbit(message: string) {
    // Store in Redis
    await redisClient.rPush('mentor-messages', message);
    console.log('Message stored in Redis:', message);

    // Publish to RabbitMQ
    channel.sendToQueue('mentor-messages', Buffer.from(message));
    console.log('Message sent to RabbitMQ:', message);
  }

  // Example usage of sending messages
  setInterval(() => {
    sendMessageToRabbit(`Hello from Mentor at ${new Date().toISOString()}`);
  }, 5000);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
