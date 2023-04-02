import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainsModule } from './domains/domains.module';
import { SchdulerModule } from './schduler/schduler.module';

@Module({
  imports: [
    DomainsModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3002,
      username: 'postgres',
      password: 'postgres',
      database: 'domain-information',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SchdulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
