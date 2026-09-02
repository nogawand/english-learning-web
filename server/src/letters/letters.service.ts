import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Letter } from '../entities/letter.entity';
import { Unit } from '../entities/unit.entity';
import { LETTERS_TEXTS } from './letters.texts';

@Injectable()
export class LettersService {
  constructor(
    @InjectRepository(Letter)
    private letterRepository: Repository<Letter>,
    
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}

  async getCurrentLetter() {
    const letter = await this.letterRepository.findOne({ where: {} });
    if (!letter) {
      throw new NotFoundException(LETTERS_TEXTS.NOT_FOUND_AT_DATABASE);
    }
    return letter;
  }

  async getLettersByUnit(unitId: number) {
    const letters = await this.letterRepository.find({
      where: { unit: { id: unitId } },
      relations: { unit: true },
      order: { id: 'ASC' }, 
    });
    
    if (!letters || letters.length === 0) {
      throw new NotFoundException(LETTERS_TEXTS.NOT_FOUND_AT_UNIT);
    }
    
    return letters;
  }
}