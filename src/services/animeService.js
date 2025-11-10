const API_BASE_URL = '';

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

// This will now work without CORS errors
const getRecommendations = async (userAnimeList) => {
  try {
    console.log('🚀 Calling Flask API with:', userAnimeList);
    
    const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_anime_list: userAnimeList,
        max_recommendations: 10
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const flaskData = await response.json();
    console.log('📥 Flask API response:', flaskData);
    
    // Handle the Flask API response structure
    const recommendations = flaskData.recommendations || [];
    
    if (!Array.isArray(recommendations)) {
      console.error('Flask API did not return an array:', flaskData);
      return [];
    }
    
    console.log(`📊 Flask API returned ${recommendations.length} recommendations`);
    
    // Transform and enhance each recommendation
    const enhancedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        console.log(`🔄 Processing recommendation: ${rec.title} (MAL ID: ${rec.mal_id})`);
        console.log(`🖼️ Flask provided image URL: ${rec.image_url || 'None'}`);
        console.log(`� Flask provided members: ${rec.members || 'None'}`);
        
        // With the new Flask API providing comprehensive data, we rarely need Jikan
        let jikanData = null;
        
        // Use Flask image URL if available, otherwise use placeholder
        const imageUrl = rec.image_url || 'https://via.placeholder.com/300x400/1a1a2e/ff61d8?text=No+Image';
        const largeImageUrl = rec.large_image_url || imageUrl;
        
        console.log(`✅ Final image URLs for ${rec.title}:`);
        console.log(`   📸 Standard: ${imageUrl}`);
        console.log(`   📸 Large: ${largeImageUrl}`);
        
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
          scored_by: rec.scored_by,
          rank: rec.rank,
          popularity: rec.popularity,
          members: rec.members,
          favorites: rec.favorites,
          synopsis: rec.synopsis || `Recommended based on your interest in ${userAnimeList.join(', ')}.`,
          episodes: rec.episodes,
          status: rec.status || "Unknown",
          year: rec.year,
          season: rec.season || null,
          type: rec.type || "TV",
          rating: rec.rating, // Age rating (e.g., "PG-13 - Teens 13 or older")
          source: rec.source, // Source material (e.g., "Manga")
          aired: rec.aired, // Aired dates
          duration: rec.duration, // Episode duration
          genres: (rec.genres || []).map(genre => {
            if (typeof genre === 'string') {
              return {
                mal_id: genre.toLowerCase().replace(/\s+/g, '-'),
                name: genre,
                type: "genre"
              };
            }
            return genre;
          }),
          studios: (rec.studios || []).map(studio => {
            if (typeof studio === 'string') {
              return { name: studio };
            }
            return studio;
          }),
          url: rec.url || (rec.mal_id ? `https://myanimelist.net/anime/${rec.mal_id}` : null),
          // Flask-specific data
          recommendationSource: 'flask',
          matchReason: rec.reason || `ML Recommended`,
          flaskData: {
            confidence_score: rec.confidence_score || null,
            similarity_score: rec.similarity_score,
            reasons: rec.reasons || [rec.reason].filter(Boolean),
            note: flaskData.note || null
          }
        };
      })
    );
    
    console.log(`✅ Successfully processed ${enhancedRecommendations.length} enhanced recommendations`);
    
    // If we only got test data, add a notice
    if (flaskData.note && flaskData.note.includes('test response')) {
      console.log('⚠️ Received test response from Flask API');
    }
    
    return enhancedRecommendations;
    
  } catch (error) {
    console.error('❌ Flask API error:', error);
    throw new Error(`Failed to get recommendations: ${error.message}`);
  }
};

// Export the function
export { getRecommendations };

// Search function to find anime
export const searchAnime = async (query) => {
  const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
  return await response.json();
};
