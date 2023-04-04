import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { DomainAnalysisStatus } from './domain-analysis-status.enum';

/**
 * The `Domain` entity represents a domain with information about its analysis status and related information.
 */
@Entity()
export class Domain {
  /**
   * The unique identifier for the domain.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The domain name.
   */
  @Column()
  @Index()
  domain: string;

  /**
   * The VirusTotal analysis information for the domain.
   */
  @Column('json', { nullable: true })
  virusTotalInformation: object;

  /**
   * The WHOIS information for the domain.
   */
  @Column('json', { nullable: true })
  whoisInformation: object;

  /**
   * The WHOIS information for the domain.
   */
  @Column('json', { nullable: true })
  securityTrailsInformation: object;

  /**
   * The timestamp when the domain information was last updated.
   */
  @Column()
  @Index()
  updatedAt: Date;

  /**
   * The analysis status of the domain.
   */
  @Column()
  @Index()
  domainAnalysisStatus: DomainAnalysisStatus;
}
