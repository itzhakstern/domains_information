export class GetDomainInformationDto {
  domain: string;
  virusTotalInformation: object;
  whoisInformation: object;
  securityTrailsInformation: object;
  updatedAt: Date;
}
