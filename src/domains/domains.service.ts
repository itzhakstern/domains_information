import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DomainAnalysisStatus } from './domain-analysis-status.enum';
import { Domain } from './domain.entity';
import { DomainDto } from './dto/domain.dto';
import { GetDomainInformationDto } from './dto/get-domain-information.dto';

/**
 * The DomainsService provides methods to handle domain-related operations,
 * such as adding a new domain to the database, retrieving domain information,
 */
@Injectable()
export class DomainsService {
  /**
   * Creates an instance of DomainsService.
   * @param domainsRepository A repository to handle domain entity operations with the database.
   */
  constructor(
    @InjectRepository(Domain)
    private domainsRepository: Repository<Domain>,
  ) {}

  /**
   * Creates a new domain object with the given domain name and default values for the virusTotalInformation, whoisInformation, securityTrailsInformation, and domainAnalysisStatus fields.
   */
  createDomainObject(domain: string) {
    return this.domainsRepository.create({
      domain,
      updatedAt: new Date(),
      virusTotalInformation: null,
      whoisInformation: null,
      securityTrailsInformation: null,
      domainAnalysisStatus: DomainAnalysisStatus.PENDING_ANALYSIS,
    });
  }

  /**
   * Retrieves the domain information for the given domain object.
   * @param domainDto A DTO object that contains the domain to retrieve the information from.
   * @returns An object containing the domain information, or a message if the information is not available yet.
   */
  async getInformationByDomain(
    domainDto: DomainDto,
  ): Promise<GetDomainInformationDto | { msg: string }> {
    const domain = domainDto.domain;
    const domainObject = await this.domainsRepository.findOneBy({
      domain: domain,
    });
    if (!domainObject) {
      const createDomainObject = this.createDomainObject(domain);
      await this.domainsRepository.save(createDomainObject);
      return {
        msg: `There is no information about the domain ${domain} yet. Please check back later`,
      };
    }
    if (
      domainObject.domainAnalysisStatus == DomainAnalysisStatus.PENDING_ANALYSIS
    ) {
      return {
        msg: `There is no information about the domain "${domain}" yet. Please check back later`,
      };
    }
    return {
      domain: domainObject.domain,
      virusTotalInformation: domainObject.virusTotalInformation,
      whoisInformation: domainObject.whoisInformation,
      securityTrailsInformation: domainObject.securityTrailsInformation,
      updatedAt: domainObject.updatedAt,
    };
  }

  /**
   * Adds a new domain to the database or updates the analysis status of an existing domain.
   * @param domainDto A DTO object that contains the domain to add or update.
   */
  async addDomain(domainDto: DomainDto): Promise<void> {
    const domain = domainDto.domain;
    let domainObject = await this.domainsRepository.findOneBy({
      domain: domain,
    });
    if (domainObject) {
      domainObject.domainAnalysisStatus = DomainAnalysisStatus.PENDING_ANALYSIS;
    } else {
      domainObject = this.createDomainObject(domain);
    }
    await this.domainsRepository.save(domainObject);
  }
}
