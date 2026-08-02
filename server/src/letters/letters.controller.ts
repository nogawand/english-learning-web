import { Controller, Get, Param } from '@nestjs/common';
import { LettersService } from './letters.service';

@Controller('api/letters')
export class LettersController {
  constructor(private readonly lettersService: LettersService) {}

  @Get('current')
  async getCurrentLetter() {
    return this.lettersService.getCurrentLetter();
  }

  @Get('unit/:id')
  async getUnitLetters(@Param('id') id: string) {
    return this.lettersService.getLettersByUnit(+id); //plus convert to string
  }
}