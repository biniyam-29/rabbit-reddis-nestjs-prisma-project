import { Test, TestingModule } from '@nestjs/testing';
import { MenteesController } from './mentees.controller';
import { MenteesService } from './mentees.service';

describe('MenteesController', () => {
  let menteesController: MenteesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MenteesController],
      providers: [MenteesService],
    }).compile();

    menteesController = app.get<MenteesController>(MenteesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(menteesController.getHello()).toBe('Hello World!');
    });
  });
});
