import { Box } from "@mui/material";
import AnimeCard from "./AnimeCard";

const AnimeGrid = ({ animeList }) => {
  // Helper function to normalize title for comparison
  const normalizeTitle = (title) => title.toLowerCase().trim();

  // Filter out duplicate/similar titles of same type
  const filteredList = animeList.reduce((acc, anime) => {
    // Check if this anime should be excluded
    const shouldExclude = acc.some(existingAnime => 
      // Different anime but same type
      existingAnime.mal_id !== anime.mal_id && 
      existingAnime.type === anime.type &&
      // One title contains the other
      (normalizeTitle(existingAnime.title).includes(normalizeTitle(anime.title)) ||
       normalizeTitle(anime.title).includes(normalizeTitle(existingAnime.title)))
    );

    // If we already have a longer titled version of this anime, don't add it
    if (shouldExclude) {
      return acc;
    }

    // Remove any previously added anime that this one would make redundant
    const updatedAcc = acc.filter(existingAnime => 
      existingAnime.mal_id === anime.mal_id || 
      existingAnime.type !== anime.type ||
      (!normalizeTitle(existingAnime.title).includes(normalizeTitle(anime.title)) &&
       !normalizeTitle(anime.title).includes(normalizeTitle(existingAnime.title)))
    );

    // Add this anime to the filtered list
    return [...updatedAcc, anime];
  }, []);

  return (
    <Box sx={{ 
      width: "100%",
      maxWidth: "100%",
      px: { xs: 0, sm: 2 },
      mx: "auto"
    }}>
      <Box 
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1, sm: 2 },
          maxWidth: "1200px",
          mx: "auto",
          position: "relative",
          "&:has(.card-wrapper:hover) .card-wrapper:not(:hover)": {
            opacity: 0.3
          }
        }}>
        {filteredList.map((anime) => (
          <Box 
            key={anime.mal_id}
            component="a"
            href={anime.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-wrapper"
            sx={{
              width: "100%",
              height: { xs: "150px", sm: "180px" },
              textDecoration: "none",
              color: "inherit",
              display: "block",
              position: "relative",
              transition: "all 0.3s ease-in-out",
              transformOrigin: "center center",
              "&:hover": {
                height: { xs: "300px", sm: "400px" },
                zIndex: 2
              }
            }}
          >
            <AnimeCard anime={anime} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AnimeGrid;
