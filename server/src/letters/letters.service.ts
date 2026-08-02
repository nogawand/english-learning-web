import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Letter } from '../entities/letter.entity';
import { Unit } from '../entities/unit.entity';
import { LETTERS_TEXTS } from './letters.texts';

@Injectable()
export class LettersService implements OnModuleInit {
  constructor(
    @InjectRepository(Letter)
    private letterRepository: Repository<Letter>,
    
    // add access to the units table
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}

  // TEMP - DATA FOR STARTING
  // this function will run automatically when the server starts
  async onModuleInit() {
    const lettersCount = await this.letterRepository.count();
    
    // if the table is empty, run the data insertion
    if (lettersCount === 0) {

      // create the first unit for the letters
      let baseUnit = await this.unitRepository.findOne({ where: {} });
      if (!baseUnit) {
        baseUnit = this.unitRepository.create({
          title: 'לימוד אותיות - ABC',
          orderIndex: 1,
        });
        await this.unitRepository.save(baseUnit);
      }

  
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

      // Iterating on loop and save each letter
      for (const char of alphabet) {
        const newLetter = this.letterRepository.create({
          uppercase: char,
          lowercase: char.toLowerCase(),
          audioUrl: null,
          unit: baseUnit,
        });
        await this.letterRepository.save(newLetter);
      }
    }
  }

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
      order: { id: 'ASC' }, // save the order
    });
    
    if (!letters || letters.length === 0) {
      throw new NotFoundException(LETTERS_TEXTS.NOT_FOUND_AT_UNIT);
    }
    
    return letters;
  }
}