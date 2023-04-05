import { AxiosResponse } from 'axios';

/**
 * Represents information retrieved from VirusTotal, Whois and SecurityTrails services for a domain.
 */
export interface DomainInformation {
  /**
   * Information about the domain retrieved from VirusTotal.
   */
  informationFromVirusTotal: Promise<AxiosResponse>;
  /**
   * Information about the domain retrieved from Whois.
   */
  informationFromWhois: Promise<AxiosResponse>;
  /**
   * Information about the domain retrieved from SecurityTrails.
   */
  informationFromSecurityTrails: Promise<AxiosResponse>;
}
