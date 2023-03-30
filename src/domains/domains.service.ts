import { Injectable } from '@nestjs/common';
import { GetInformationDto } from './dto/get.dto';

@Injectable()
export class DomainsService {
  private domainsWithInformation = {
    'https://docs.nestjs.com/techniques/validation': {
      virusTotal: 'ljsebfhebckwebCOAK',
      WHOLS: 'AAA',
    },
  };
  private domainsWithoutInformation = new Set();
  getInformation(getInformationDto: GetInformationDto): object {
    const domain = getInformationDto.domain;
    const domainResult = this.domainsWithInformation[domain];
    if (domainResult) {
      return domainResult;
    }
    this.domainsWithoutInformation.add(domain);
    return { msg: `Informaition about ${domain} not found` };
  }
}
