import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MentorsService } from './mentors.service';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class MentorsController {
  constructor(
    private readonly mentorsService: MentorsService,
    @Inject('MENTORS_SERVICE') private readonly client: ClientProxy, // Injecting the RabbitMQ client
  ) {}
  

  // Listen for messages from the 'mentees_to_mentors' pattern
  @MessagePattern('mentees_to_mentors') // Listening for messages from Mentees
  handleMenteesMessage(data: any) {
    console.log('Received message from mentees:', data);
  }

  @Get('send')
    async sendMessage() {
      return this.mentorsService.sendMessageToMentees({ text: 'Hello from Mentors!' });
  }

  @Get()
  getHello(): string {
    this.client.emit('mentors_to_mentees', { text: 'Hello from Mentors!' }); // Sending message to Mentees
    return this.mentorsService.getHello();
  }

}
