import { WCACompetition, CountryCode } from '../types';

const BASE_URL = 'https://www.worldcubeassociation.org/api/v0/competitions';

// Helper to get today's date in YYYY-MM-DD
const getTodayDate = (): string => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const fetchUpcomingCompetitions = async (): Promise<WCACompetition[]> => {
  const today = getTodayDate();
  const countries = Object.values(CountryCode);
  
  // WCA API allows filtering by country_iso2. 
  // To avoid hitting rate limits or complex pagination for all Asia, 
  // we fetch specific countries we are interested in.
  // We'll use Promise.all to fetch them in parallel.
  
  try {
    const promises = countries.map(async (code) => {
      // Fetch competitions starting after today
      const url = `${BASE_URL}?country_iso2=${code}&start=${today}&sort=start_date`;
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to fetch for ${code}`);
        return [];
      }
      const data = await response.json();
      return data as WCACompetition[];
    });

    const results = await Promise.all(promises);
    // Flatten array
    return results.flat().sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return [];
  }
};
