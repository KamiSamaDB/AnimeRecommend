# AnimeRecommend

A modern, responsive web application for discovering and exploring anime. Built with React and Material-UI, this application provides an intuitive interface to browse and search through anime titles with detailed information and recommendations.

## Features

- 📱 Responsive grid layout that adapts to different screen sizes
- 🎨 Modern Material Design using MUI components
- 🔍 Interactive card design with hover effects
- 📊 Display of anime ratings, rankings, and popularity
- 🎯 Genre-based categorization
- 📺 Comprehensive anime details including:
  - English and Japanese titles
  - Episode count
  - Airing status
  - Studio information
  - Synopsis
  - User ratings and scores
  - Season information
  - Type (TV, Movie, OVA, etc.)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KamiSamaDB/AnimeRecommend.git
cd animerec
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Tech Stack

- **React** - Frontend framework
- **Material-UI (MUI)** - UI component library
- **CSS-in-JS** - Styling solution through MUI's sx prop

## Project Structure

```
animerec/
├── public/
│   └── index.html
└── src/
    ├── components/
    │   ├── AnimeCard.js    - Individual anime display card
    │   ├── AnimeGrid.js    - Grid layout for anime cards
    │   └── SearchBar.js    - Search functionality
    ├── App.js
    └── index.js
```

## Features in Detail

### Responsive Design
- Full-width cards on mobile devices
- Multi-column grid on larger screens
- Adaptive typography and spacing
- Touch-friendly interface

### Card Interactions
- Hover effects with additional information
- Smart positioning for edge-case cards
- Smooth animations and transitions
- Rating display with star visualization

### Information Display
- Primary and alternative titles
- Rating and popularity metrics
- Genre tags with custom styling
- Studio information
- Series status and episode count

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [MyAnimeList API](https://myanimelist.net/) for providing the anime data
- Material-UI team for the excellent component library
