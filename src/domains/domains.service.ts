import { Injectable } from '@nestjs/common';
import { DomainDto } from './dto/domain.dto';

@Injectable()
export class DomainsService {
  private domainsWithInformation = {
    'https://docs.nestjs.com/techniques/validation': {
      virusTotal: 'ljsebfhebckwebCOAK',
      WHOLS: 'AAA',
    },
  };
  private domainsWithoutInformation = new Set();
  getInformation(domainDto: DomainDto): object {
    const domain = domainDto.domain;
    const domainResult = this.domainsWithInformation[domain];
    if (domainResult) {
      return domainResult;
    }
    this.domainsWithoutInformation.add(domain);
    return { msg: `Informaition about ${domain} not found` };
  }

  addDomain(domainDto: DomainDto): object {
    return {};
  }
}
