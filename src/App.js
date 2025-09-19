import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography, CircularProgress, Alert } from '@mui/material';
import SearchBar from './components/SearchBar';
import AnimeGrid from './components/AnimeGrid';
import { findOriginalAnime, getRecommendations } from './services/animeService';
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
      
      // Find original anime and analyze their genres
      const animeData = await findOriginalAnime(titles);
      if (!animeData) {
        setError('Could not find any of the anime titles. Please check the spelling and try again.');
        setSearchResults([]);
        return;
      }

      // Get recommendations based on genre frequency analysis
      const recommendations = await getRecommendations(animeData);
      
      // Add genre analysis information to the error message if no recommendations
      if (recommendations.length === 0 && animeData.genreAnalysis.length > 0) {
        const topGenres = animeData.genreAnalysis
          .filter(g => g.percentage >= 25)
          .map(g => `${g.name} (${g.frequency} times)`)
          .join(', ');
        setError(`No recommendations found. Your input anime contained these main genres: ${topGenres}`);
        setSearchResults([]);
        return;
      }
      
      if (recommendations.length === 0) {
        setError('No recommendations found. Try different anime titles.');
        setSearchResults([]);
      } else {
        setSearchResults(recommendations);
      }
    } catch (err) {
      setError('Failed to fetch anime recommendations. Please try again.');
      console.error(err);
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
          <Typography
            variant="h1"
            component="h1"
            sx={{
              mb: 4,
              textAlign: 'center',
              background: 'linear-gradient(45deg, #FF61D8 30%, #7B61FF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Anime Recommendations
          </Typography>
          
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
