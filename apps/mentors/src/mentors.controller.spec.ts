import { Test, TestingModule } from '@nestjs/testing';
import { MentorsController } from './mentors.controller';
import { MentorsService } from './mentors.service';

describe('MentorsController', () => {
  let mentorsController: MentorsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MentorsController],
      providers: [MentorsService],
    }).compile();

    mentorsController = app.get<MentorsController>(MentorsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mentorsController.getHello()).toBe('Hello World!');
    });
  });
});
