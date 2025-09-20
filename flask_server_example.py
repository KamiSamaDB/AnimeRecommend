#!/usr/bin/env python3
"""
Sample Flask Recommendation API Server
This is a demonstration server showing the expected API contract for the anime recommendation system.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for React app

# Sample anime database for demonstration
SAMPLE_ANIME_RECOMMENDATIONS = [
    "Demon Slayer: Kimetsu no Yaiba",
    "Jujutsu Kaisen",
    "My Hero Academia",
    "Attack on Titan",
    "One Piece",
    "Death Note",
    "Fullmetal Alchemist: Brotherhood",
    "Dragon Ball Z",
    "Naruto Shippuden",
    "Hunter x Hunter",
    "Mob Psycho 100",
    "One Punch Man",
    "Tokyo Ghoul",
    "Code Geass",
    "Steins;Gate",
    "Cowboy Bebop",
    "Studio Ghibli Collection",
    "Your Name",
    "Spirited Away",
    "Princess Mononoke"
]

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """
    Get anime recommendations based on input anime list
    
    Expected request format:
    {
        "anime_titles": ["Attack on Titan", "Death Note"],
        "max_recommendations": 10,
        "min_score": 7.0
    }
    
    Response format:
    {
        "recommendations": ["Demon Slayer", "Jujutsu Kaisen", "My Hero Academia"]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'anime_titles' not in data:
            return jsonify({
                'error': 'Missing anime_titles in request body'
            }), 400
        
        user_anime = data['anime_titles']
        max_recommendations = data.get('max_recommendations', 10)
        min_score = data.get('min_score', 7.0)
        
        if not isinstance(user_anime, list) or len(user_anime) == 0:
            return jsonify({
                'error': 'anime_titles must be a non-empty array'
            }), 400
        
        # Simple recommendation logic (in real implementation, this would be your ML model)
        # For demonstration, we'll return random recommendations
        num_recommendations = min(max_recommendations, len(SAMPLE_ANIME_RECOMMENDATIONS))
        recommendations = random.sample(SAMPLE_ANIME_RECOMMENDATIONS, num_recommendations)
        
        # Filter out any anime that the user already mentioned
        user_anime_lower = [anime.lower() for anime in user_anime]
        filtered_recommendations = [
            rec for rec in recommendations 
            if rec.lower() not in user_anime_lower
        ][:max_recommendations]
        
        return jsonify({
            'recommendations': filtered_recommendations,
            'input_count': len(user_anime),
            'max_recommendations': max_recommendations,
            'min_score': min_score,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Internal server error: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'anime-recommendation-api'
    })

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        'service': 'Anime Recommendation API',
        'version': '1.0.0',
        'endpoints': {
            '/api/recommendations': 'POST - Get anime recommendations',
            '/health': 'GET - Health check'
        },
        'example_request': {
            'url': '/api/recommendations',
            'method': 'POST',
            'body': {
                'anime_titles': ['Attack on Titan', 'Death Note'],
                'max_recommendations': 10,
                'min_score': 7.0
            }
        }
    })

if __name__ == '__main__':
    print("Starting Flask Recommendation API Server...")
    print("API will be available at: http://localhost:5000")
    print("Endpoints:")
    print("  POST /api/recommendations - Get anime recommendations")
    print("  GET /health - Health check")
    print("  GET / - API information")
    
    app.run(host='0.0.0.0', port=5000, debug=True)