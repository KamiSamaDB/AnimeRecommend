import { Box } from '@mui/material';
import AnimeCard from './AnimeCard';

const AnimeGrid = ({ animeList }) => (
  <Box sx={{ 
    width: '100%',
    px: 2,
    mx: 'auto',
    display: 'flex',
    justifyContent: 'center'
  }}>
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 3,
      justifyContent: 'center',
      maxWidth: '1300px'
    }}>
      {animeList.map((anime) => (
        <Box 
          key={anime.mal_id}
          sx={{
            width: '300px',
            flex: '0 0 auto'
          }}
        >
          <AnimeCard anime={anime} />
        </Box>
      ))}
    </Box>
  </Box>
);

export default AnimeGrid;