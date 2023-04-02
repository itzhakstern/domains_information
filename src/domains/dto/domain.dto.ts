import { IsNotEmpty, IsUrl } from 'class-validator';

export class DomainDto {
  @IsUrl()
  @IsNotEmpty()
  domain: string;
}
