import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LettersController } from './letters.controller';
import { LettersService } from './letters.service';
import { Letter } from '../entities/letter.entity';
import { Unit } from '../entities/unit.entity';

@Module({
  // this line creates the tools to work with the specific table
  imports: [TypeOrmModule.forFeature([Letter, Unit])], 
  controllers: [LettersController],
  providers: [LettersService],
})
export class LettersModule {}