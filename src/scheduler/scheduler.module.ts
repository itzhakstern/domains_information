/**
 * The scheduler module is responsible for scheduling background tasks related to domain information.
 * It provides the `SchedulerService` which can be used to schedule domain information retrieval.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from 'src/domains/domain.entity';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [
    /**
     * Imports the `TypeOrmModule` which provides the database connection for the module.
     * Also imports the `ConfigModule` which loads configuration values from environment variables.
     */
    TypeOrmModule.forFeature([Domain]),
    ConfigModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
