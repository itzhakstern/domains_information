import { IsNotEmpty, IsUrl } from 'class-validator';

export class GetInformationDto {
  @IsUrl()
  @IsNotEmpty()
  domain: string;
}
