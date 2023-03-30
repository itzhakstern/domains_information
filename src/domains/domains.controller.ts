import { Body, Controller, Get } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { GetInformationDto } from './dto/get.dto';

@Controller('domains')
export class DomainsController {
  constructor(private domainsService: DomainsService) {}
  @Get()
  getInformation(@Body() getInformationDto: GetInformationDto): object {
    return this.domainsService.getInformation(getInformationDto);
  }
}
