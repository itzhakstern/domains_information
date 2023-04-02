import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from 'src/domains/domain.entity';
import { SchdulerService } from './schduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([Domain]), HttpModule],
  providers: [SchdulerService],
})
export class SchdulerModule {}
