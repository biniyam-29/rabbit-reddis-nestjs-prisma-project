import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';
import { MenteesService } from './mentees.service';

@Controller()
export class MenteesController {
  constructor(
    private readonly menteesService: MenteesService,
    @Inject('MENTEES_SERVICE') private readonly client: ClientProxy, // Injecting the RabbitMQ client
  ) {}
  
  @Get()
  getHello(): string {
    this.client.emit('mentees_to_mentors', { text: 'Hello from Mentees!' }); // Sending message to Mentors
    return this.menteesService.getHello();
  }

  // Listen for messages from the 'mentors_to_mentees' pattern
  @MessagePattern('mentors_to_mentees') // Listening for messages from Mentors
  handleMentorsMessage(data: any) {
    console.log('Received message from mentors:', data);
  }  

  @Get('send')
  async sendMessage() {
    return this.menteesService.sendMessageToMentors({ text: 'Hello from Mentees!' });
  }
}
