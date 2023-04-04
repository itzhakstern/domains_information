/**
A service that runs scheduled tasks to analyze domains for their information from VirusTotal and Whois.
This service is responsible for updating domains that have not been analyzed for a certain period and analyzing domains in a pending analysis state.
@class
*/
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainAnalysisStatus } from 'src/domains/domain-analysis-status.enum';
import { Domain } from 'src/domains/domain.entity';
import { LessThan, Repository } from 'typeorm';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { DomainInformation } from './domainInformation.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SchedulerService {
  private logger = new Logger('SchedulerService', { timestamp: true });
  constructor(
    @InjectRepository(Domain)
    private domainsRepository: Repository<Domain>,
    private condigService: ConfigService,
  ) {}

  /**
  A scheduled task that analyzes domains that are in a pending analysis state.
  If an analysis is successful, the domain status is updated to done, and the domain information from VirusTotal and Whois is stored in the database.
  */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async anlysisDomainsInPending(): Promise<void> {
    const domainsInPending = await this.domainsRepository.findBy({
      domainAnalysisStatus: DomainAnalysisStatus.PENDING_ANALYSIS,
    });
    this.logger.verbose(
      `Analyzing ${domainsInPending.length} domains in pending`,
    );
    for (const domain of domainsInPending) {
      try {
        const domainInformation = await this.getDomainInformation(
          domain.domain,
        );

        domain.virusTotalInformation =
          domainInformation.informationFromVirusTotal;
        domain.whoisInformation = domainInformation.informationFromWhois;
        domain.securityTrailsInformation =
          domainInformation.informationFromSecurityTrails;
        domain.domainAnalysisStatus = DomainAnalysisStatus.DONE;
        domain.updatedAt = new Date();
        this.domainsRepository.save(domain);
        this.logger.verbose(`Success anlysis domain "${domain.domain}"`);
      } catch (error) {
        this.logger.warn(
          `Failed anlysis for domain "${domain.domain}" in pending status`,
        );
      }
    }
  }

  /**
  A scheduled task that updates domains that have not been analyzed for a certain period.
  If an update is successful, the domain information from VirusTotal and Whois is stored in the database.
  */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async findDomainsToUpdate(): Promise<void> {
    const periodAgo = new Date(
      new Date().getTime() - eval(this.condigService.get('PERIOD_AGO_TO_SCAN')),
    );
    const domainsToUpdate = await this.domainsRepository.find({
      where: {
        updatedAt: LessThan(periodAgo),
      },
    });
    this.logger.verbose(
      `Analyzin ${domainsToUpdate.length} domains that should be updated`,
    );
    for (const domain of domainsToUpdate) {
      try {
        const domainInformation = await this.getDomainInformation(
          domain.domain,
        );

        domain.virusTotalInformation =
          domainInformation.informationFromVirusTotal;
        domain.whoisInformation = domainInformation.informationFromWhois;
        domain.securityTrailsInformation =
          domainInformation.informationFromSecurityTrails;
        domain.updatedAt = new Date();
        this.domainsRepository.save(domain);
        this.logger.verbose(`Success update domain "${domain.domain}"`);
      } catch (error) {
        this.logger.warn(`Failed update domain "${domain.domain}"`);
      }
    }
  }

  /**
  Retrieves information about a domain from VirusTotal API.
  @param {string} domain - The domain name to retrieve information about.
  @returns {Promise<AxiosResponse>} - A promise that resolves with the response from VirusTotal API.
  @throws {Error} - If unable to retrieve information from VirusTotal API.
  */
  async getInformationFromVirusTotal(domain: string): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      headers: {
        'x-apikey': this.condigService.get('VIRUS_TOTAL_API_KEY'),
      },
    };
    try {
      const response = await axios.get(
        `${this.condigService.get('VIRUS_TOTAL_ENDPOINT')}/${domain}`,
        config,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to get information from Virus-Total to domain "${domain}"`,
        error.stack,
      );
    }
  }

  /**
  Retrieves information about a domain from Whois API.
  @param {string} domain - The domain name to retrieve information about.
  @returns {Promise<AxiosResponse>} - A promise that resolves with the response from Whois API.
  @throws {Error} - If unable to retrieve information from Whois API.
  */
  async getInformationFromWhois(domain: string): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      params: {
        apiKey: this.condigService.get('WHOIS_API_KEY'),
        domainName: domain,
        outputFormat: 'JSON',
      },
    };
    try {
      const response = await axios.get(
        `${this.condigService.get('WHOIS_ENDPOINT')}`,
        config,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to get information from Whois to domain "${domain}"`,
        error.stack,
      );
    }
  }

  /**
  Retrieves information about a domain from SecurityTrails API.
  @param {string} domain - The domain name to retrieve information about.
  @returns {Promise<AxiosResponse>} - A promise that resolves with the response from Whois API.
  @throws {Error} - If unable to retrieve information from Whois API.
  */
  async getInformationFromSecurityTrails(
    domain: string,
  ): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      params: {
        apiKey: this.condigService.get('WHOIS_API_KEY'),
        domainName: domain,
        outputFormat: 'JSON',
      },
    };
    try {
      const response = await axios.get(
        `${this.condigService.get('WHOIS_ENDPOINT')}`,
        config,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to get information from Whois to domain "${domain}"`,
        error.stack,
      );
    }
  }

  /**
  Retrieves information about a domain from VirusTotal API and Whois API.
  * @param {string} domain - The domain name to retrieve information about.
  */
  async getDomainInformation(domain: string): Promise<DomainInformation> {
    try {
      const informationFromVirusTotal = await this.getInformationFromVirusTotal(
        domain,
      );
      const informationFromWhois = await this.getInformationFromWhois(domain);
      const informationFromSecurityTrails =
        await this.getInformationFromSecurityTrails(domain);
      return {
        informationFromVirusTotal: informationFromVirusTotal.data,
        informationFromWhois: informationFromWhois.data,
        informationFromSecurityTrails: informationFromSecurityTrails.data,
      };
    } catch (error) {
      console.log(`Failed to get information of domain "${domain}"`);
    }
  }
}
