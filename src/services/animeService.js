import axios from 'axios';

const FLASK_API_BASE_URL = process.env.REACT_APP_FLASK_API_URL || 'http://127.0.0.1:5000';

// Get recommendations from Flask API and use the detailed data it provides
export const getRecommendations = async (userAnime) => {
  try {
    console.log('🚀 Starting getRecommendations with:', userAnime);
    console.log('🌐 Flask API URL:', FLASK_API_BASE_URL);
    
    const requestData = {
      anime_titles: userAnime,
      max_recommendations: 10,
      min_score: 7.0
    };
    
    console.log('📤 Request data:', requestData);
    
    // Call Flask recommendation API
    const flaskResponse = await axios.post(`${FLASK_API_BASE_URL}/api/recommendations`, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Flask API response status:', flaskResponse.status);
    console.log('📥 Flask API response data:', flaskResponse.data);
    
    // Your Flask API returns complete anime objects with all details
    const recommendations = flaskResponse.data.recommendations || [];
    
    console.log(`📊 Found ${recommendations.length} recommendations`);
    
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      console.warn('⚠️ No recommendations received from Flask API');
      console.log('Full response:', flaskResponse.data);
      return [];
    }
    
    // Transform Flask API data to match the expected format for React components
    const transformedRecommendations = recommendations.map((rec, index) => {
      console.log(`🔄 Transforming recommendation ${index + 1}:`, rec.title);
      
      return {
        mal_id: rec.mal_id,
        title: rec.title,
        title_english: rec.title_english || rec.title,
        title_japanese: rec.title_japanese || null,
        title_synonyms: rec.title_synonyms || [],
        images: {
          jpg: {
            image_url: rec.image_url,
            large_image_url: rec.image_url
          }
        },
        score: rec.score,
        scored_by: rec.popularity ? Math.max(1000, (1000 - rec.popularity) * 50) : 1000, // Estimate based on popularity rank
        rank: rec.popularity,
        popularity: rec.popularity,
        members: null, // Not provided by your Flask API
        favorites: null, // Not provided by your Flask API
        synopsis: rec.synopsis,
        episodes: rec.episodes,
        status: "Completed", // Default assumption
        year: rec.year,
        season: null, // Not provided by your Flask API
        type: "TV", // Default assumption
        genres: (rec.genres || []).map(genreName => ({
          mal_id: genreName.toLowerCase().replace(/\s+/g, '-'), // Generate a simple ID
          name: genreName,
          type: "genre"
        })),
        studios: [], // Not provided by your Flask API
        url: rec.url,
        // Add Flask-specific data
        recommendationSource: 'flask',
        matchReason: `ML Recommended (${rec.confidence_score || 1.0} confidence)`,
        flaskData: {
          confidence_score: rec.confidence_score,
          similarity_score: rec.similarity_score,
          reasons: rec.reasons || []
        }
      };
    });
    
    console.log(`✨ Successfully processed ${transformedRecommendations.length} recommendations from Flask API`);
    return transformedRecommendations;
    
  } catch (error) {
    console.error('❌ Error getting Flask recommendations:', error);
    
    // Log more details about the error
    if (error.response) {
      console.error('🔴 Flask API response error:', error.response.data);
      console.error('🔴 Flask API response status:', error.response.status);
      console.error('🔴 Flask API response headers:', error.response.headers);
    } else if (error.request) {
      console.error('🔴 Network error - no response received:', error.request);
    } else {
      console.error('🔴 Request setup error:', error.message);
    }
    
    throw new Error(`Flask recommendation API error: ${error.message}`);
  }
};

// Keep these functions for potential future use but don't use them in the main flow
export const searchAnimeByTitle = async (title) => {
  console.warn('searchAnimeByTitle is deprecated - using Flask API instead');
  return [];
};

export const getAnimeDetails = async (malId) => {
  console.warn('getAnimeDetails is deprecated - using Flask API instead');
  return null;
};

export const getAnimeDetailsByTitles = async (titles) => {
  console.warn('getAnimeDetailsByTitles is deprecated - using Flask API instead');
  return [];
};