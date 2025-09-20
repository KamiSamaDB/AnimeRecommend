# AnimeRecommend

A modern, responsive web application for discovering and exploring anime recommendations with stunning animations and ML-powered suggestions. Built with React, Material-UI, and GSAP animations, this application provides an intuitive and visually appealing interface to get personalized anime recommendations.

## ✨ Features

- 🤖 **Flask API Integration** - ML-powered anime recommendations with enhanced logging
- 🎬 **GSAP Animations** - Smooth character-by-character text animations for the title
- 🌈 **Gradient UI Elements** - Animated gradient borders on search bar
- 📱 **Fully Responsive Design** - Optimized for all screen sizes with relative units
- 🎨 **Modern Dark Theme** - Anime-inspired color palette with pink/purple gradients
- 🔍 **Enhanced Search Experience** - Interactive search bar with gradient borders
- 📊 **Comprehensive Anime Data** - Ratings, rankings, popularity, and detailed information
- 🎯 **Smart Card Layout** - Dynamic positioning with hover effects and content overflow handling
- 🏷️ **Visual Indicators** - Clear source identification for ML vs fallback recommendations
- 📺 **Rich Anime Details** including:
  - English and Japanese titles with proper spacing
  - Accurate rating display (score/10 format)  
  - Episode count and airing status
  - Studio information and synopsis
  - Genre categorization
  - Season and year information

## 🚀 Flask API Integration

This application integrates with a Flask recommendation API to provide machine learning-powered anime suggestions with comprehensive error handling and debugging.

### Setup

1. **Configure your Flask API URL:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the Flask API URL:
   ```
   REACT_APP_FLASK_API_URL=http://127.0.0.1:5000
   ```

2. **Expected Flask API Contract:**
   - **Endpoint:** `POST /api/recommendations`
   - **Request Body:**
     ```json
     {
       "anime_titles": ["One Piece", "Attack on Titan"],
       "max_recommendations": 10,
       "min_score": 7.0
     }
     ```
   - **Response Format:**
     ```json
     {
       "status": "success",
       "recommendations": [
         {
           "mal_id": 11061,
           "title": "Hunter x Hunter (2011)",
           "title_english": "Hunter x Hunter",
           "score": 9.03,
           "episodes": 148,
           "genres": ["Action", "Adventure", "Fantasy", "Shounen"],
           "image_url": "https://cdn.myanimelist.net/images/anime/1337/99013l.jpg",
           "synopsis": "Hunters devote themselves to accomplishing hazardous tasks...",
           "year": 2011,
           "popularity": 8,
           "confidence_score": 1.0,
           "similarity_score": 0.933,
           "reasons": ["Similar genres", "Highly rated", "Popular"]
         }
       ],
       "total_found": 3,
       "processing_time": 0.05
     }
     ```

### Enhanced Features

- **Detailed Debug Logging** - Console logs with emojis for easy debugging
- **Error Handling** - Graceful fallback and user-friendly error messages
- **Data Transformation** - Automatic conversion of Flask data to React component format
- **Rating Display** - Proper score formatting with estimated user counts
- **Source Tracking** - Clear identification of ML-powered recommendations

### How It Works

1. **User Input** - User enters anime titles in the animated search bar
2. **Flask API Call** - App sends request to ML recommendation service with detailed logging
3. **Data Processing** - Response is transformed and enriched with proper formatting
4. **Visual Display** - Results shown in responsive cards with accurate ratings and information
5. **Error Handling** - Graceful fallback with clear error messages if API is unavailable

## 🎨 Animation & UI Features

### GSAP Animations
- **SplitText Component** - Character-by-character animations for the main title
- **Scroll-triggered Animations** - Elements animate when they come into view
- **Smooth Transitions** - Hardware-accelerated animations for optimal performance
- **Responsive Animations** - Automatically disabled on mobile for better UX

### Gradient Elements
- **Search Bar** - Animated gradient border with focus effects
- **Title Text** - Beautiful gradient text with smooth color transitions
- **Interactive Hover States** - Enhanced visual feedback

### Responsive Design
- **Mobile-First Approach** - Smaller text sizes and optimized spacing for mobile
- **Relative Units** - All sizing uses `rem` and `em` for consistent scaling
- **Adaptive Layout** - Cards and content adjust smoothly across screen sizes
- **Touch-Friendly** - Optimized interactions for mobile devices

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** or **yarn** package manager
- **Flask recommendation server** (optional - app provides clear error messages without it)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/KamiSamaDB/AnimeRecommend.git
cd animerec
```

2. **Install dependencies:**
```bash
npm install
# This includes React, Material-UI, GSAP, and @gsap/react
```

3. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env to set your Flask API URL
```

