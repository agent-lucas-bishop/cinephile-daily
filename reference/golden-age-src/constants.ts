import { Movie } from "./types";

export const COLORS = {
  paper: '#F4F1EA',
  ink: '#1A1A1A',
  gold: '#C5A059',
  red: '#720e0e', // Darker theater red
  redBright: '#9E1B1B',
  paperDark: '#E6E2D6'
};

export const FALLBACK_MOVIE: Movie = {
  id: 238,
  title: "The Godfather",
  tagline: "An offer you can't refuse.",
  release_date: "1972-03-14",
  vote_average: 8.7,
  overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
  poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  backdrop_path: "/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg",
  credits: {
    cast: [
      { id: 1, name: "Marlon Brando", character: "Don Vito Corleone" },
      { id: 2, name: "Al Pacino", character: "Michael Corleone" },
      { id: 3, name: "James Caan", character: "Sonny Corleone" },
      { id: 4, name: "Robert Duvall", character: "Tom Hagen" },
    ],
    crew: [
      { id: 10, name: "Francis Ford Coppola", job: "Director", department: "Directing" },
      { id: 11, name: "Mario Puzo", job: "Screenplay", department: "Writing" },
    ]
  }
};

// Use this to simulate distinct noise
export const NOISE_SVG_DATA_URI = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E`;
