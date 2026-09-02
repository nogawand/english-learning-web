import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {}

  async findAll() {
    return await this.unitRepository.find({
      order: {
        orderIndex: 'ASC', // sorting from small to large so the units are displayed in the correct order
      },
    });
  }
}