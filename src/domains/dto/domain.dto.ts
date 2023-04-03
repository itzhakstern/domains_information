import { IsFQDN, IsNotEmpty } from 'class-validator';

export class DomainDto {
  @IsNotEmpty()
  @IsFQDN()
  domain: string;
}
