import { Body, Controller, Get, Post } from '@nestjs/common';
import { Domain } from './domain.entity';
import { DomainsService } from './domains.service';
import { DomainDto } from './dto/domain.dto';

@Controller('domains')
export class DomainsController {
  constructor(private domainsService: DomainsService) {}
  @Get()
  getInformationByDomain(@Body() domainDto: DomainDto): Promise<Domain> {
    return this.domainsService.getInformationByDomain(domainDto);
  }
  @Post()
  sddDomain(@Body() domainDto: DomainDto): Promise<Domain> {
    return this.domainsService.addDomain(domainDto);
  }
}
