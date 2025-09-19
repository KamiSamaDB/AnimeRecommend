import axios from 'axios';

const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

// Helper function to check if two titles are related
const areTitlesRelated = (title1, title2) => {
  if (!title1 || !title2) return false;
  
  // Convert both titles to lowercase for comparison
  const t1 = title1.toLowerCase();
  const t2 = title2.toLowerCase();
  
  // Direct inclusion check
  if (t1.includes(t2) || t2.includes(t1)) return true;
  
  // Check for common patterns in anime titles
  const cleanTitle1 = t1.replace(/\s+/g, ' ')
                       .replace(/:.*$/, '')
                       .replace(/\(.*\)/, '')
                       .replace(/season \d+/, '')
                       .replace(/part \d+/, '')
                       .replace(/\d+(st|nd|rd|th) season/, '')
                       .trim();
                       
  const cleanTitle2 = t2.replace(/\s+/g, ' ')
                       .replace(/:.*$/, '')
                       .replace(/\(.*\)/, '')
                       .replace(/season \d+/, '')
                       .replace(/part \d+/, '')
                       .replace(/\d+(st|nd|rd|th) season/, '')
                       .trim();
  
  return cleanTitle1 === cleanTitle2;
};

// Helper function to calculate genre similarity
const calculateGenreSimilarity = (genres1, genres2) => {
  if (!genres1 || !genres2) return 0;
  const set1 = new Set(genres1.map(g => g.name));
  const set2 = new Set(genres2.map(g => g.name));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
};

// Helper function to calculate theme similarity
const calculateThemeSimilarity = (themes1, themes2) => {
  if (!themes1 || !themes2) return 0;
  const set1 = new Set(themes1.map(t => t.name));
  const set2 = new Set(themes2.map(t => t.name));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
};

// Helper function to calculate demographic similarity
const calculateDemographicSimilarity = (demographics1, demographics2) => {
  if (!demographics1 || !demographics2) return 0;
  return demographics1.some(d1 => 
    demographics2.some(d2 => d1.name === d2.name)
  ) ? 1 : 0;
};

