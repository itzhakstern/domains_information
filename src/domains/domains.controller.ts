import { Body, Controller, Get, Post } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { DomainDto } from './dto/domain.dto';
import { GetDomainInformationDto } from './dto/get-domain-information.dto';

/**
 * A controller that responsible for handling incoming HTTP requests related to domains. It uses the DomainsService to process the requests and return appropriate responses.
 */
@Controller('domains')
export class DomainsController {
  /**
   * Creates a new instance of the DomainsController.
   * @param domainsService The service that will handle domain-related operations.
   */
  constructor(private domainsService: DomainsService) {}

  /**
   * Retrieves the information for the given domain.
   */
  @Get()
  getInformationByDomain(
    @Body() domainDto: DomainDto,
  ): Promise<GetDomainInformationDto | { msg: string }> {
    return this.domainsService.getInformationByDomain(domainDto);
  }

  /**
   * Adds a new domain to the system.
   */
  @Post()
  addDomain(@Body() domainDto: DomainDto): Promise<void> {
    return this.domainsService.addDomain(domainDto);
  }
}
