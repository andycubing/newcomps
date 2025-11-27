export interface WCADelegate {
  name: string;
  email: string;
}

export interface WCAOrganizer {
  name: string;
  email: string;
}

export interface WCACity {
  name: string;
  // Some endpoints return coordinates inside city, others at root
}

export interface WCACompetition {
  id: string;
  name: string;
  city: string;
  country_iso2: string;
  start_date: string;
  end_date: string;
  event_ids: string[];
  organizer: WCAOrganizer;
  url: string;
  website: string;
  short_name?: string;
  venue_address?: string;
  venue_details?: string;
  latitude?: number;
  longitude?: number;
}

export enum CountryCode {
  CN = 'CN',
  TW = 'TW',
  HK = 'HK',
  MO = 'MO',
  JP = 'JP',
  KR = 'KR',
  SG = 'SG',
  MY = 'MY',
  VN = 'VN',
  TH = 'TH'
}

export const COUNTRY_NAMES: Record<string, string> = {
  [CountryCode.CN]: 'China',
  [CountryCode.TW]: 'Chinese Taipei',
  [CountryCode.HK]: 'Hong Kong',
  [CountryCode.MO]: 'Macau',
  [CountryCode.JP]: 'Japan',
  [CountryCode.KR]: 'Korea',
  [CountryCode.SG]: 'Singapore',
  [CountryCode.MY]: 'Malaysia',
  [CountryCode.VN]: 'Vietnam',
  [CountryCode.TH]: 'Thailand',
};

export const COUNTRY_EMOJIS: Record<string, string> = {
  [CountryCode.CN]: '🇨🇳',
  [CountryCode.TW]: '🇹🇼',
  [CountryCode.HK]: '🇭🇰',
  [CountryCode.MO]: '🇲🇴',
  [CountryCode.JP]: '🇯🇵',
  [CountryCode.KR]: '🇰🇷',
  [CountryCode.SG]: '🇸🇬',
  [CountryCode.MY]: '🇲🇾',
  [CountryCode.VN]: '🇻🇳',
  [CountryCode.TH]: '🇹🇭',
};
