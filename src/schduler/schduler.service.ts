import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainAnalysisStatus } from 'src/domains/domain-analysis-status.enum';
import { Domain } from 'src/domains/domain.entity';
import { LessThan, Repository } from 'typeorm';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class SchdulerService {
  constructor(
    @InjectRepository(Domain)
    private domainsRepository: Repository<Domain>,
    private readonly httpService: HttpService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async anlysisDomainsInPending() {
    const domainsInPending = await this.domainsRepository.findBy({
      domainAnalysisStatus: DomainAnalysisStatus.PENDING_ANALYSIS,
    });
    for (const domain of domainsInPending) {
      const config: AxiosRequestConfig = {
        headers: {
          'x-apikey':
            'cdddb09dda0a7e1f6e8de2d507edddef7487a4b544ee635b13fcbbafd47875c3',
        },
      };
      const response = await axios.get(
        `https://www.virustotal.com/api/v3/domains/${domain.domain}`,
        config,
      );

      domain.virusTotalInformation = response.data;
      domain.domainAnalysisStatus = DomainAnalysisStatus.DONE;
      domain.updatedAt = new Date();
      this.domainsRepository.save(domain);
    }

    console.log('Called every 30 seconds');
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async findDomainsToUpdate(): Promise<Domain[]> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const domains = await this.domainsRepository.find({
      where: {
        updatedAt: LessThan(oneMonthAgo),
      },
    });
    console.log(domains);
    for (const domain of domains) {
      const config: AxiosRequestConfig = {
        headers: {
          'x-apikey':
            'cdddb09dda0a7e1f6e8de2d507edddef7487a4b544ee635b13fcbbafd47875c3',
        },
      };
      const response = await axios.get(
        `https://www.virustotal.com/api/v3/domains/${domain.domain}`,
        config,
      );

      domain.virusTotalInformation = response.data;
      domain.updatedAt = new Date();
      this.domainsRepository.save(domain);
    }
    return domains;
  }
}
