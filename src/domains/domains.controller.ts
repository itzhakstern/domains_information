import { Body, Controller, Get, Post } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { DomainDto } from './dto/domain.dto';

@Controller('domains')
export class DomainsController {
  constructor(private domainsService: DomainsService) {}
  @Get()
  getInformation(@Body() domainDto: DomainDto): object {
    return this.domainsService.getInformation(domainDto);
  }
  @Post()
  sddDomain(@Body() domainDto: DomainDto): object {
    return this.domainsService.addDomain(domainDto);
  }
}
