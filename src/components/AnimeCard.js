import { 
  Card, 
  CardContent,
  CardMedia,
  Typography, 
  Chip,
  Box,
  Rating
} from '@mui/material';

const AnimeCard = ({ anime }) => {
  // Function to determine card position relative to viewport
  const getCardPosition = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Horizontal position
    let position = 'center';
    if (rect.left < viewportWidth * 0.2) position = 'left';
    if (rect.right > viewportWidth * 0.8) position = 'right';
    
    // Vertical position
    if (rect.bottom > viewportHeight * 0.8) {
      position += ' bottom';
    }
    
    card.setAttribute('data-position', position);
  };

  return (
    <Card 
      onMouseEnter={getCardPosition}
      sx={{ 
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        backgroundColor: 'background.paper',
        borderRadius: 3,
        boxShadow: 1,
        '&:hover': {
          zIndex: 3,
          transform: {
            xs: 'none',
            sm: 'scale(1.1)'
          },
          '& .hover-content': {
            display: 'block'
          }
        },
      // Dynamic positioning for edge cards
      // '&[data-position="left"]:hover': {
      //   left: { sm: 0 },
      //   transformOrigin: 'left center',
      // },
      // '&[data-position="right"]:hover': {
      //   right: { sm: 0 },
      //   left: { sm: 'auto' },
      //   transformOrigin: 'right center',
      // },
      '&[data-position="center"]:hover': {
        left: { sm: '-1.5rem' }, // Half of the expansion width
        transformOrigin: 'center center',
      },
      // Bottom edge handling
      '&[data-position*="bottom"]:hover': {
        transform: { 
          xs: 'none', 
          sm: 'scale(1.1) translateY(-3.75rem)' // Move up more when at bottom
        },
      },
    }}>
      <Box sx={{ 
        position: 'relative',
        width: { xs: '12rem', sm: '15rem', md: '15.625rem' }, // ~192px, 240px, 250px
        minWidth: { xs: '12rem', sm: '15rem', md: '15.625rem' },
        height: '100%',
        overflow: 'hidden',
        bgcolor: 'action.hover',
      }}>
        <CardMedia
          component="img"
          image={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '/placeholder.jpg'}
          alt={anime.title}
          loading="lazy"
          sx={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 25%',
          }}
        />
      </Box>
      <CardContent sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: { xs: '1rem', sm: '1.25rem' },
        '&:last-child': { pb: { xs: '1rem', sm: '1.25rem' } },
      }}>
        <Box sx={{ mb: '1rem' }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 600,
              lineHeight: 1.3,
              mb: '0.35rem',
              display: '-webkit-box',
              WebkitLineClamp: { xs: 2, sm: 3 },
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {anime.title_english || anime.title}
          </Typography>
          {anime.title_english && anime.title !== anime.title_english && (
            <Typography 
              variant="body2" 
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                color: 'text.secondary',
                fontStyle: 'italic',
                mb: '0.35rem',
                display: { xs: 'none', sm: '-webkit-box' },
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {anime.title}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {anime.score ? (
            <>
              <Rating 
                value={anime.score / 2} 
                precision={0.1} 
                readOnly 
                size="small"
              />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  whiteSpace: 'nowrap'
                }}
              >
                {anime.score}/10
                {anime.scored_by && ` (${anime.scored_by?.toLocaleString()} users)`}
              </Typography>
            </>
          ) : (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
            >
              Not yet rated
            </Typography>
          )}
        </Box>

        <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '0.5rem',
            mb: '1rem',
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
            color: 'text.secondary',
            alignItems: 'center'
          }}>
            {anime.type && (
              <Typography variant="body2" sx={{ 
                fontSize: 'inherit',
                backgroundColor: 'action.selected',
                px: '0.5rem',
                py: '0.15rem',
                borderRadius: '0.5rem'
              }}>
                {anime.type}
              </Typography>
            )}
            {anime.episodes && (
              <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                {anime.episodes} ep{anime.episodes === 1 ? '' : 's'}
              </Typography>
            )}
            {anime.status && (
              <Typography variant="body2" sx={{ 
                fontSize: 'inherit',
                color: anime.status === 'Currently Airing' ? 'success.main' : 'inherit'
              }}>
                • {anime.status}
              </Typography>
            )}
          </Box>

        {anime.genres?.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.35rem',
            mb: '1rem'
          }}>
            {anime.genres.slice(0, 3).map((genre) => (
              <Chip
                key={genre.mal_id}
                label={genre.name}
                size="small"
                sx={{ 
                  backgroundColor: 'secondary.dark',
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  height: { xs: '1.125rem', sm: '1.25rem' }, // ~18px, 20px
                  '& .MuiChip-label': {
                    px: { xs: '0.5rem', sm: '0.65rem' }
                  }
                }}
              />
            ))}
          </Box>
        )}

        {/* Show recommendation source if available
        {anime.recommendationSource && (
          <Box sx={{ mb: 1 }}>
            <Chip
              label={anime.recommendationSource === 'flask' ? 'ML Recommended' : 'Genre-based'}
              size="small"
              sx={{ 
                backgroundColor: anime.recommendationSource === 'flask' ? 'success.dark' : 'info.dark',
                fontSize: '0.7rem',
                height: 18,
                '& .MuiChip-label': {
                  px: 0.75
                }
              }}
            />
          </Box>
        )} */}

        <Box 
          className="hover-content"
          sx={{ 
            display: 'none',
            position: 'absolute',
            left: { xs: '12rem', sm: '15rem', md: '15.625rem' }, // Match image width
            right: 0,
            zIndex: 1,
            pl: '1rem',
            pt: anime.title_english && anime.title !== anime.title_english ? '11rem' : '9rem',
            pr: '1rem'
          }}
        >
          <Box sx={{
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.35rem',
            mb: '1rem'
          }}>
            {anime.season && (
              <Chip 
                label={`${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year || ''}`}
                size="small" 
                sx={{ 
                  bgcolor: 'primary.dark',
                  fontSize: '0.7rem',
                  height: '1.25rem'
                }}
              />
            )}
            {anime.rank && (
              <Chip 
                label={`Rank #${anime.rank.toLocaleString()}`}
                size="small" 
                sx={{ 
                  bgcolor: 'primary.dark',
                  fontSize: '0.7rem',
                  height: '1.25rem'
                }}
              />
            )}
            {anime.popularity && (
              <Chip 
                label={`Pop #${anime.popularity.toLocaleString()}`}
                size="small" 
                sx={{ 
                  bgcolor: 'primary.dark',
                  fontSize: '0.7rem',
                  height: '1.25rem'
                }}
              />
            )}
          </Box>

          <Typography 
            variant="body2"
            sx={{
              fontSize: '0.85rem',
              lineHeight: 1.5,
              color: 'text.secondary',
              mb: anime.studios?.length > 0 ? '0.75rem' : 0,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {anime.synopsis || 'No synopsis available.'}
          </Typography>
          {anime.studios?.length > 0 && (
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.75rem',
                color: 'text.secondary',
                fontStyle: 'italic'
              }}
            >
              Studio: {anime.studios.map(studio => studio.name).join(', ')}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnimeCard;