import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DomainAnalysisStatus } from './domain-analysis-status.enum';
import { Domain } from './domain.entity';
import { DomainDto } from './dto/domain.dto';

@Injectable()
export class DomainsService {
  constructor(
    @InjectRepository(Domain)
    private domainsRepository: Repository<Domain>,
  ) {}

  async getInformationByDomain(domainDto: DomainDto): Promise<Domain> {
    const domain = domainDto.domain;
    const found = await this.domainsRepository.findOneBy({ domain: domain });
    console.log(found);
    if (!found) {
      this.addDomain(domainDto);
      throw new NotFoundException(`Domain "${domain}" not found`);
    }
    if (found.domainAnalysisStatus == DomainAnalysisStatus.PENDING_ANALYSIS) {
      throw new InternalServerErrorException({
        msg: `the domain "${domain} until not alalysis`,
      });
    }
    return found;
  }

  async addDomain(domainDto: DomainDto): Promise<Domain> {
    const domain = domainDto.domain;
    try {
      const newDomainObject = this.domainsRepository.create({
        domain,
        updatedAt: new Date(),
        virusTotalInformation: {},
        wolesInformation: {},
        domainAnalysisStatus: DomainAnalysisStatus.PENDING_ANALYSIS,
      });
      await this.domainsRepository.save(newDomainObject);
      return newDomainObject;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