// Find all input anime and analyze their genres
export const findOriginalAnime = async (queries) => {
  try {
    // Ensure queries is an array
    const searchQueries = Array.isArray(queries) ? queries : [queries];
    
    // Search for all input anime with delay between requests
    const foundAnime = [];
    for (const query of searchQueries) {
      try {
        // Add delay between requests to respect API rate limits
        if (foundAnime.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const response = await axios.get(`${JIKAN_API_BASE_URL}/anime`, {
          params: {
            q: query,
            limit: 5,
            sfw: true
          }
        });
        
        // Find the best match for this query
        const results = response.data.data;
        const bestMatch = results.find(anime => {
          const titles = [
            anime.title,
            anime.title_english,
            anime.title_japanese,
            ...(anime.title_synonyms || [])
          ].filter(Boolean);
          
          return titles.some(title => areTitlesRelated(title, query));
        });

        if (bestMatch) {
          console.log(`Found match for "${query}":`, bestMatch.title);
          foundAnime.push(bestMatch);
        } else {
          console.log(`No exact match found for "${query}", searching for similar titles...`);
          // Try to find a more flexible match
          const similarMatch = results.find(anime => {
            const titles = [
              anime.title,
              anime.title_english,
              anime.title_japanese,
              ...(anime.title_synonyms || [])
            ].filter(Boolean);
            
            // More lenient matching for similar titles
            return titles.some(title => 
              title.toLowerCase().includes(query.toLowerCase()) ||
              query.toLowerCase().includes(title.toLowerCase())
            );
          });
          
          if (similarMatch) {
            console.log(`Found similar match for "${query}":`, similarMatch.title);
            foundAnime.push(similarMatch);
          } else {
            console.log(`No match found for "${query}"`);
          }
        }
      } catch (err) {
        console.error(`Error searching for "${query}":`, err);
        // Continue with other queries even if one fails
      }
    }
    
    if (foundAnime.length === 0) {
      return null;
    }

    // Count genre frequencies and collect genre information
    const genreFrequency = new Map();
    
    foundAnime.forEach(anime => {
      if (anime && Array.isArray(anime.genres)) {
        anime.genres.forEach(genre => {
          if (genre && genre.mal_id) {
            const count = genreFrequency.get(genre.mal_id) || 0;
            genreFrequency.set(genre.mal_id, count + 1);
          }
        });
      }
    });

    // Create a map of all genre information
    const genreInfoMap = new Map();
    foundAnime.forEach(anime => {
      (anime.genres || []).forEach(genre => {
        if (!genreInfoMap.has(genre.mal_id)) {
          genreInfoMap.set(genre.mal_id, genre);
        }
      });
    });

    // Sort genres by frequency and create genre metadata
    const sortedGenres = [...genreFrequency.entries()]
      .map(([genreId, frequency]) => {
        const genreInfo = genreInfoMap.get(genreId);
        return {
          mal_id: genreId,
          name: genreInfo.name,
          type: genreInfo.type,
          frequency,
          percentage: (frequency / foundAnime.length) * 100
        };
      })
      .sort((a, b) => {
        // Sort by frequency first
        const freqDiff = b.frequency - a.frequency;
        if (freqDiff !== 0) return freqDiff;
        
        // If frequencies are equal, sort by genre name
        return a.name.localeCompare(b.name);
      });

    // Return with analyzed genre data
    return {
      inputAnime: foundAnime,
      genreAnalysis: sortedGenres,
      excludeIds: foundAnime.map(a => a.mal_id)
    };
  } catch (error) {
    console.error('Error finding original anime:', error);
    throw error;
  }
};

// Calculate comprehensive score for an anime
const calculateAnimeScore = (anime, genreFrequency, totalInputs) => {
  // Base score from rating (0-50 points)
  const ratingScore = (anime.score || 0) * 5;

  // Popularity score (0-30 points)
  // Using log scale to balance between very popular and moderately popular anime
  const popularityScore = Math.min(
    30,
    (Math.log10(anime.members || 0) - 3) * 10
  );

  // Genre relevance score (0-20 points)
  // How common this genre is in the input anime
  const genreRelevance = (genreFrequency / totalInputs) * 20;

  // Completion bonus (0-5 points)
  const completionBonus = anime.status === "Completed" ? 5 : 0;

  // Recent anime bonus (0-5 points)
  const currentYear = new Date().getFullYear();
  const animeYear = new Date(anime.aired?.from).getFullYear() || 0;
  const recentBonus = Math.max(0, 5 - (currentYear - animeYear));

  return {
    total: ratingScore + popularityScore + genreRelevance + completionBonus + recentBonus,
    breakdown: {
      rating: ratingScore,
      popularity: popularityScore,
      genreRelevance: genreRelevance,
      completion: completionBonus,
      recency: recentBonus
    }
  };
};

// Get top anime for a specific genre
const getTopAnimeForGenre = async (genre, excludeIds, totalInputs) => {
  if (!genre || !genre.mal_id || !genre.name) {
    console.error('Invalid genre object:', genre);
    return [];
  }

  try {
    console.log(`Fetching recommendations for genre: ${genre.name}`);
    // Get a larger pool to filter from
    const response = await axios.get(`${JIKAN_API_BASE_URL}/anime`, {
      params: {
        genres: genre.mal_id,
        limit: 15,
        sfw: true,
        order_by: 'score',
        sort: 'desc'
      }
    });

    // Filter and score the anime
    const scoredAnime = response.data.data
      .filter(anime => !excludeIds.includes(anime.mal_id))
      .map(anime => {
        const score = calculateAnimeScore(anime, genre.frequency, totalInputs);
        return {
          ...anime,
          recommendationScore: score.total,
          scoreBreakdown: score.breakdown,
          matchReason: `${genre.name} (${genre.frequency}/${totalInputs} of your anime)`
        };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 3); // Take top 3 for this genre

    return scoredAnime;
  } catch (error) {
    console.error(`Error getting anime for genre ${genre.name}:`, error);
    return [];
  }
};

// Get recommendations based on genre frequency analysis
export const getRecommendations = async (animeData) => {
  if (!animeData || !animeData.genreAnalysis || !Array.isArray(animeData.genreAnalysis) || 
      animeData.genreAnalysis.length === 0 || !animeData.inputAnime || !Array.isArray(animeData.inputAnime)) {
    console.log('Invalid or missing anime data:', animeData);
    return [];
  }
  
  try {
    const { genreAnalysis, excludeIds, inputAnime } = animeData;
    const totalInputs = inputAnime.length;
    
    // Process genres in order of frequency
    const recommendations = [];
    const addedAnimeIds = new Set(excludeIds);
    
    // Process each genre sequentially to maintain genre diversity and respect API rate limits
    for (const genre of genreAnalysis) {
      // Skip genres that appear in less than 25% of inputs
      if ((genre.frequency / totalInputs) < 0.25) continue;
      
      // Add delay between genre requests to respect API rate limits
      if (recommendations.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const genreRecommendations = await getTopAnimeForGenre(genre, Array.from(addedAnimeIds), totalInputs);
      console.log(`Found ${genreRecommendations.length} recommendations for genre ${genre.name}`);
      
      // Add new recommendations, avoiding duplicates
      for (const anime of genreRecommendations) {
        if (!addedAnimeIds.has(anime.mal_id)) {
          recommendations.push(anime);
          addedAnimeIds.add(anime.mal_id);
          console.log(`Added recommendation: ${anime.title} (${genre.name})`);
          
          // Stop if we've reached 10 total recommendations
          if (recommendations.length >= 10) break;
        }
      }
      
      // Stop if we've reached 10 total recommendations
      if (recommendations.length >= 10) {
        console.log('Reached maximum number of recommendations (10)');
        break;
      }
    }

    // Sort final recommendations by score
    return recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

export const getAnimeDetails = async (malId) => {
  try {
    const response = await axios.get(`${JIKAN_API_BASE_URL}/anime/${malId}/full`);
    return response.data.data;
  } catch (error) {
    console.error('Error getting anime details:', error);
    throw error;
  }
};

// Helper function to calculate recommendation score using MAL data
export const calculateRecommendationScore = (anime) => {
  let score = 0;
  
  // Base score from MAL rating (weighted heavily as it's the main quality indicator)
  score += (anime.score || 0) * 15;
  
  // Popularity bonus based on number of members
  score += Math.min(anime.members / 100000, 25);
  
  // Scoring frequency bonus (how many people rated it)
  score += Math.min(anime.scored_by / 10000, 15);
  
  // Recent anime bonus (within last 2 years)
  const currentYear = new Date().getFullYear();
  const animeYear = new Date(anime.aired?.from).getFullYear();
  if (currentYear - animeYear <= 2) {
    score += 10;
  }
  
  // Status bonus (favor completed series)
  if (anime.status === "Completed") {
    score += 5;
  }
  
  // Favorites bonus (shows that are often marked as favorites)
  score += Math.min(anime.favorites / 10000, 15);
  
  // Rank bonus (if the anime is highly ranked on MAL)
  if (anime.rank) {
    score += Math.max(0, (1000 - anime.rank) / 50);
  }
  
  return score;
};