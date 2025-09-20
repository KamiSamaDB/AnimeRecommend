import { useState } from 'react';
import { Paper, InputBase, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import GradientBorder from './GradientBorder';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mb: 4 }}>
      <GradientBorder 
        className="search-bar-gradient"
        animate={true}
        borderWidth="2px"
        borderRadius="24px"
      >
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '22px',
            boxShadow: 'none',
            backgroundColor: 'transparent',
            '& .MuiInputBase-root': {
              color: 'white'
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.7)',
              opacity: 1
            }
          }}
        >
          <InputBase
            sx={{ 
              ml: 1, 
              flex: 1,
              color: 'white',
              '& input::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1
              }
            }}
            placeholder="Enter anime titles (separate multiple titles with commas)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <IconButton
              type="button"
              sx={{ 
                p: '10px',
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  color: '#FF61D8'
                }
              }}
              aria-label="clear"
              onClick={() => setQuery('')}
            >
              <ClearIcon />
            </IconButton>
          )}
          <IconButton 
            type="submit" 
            sx={{ 
              p: '10px',
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                color: '#FF61D8'
              }
            }} 
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </GradientBorder>
    </Box>
  );
};

export default SearchBar;