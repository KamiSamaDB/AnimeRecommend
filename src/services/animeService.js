const API_BASE_URL = ''; // keep empty to use same domain (via Nginx proxy)

// Fallback function to get anime details from Jikan API using MAL ID
const getAnimeDetailsFromJikan = async (malId) => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to fetch details for MAL ID ${malId}:`, error);
    return null;
  }
};

// Main function to get recommendations from Flask backend
const getRecommendations = async (userAnimeList) => {
  try {
    console.log('🚀 Calling Flask API with:', userAnimeList);

    const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        anime_titles: userAnimeList, // ✅ match backend schema
        max_recommendations: 10
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const flaskData = await response.json();
    console.log('📥 Flask API response:', flaskData);

    const recommendations = flaskData.recommendations || [];

    if (!Array.isArray(recommendations)) {
      console.error('Flask API did not return an array:', flaskData);
      return [];
    }

    console.log(`📊 Flask API returned ${recommendations.length} recommendations`);

    // Enhance each recommendation with image and metadata
    const enhancedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        const imageUrl =
          rec.image_url || 'https://via.placeholder.com/300x400/1a1a2e/ff61d8?text=No+Image';
        const largeImageUrl = rec.large_image_url || imageUrl;

        return {
          mal_id: rec.mal_id,
          title: rec.title,
          title_english: rec.title_english || rec.title,
          title_japanese: rec.title_japanese || null,
          title_synonyms: rec.title_synonyms || [],
          images: {
            jpg: {
              image_url: imageUrl,
              large_image_url: largeImageUrl
            }
          },
          score: rec.score,
          rank: rec.rank,
          popularity: rec.popularity,
          members: rec.members,
          synopsis: rec.synopsis || `Recommended based on your interest in ${userAnimeList.join(', ')}.`,
          episodes: rec.episodes,
          status: rec.status || 'Unknown',
          year: rec.year,
          season: rec.season || null,
          type: rec.type || 'TV',
          rating: rec.rating,
          source: rec.source,
          aired: rec.aired,
          duration: rec.duration,
          genres: (rec.genres || []).map((g) =>
            typeof g === 'string'
              ? { mal_id: g.toLowerCase().replace(/\s+/g, '-'), name: g, type: 'genre' }
              : g
          ),
          studios: (rec.studios || []).map((s) =>
            typeof s === 'string' ? { name: s } : s
          ),
          url: rec.url || (rec.mal_id ? `https://myanimelist.net/anime/${rec.mal_id}` : null),
          recommendationSource: 'flask',
          matchReason: rec.reason || 'ML Recommended',
          flaskData: {
            confidence_score: rec.confidence_score || null,
            similarity_score: rec.similarity_score,
            reasons: rec.reasons || [rec.reason].filter(Boolean),
            note: flaskData.note || null
          }
        };
      })
    );

    console.log(`✅ Successfully processed ${enhancedRecommendations.length} recommendations`);
    return enhancedRecommendations;
  } catch (error) {
    console.error('❌ Flask API error:', error);
    throw new Error(`Failed to get recommendations: ${error.message}`);
  }
};

// Export functions
export { getRecommendations };

export const searchAnime = async (query) => {
  const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
  return await response.json();
};