4. **Start the development server:**
```bash
npm start
```

The application will be available at `http://localhost:3000`.

### 🔧 Development Tips

- **Clear Build Cache:** If experiencing issues, remove `build/` directory to clear cached files
- **Debug Mode:** Check browser console for detailed logs with emoji indicators
- **API Testing:** Use PowerShell/curl to test Flask API independently
- **Animation Performance:** Disable animations on slower devices by setting `prefers-reduced-motion`

## 💻 Tech Stack

- **React** - Frontend framework with hooks and functional components
- **Material-UI (MUI)** - UI component library with dark theme customization
- **GSAP** - Professional animation library with SplitText plugin
- **@gsap/react** - React integration for GSAP animations
- **CSS-in-JS** - Styling through MUI's sx prop and custom CSS
- **Axios** - HTTP client for API requests
- **Environment Variables** - Configuration management

## 📁 Project Structure

```
animerec/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── AnimeCard.js       - Individual anime display with hover effects
│   │   ├── AnimeGrid.js       - Responsive grid layout
│   │   ├── SearchBar.js       - Search with gradient border
│   │   └── GradientBorder.js  - Reusable gradient border component
│   ├── services/
│   │   └── animeService.js    - Flask API integration with error handling
│   ├── SplitText.js           - GSAP text animation component
│   ├── App.js                 - Main application with theme
│   ├── App.css               - Custom styles and animations
│   └── index.js
├── .env.example               - Environment configuration template
└── README.md
```

## 🎯 Features in Detail

### Responsive Design
- **Mobile-optimized text sizing** - Smaller fonts on mobile for better content display
- **Relative units throughout** - All sizing uses rem/em for consistent scaling
- **Adaptive hover content** - Smart positioning based on viewport location
- **Touch-friendly interface** - Optimized for mobile interactions

### Advanced Card System
- **Dynamic hover positioning** - Cards adjust based on screen edges
- **Conditional content display** - Different padding for dual-language titles
- **Rating accuracy** - Shows actual scores (e.g., "9.03/10") with proper formatting
- **Smooth animations** - Hardware-accelerated transforms and transitions

### Search Experience
- **Animated gradient borders** - Continuous color cycling with interaction effects
- **Focus state enhancements** - Special glow effects and faster animations
- **Real-time visual feedback** - Icons and colors respond to user actions
- **Error handling** - Clear messages for API connectivity issues

### Performance Optimization
- **Lazy loading** - Images load only when needed
- **Efficient animations** - GPU-accelerated CSS transforms
- **Reduced motion support** - Respects user accessibility preferences
- **Optimized re-renders** - Smart component updates and state management

## 📱 Accessibility Features

- **Keyboard Navigation** - Full keyboard support for all interactive elements
- **Screen Reader Support** - Proper ARIA labels and semantic HTML
- **Reduced Motion** - Animations disabled for users who prefer less motion
- **High Contrast** - Dark theme with sufficient color contrast ratios
- **Responsive Text** - Scales with user's browser font size preferences

## 📋 Available Scripts

- `npm start` - Runs the app in development mode with hot reloading
- `npm test` - Launches the test runner in interactive watch mode  
- `npm run build` - Builds the app for production with optimizations
- `npm run eject` - Ejects from Create React App (⚠️ one-way operation)

## 🚀 Deployment

The app can be deployed to various platforms:
- **Vercel/Netlify** - Automatic deployment from Git repository
- **GitHub Pages** - Static hosting with build action
- **Docker** - Containerized deployment for any platform

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
- Follow React functional component patterns
- Use Material-UI components for consistency
- Add proper TypeScript types if converting to TS
- Test responsive design on multiple screen sizes
- Ensure animations perform well on lower-end devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MyAnimeList Community** - For providing comprehensive anime data
- **Material-UI Team** - For the excellent React component library  
- **GSAP Team** - For the professional animation platform
- **shadcn/ui** - For gradient border design inspiration
- **React Community** - For the robust ecosystem and best practices

## 🐛 Known Issues & Solutions

- **Build Cache Issues** - Clear `build/` directory if old code persists
- **GSAP License** - Some GSAP plugins require commercial license for production
- **API Rate Limiting** - Flask integration helps reduce external API calls
- **Mobile Performance** - Animations automatically disabled on slower devices

## 🔮 Future Enhancements

- TypeScript migration for better type safety
- User authentication and favorites system  
- Advanced filtering and sorting options
- Offline support with service workers
- Additional animation presets and themes
