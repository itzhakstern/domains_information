import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './domain.entity';
import { DomainsController } from './domains.controller';
import { DomainsService } from './domains.service';

/**
 * A module that provides functionality related to managing domains.
 * This module imports the TypeOrmModule to provide a connection to a database,
 * and exports the DomainsService to be used by other modules in the application.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Domain])],
  controllers: [DomainsController],
  providers: [DomainsService],
})
export class DomainsModule {}
