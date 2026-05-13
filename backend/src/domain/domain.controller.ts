import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { DomainService } from './domain.service';

@Controller('api/domain')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Get('check')
  async checkDomain(@Query('value') value?: string) {
    if (!value?.trim()) {
      throw new BadRequestException('Domain value is required');
    }

    return this.domainService.checkAvailability(value);
  }
}
