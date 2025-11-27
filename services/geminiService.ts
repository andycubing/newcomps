import { GoogleGenAI } from "@google/genai";
import { WCACompetition, COUNTRY_NAMES } from '../types';

// Initialize Gemini
// NOTE: We assume process.env.API_KEY is available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTravelGuide = async (competition: WCACompetition): Promise<string> => {
  const model = "gemini-2.5-flash";
  const countryName = COUNTRY_NAMES[competition.country_iso2] || competition.country_iso2;
  
  const prompt = `
    I am a speedcuber planning to attend a WCA competition called "${competition.name}" 
    in ${competition.city}, ${countryName}. 
    The competition is from ${competition.start_date} to ${competition.end_date}.
    
    Please provide a concise travel guide (max 200 words) formatted in Markdown. 
    Include:
    1. A fun fact about the city.
    2. Weather expectations for that time of year.
    3. One "Must-Eat" local food recommendation.
    4. A quick tip for getting around.
    
    Keep the tone excited and helpful for a traveler.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "Sorry, I couldn't generate a travel guide at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to load AI travel insights. Please check your API configuration.";
  }
};

export const getCompetitionAnalysis = async (competitions: WCACompetition[]): Promise<string> => {
    if (competitions.length === 0) return "";

    const model = "gemini-2.5-flash";
    const summaryData = competitions.slice(0, 30).map(c => `${c.name} in ${c.city} (${c.country_iso2}) on ${c.start_date}`).join('\n');

    const prompt = `
      Analyze this list of upcoming speedcubing competitions in Asia:
      ${summaryData}

      Provide a 2-sentence summary highlighting which country seems to be the busiest for upcoming events and if there are any notable trends in dates (e.g. many in summer).
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text || "";
    } catch (error) {
        return "";
    }
}
