import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { DomainAnalysisStatus } from './domain-analysis-status.enum';

@Entity()
export class Domain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  domain: string;

  @Column('json')
  virusTotalInformation: object;

  @Column('json')
  wolesInformation: object;

  @Column()
  @Index({ unique: true })
  updatedAt: Date;

  @Column()
  @Index({ unique: true })
  domainAnalysisStatus: DomainAnalysisStatus;
}
