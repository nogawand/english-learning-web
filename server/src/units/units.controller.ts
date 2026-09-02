import { Controller, Get } from '@nestjs/common';
import { UnitsService } from './units.service';

@Controller('api/units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  async findAll() {
    return this.unitsService.findAll();
  }
}