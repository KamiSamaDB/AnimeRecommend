import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography, CircularProgress, Alert } from '@mui/material';
import SearchBar from './components/SearchBar';
import AnimeGrid from './components/AnimeGrid';
import SplitText from './SplitText';
import { getRecommendations } from './services/animeService';
import './App.css';

// Create a dark theme instance with anime-inspired colors
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF61D8', // Vibrant pink often seen in anime
    },
    secondary: {
      main: '#7B61FF', // Bright purple
    },
    background: {
      default: '#1A1A2E', // Dark blue-black
      paper: '#232344',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      // Split the query into individual titles
      const titles = query.split(',').map(title => title.trim()).filter(Boolean);
      
      if (titles.length === 0) {
        setError('Please enter at least one anime title');
        setLoading(false);
        return;
      }
      
      // Call Flask API for recommendations
      console.log('Getting recommendations from Flask API...');
      const recommendations = await getRecommendations(titles);
      
      if (recommendations.length === 0) {
        setError('No recommendations found. Please ensure your Flask API is running at http://127.0.0.1:5000 and try different anime titles.');
        setSearchResults([]);
      } else {
        setSearchResults(recommendations);
        console.log(`Successfully got ${recommendations.length} recommendations from Flask API`);
      }
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError('Failed to fetch anime recommendations. Please ensure your Flask API is running at http://127.0.0.1:5000 and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ 
          minHeight: '100vh',
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <SplitText
            text="Anime Recommendations"
            className="anime-title"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            tag="h1"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          
          <SearchBar onSearch={handleSearch} />
          
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            searchResults.length > 0 && <AnimeGrid animeList={searchResults} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
