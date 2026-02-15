export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  cast: string[];
  characters: string[];
  writers: string[];
  genre: string;
  tagline: string;
  plotKeywords: string[];
  posterUrl: string;
}

export const movies: Movie[] = [
  {
    id: 1, title: "The Godfather", year: 1972, director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan", "Robert Duvall", "Diane Keaton"],
    characters: ["Vito Corleone", "Michael Corleone", "Sonny Corleone", "Tom Hagen", "Kay Adams"],
    writers: ["Mario Puzo", "Francis Ford Coppola"], genre: "Drama",
    tagline: "An offer you can't refuse.",
    plotKeywords: ["mafia", "family", "power", "crime", "New York"],
    posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"
  },
  {
    id: 2, title: "Pulp Fiction", year: 1994, director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson", "Bruce Willis", "Tim Roth"],
    characters: ["Vincent Vega", "Mia Wallace", "Jules Winnfield", "Butch Coolidge", "Pumpkin"],
    writers: ["Quentin Tarantino", "Roger Avary"], genre: "Thriller",
    tagline: "You won't know the facts until you've seen the fiction.",
    plotKeywords: ["hitman", "briefcase", "dance", "adrenaline", "nonlinear"],
    posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"
  },
  {
    id: 3, title: "The Shawshank Redemption", year: 1994, director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"],
    characters: ["Andy Dufresne", "Red", "Warden Norton", "Heywood"],
    writers: ["Stephen King", "Frank Darabont"], genre: "Drama",
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    plotKeywords: ["prison", "escape", "friendship", "hope", "corruption"],
    posterUrl: "https://image.tmdb.org/t/p/w500/9cjIGRiQZ1kHFsURYClYmxFOGch.jpg"
  },
  {
    id: 4, title: "Jaws", year: 1975, director: "Steven Spielberg",
    cast: ["Roy Scheider", "Robert Shaw", "Richard Dreyfuss", "Lorraine Gary"],
    characters: ["Chief Brody", "Quint", "Matt Hooper", "Ellen Brody"],
    writers: ["Peter Benchley", "Carl Gottlieb"], genre: "Thriller",
    tagline: "Don't go in the water.",
    plotKeywords: ["shark", "beach", "island", "ocean", "summer"],
    posterUrl: "https://image.tmdb.org/t/p/w500/lxM6kqilAdpdhqUl2biYp5frUxE.jpg"
  },
  {
    id: 5, title: "Alien", year: 1979, director: "Ridley Scott",
    cast: ["Sigourney Weaver", "Tom Skerritt", "John Hurt", "Ian Holm"],
    characters: ["Ripley", "Dallas", "Kane", "Ash"],
    writers: ["Dan O'Bannon", "Ronald Shusett"], genre: "Sci-Fi",
    tagline: "In space no one can hear you scream.",
    plotKeywords: ["spacecraft", "creature", "survival", "android", "xenomorph"],
    posterUrl: "https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg"
  },
  {
    id: 6, title: "The Silence of the Lambs", year: 1991, director: "Jonathan Demme",
    cast: ["Jodie Foster", "Anthony Hopkins", "Scott Glenn", "Ted Levine"],
    characters: ["Clarice Starling", "Hannibal Lecter", "Jack Crawford", "Buffalo Bill"],
    writers: ["Thomas Harris", "Ted Tally"], genre: "Thriller",
    tagline: "To enter the mind of a killer she must challenge the mind of a madman.",
    plotKeywords: ["serial killer", "FBI", "psychiatrist", "cannibal", "investigation"],
    posterUrl: "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg"
  },
  {
    id: 7, title: "Back to the Future", year: 1985, director: "Robert Zemeckis",
    cast: ["Michael J. Fox", "Christopher Lloyd", "Lea Thompson", "Crispin Glover"],
    characters: ["Marty McFly", "Doc Brown", "Lorraine Baines", "George McFly"],
    writers: ["Robert Zemeckis", "Bob Gale"], genre: "Sci-Fi",
    tagline: "He's the only kid ever to get into trouble before he was born.",
    plotKeywords: ["time travel", "DeLorean", "1955", "high school", "lightning"],
    posterUrl: "https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg"
  },
  {
    id: 8, title: "Goodfellas", year: 1990, director: "Martin Scorsese",
    cast: ["Ray Liotta", "Robert De Niro", "Joe Pesci", "Lorraine Bracco"],
    characters: ["Henry Hill", "Jimmy Conway", "Tommy DeVito", "Karen Hill"],
    writers: ["Nicholas Pileggi", "Martin Scorsese"], genre: "Drama",
    tagline: "Three decades of life in the Mafia.",
    plotKeywords: ["gangster", "betrayal", "witness protection", "heist", "cocaine"],
    posterUrl: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg"
  },
  {
    id: 9, title: "The Matrix", year: 1999, director: "Lana Wachowski",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"],
    characters: ["Neo", "Morpheus", "Trinity", "Agent Smith"],
    writers: ["Lana Wachowski", "Lilly Wachowski"], genre: "Sci-Fi",
    tagline: "Welcome to the Real World.",
    plotKeywords: ["simulation", "chosen one", "martial arts", "red pill", "machines"],
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
  },
  {
    id: 10, title: "Psycho", year: 1960, director: "Alfred Hitchcock",
    cast: ["Anthony Perkins", "Janet Leigh", "Vera Miles", "John Gavin"],
    characters: ["Norman Bates", "Marion Crane", "Lila Crane", "Sam Loomis"],
    writers: ["Joseph Stefano", "Robert Bloch"], genre: "Horror",
    tagline: "A new—and altogether different—screen excitement!!!",
    plotKeywords: ["motel", "shower", "split personality", "murder", "theft"],
    posterUrl: "https://image.tmdb.org/t/p/w500/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg"
  },
  {
    id: 11, title: "Raiders of the Lost Ark", year: 1981, director: "Steven Spielberg",
    cast: ["Harrison Ford", "Karen Allen", "Paul Freeman", "John Rhys-Davies"],
    characters: ["Indiana Jones", "Marion Ravenwood", "Belloq", "Sallah"],
    writers: ["Lawrence Kasdan", "George Lucas"], genre: "Action",
    tagline: "The Return of the Great Adventure.",
    plotKeywords: ["archaeologist", "ark", "Nazis", "adventure", "Egypt"],
    posterUrl: "https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc0AHAb0.jpg"
  },
  {
    id: 12, title: "The Shining", year: 1980, director: "Stanley Kubrick",
    cast: ["Jack Nicholson", "Shelley Duvall", "Danny Lloyd", "Scatman Crothers"],
    characters: ["Jack Torrance", "Wendy Torrance", "Danny Torrance", "Dick Hallorann"],
    writers: ["Stephen King", "Stanley Kubrick"], genre: "Horror",
    tagline: "A masterpiece of modern horror.",
    plotKeywords: ["hotel", "isolation", "twins", "axe", "winter"],
    posterUrl: "https://image.tmdb.org/t/p/w500/nRj5511mZdTl4saWEPoj9QroTIu.jpg"
  },
  {
    id: 13, title: "Forrest Gump", year: 1994, director: "Robert Zemeckis",
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise", "Sally Field"],
    characters: ["Forrest Gump", "Jenny Curran", "Lt. Dan Taylor", "Mrs. Gump"],
    writers: ["Winston Groom", "Eric Roth"], genre: "Drama",
    tagline: "Life is like a box of chocolates.",
    plotKeywords: ["running", "Vietnam", "shrimp", "ping pong", "feather"],
    posterUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg"
  },
  {
    id: 14, title: "Die Hard", year: 1988, director: "John McTiernan",
    cast: ["Bruce Willis", "Alan Rickman", "Bonnie Bedelia", "Reginald VelJohnson"],
    characters: ["John McClane", "Hans Gruber", "Holly Gennero", "Sgt. Al Powell"],
    writers: ["Jeb Stuart", "Steven E. de Souza"], genre: "Action",
    tagline: "Forty stories of sheer adventure!",
    plotKeywords: ["skyscraper", "hostage", "Christmas", "barefoot", "terrorists"],
    posterUrl: "https://image.tmdb.org/t/p/w500/yFihWxQcmqcaBR31QM6Y8gT6aYV.jpg"
  },
  {
    id: 15, title: "Ghostbusters", year: 1984, director: "Ivan Reitman",
    cast: ["Bill Murray", "Dan Aykroyd", "Harold Ramis", "Sigourney Weaver"],
    characters: ["Peter Venkman", "Ray Stantz", "Egon Spengler", "Dana Barrett"],
    writers: ["Dan Aykroyd", "Harold Ramis"], genre: "Comedy",
    tagline: "Who you gonna call?",
    plotKeywords: ["ghosts", "proton pack", "New York", "Stay Puft", "containment"],
    posterUrl: "https://image.tmdb.org/t/p/w500/6AUBjoDiudOFkNfMgLgMvEiEjGF.jpg"
  },
  {
    id: 16, title: "Blade Runner", year: 1982, director: "Ridley Scott",
    cast: ["Harrison Ford", "Rutger Hauer", "Sean Young", "Daryl Hannah"],
    characters: ["Rick Deckard", "Roy Batty", "Rachael", "Pris"],
    writers: ["Hampton Fancher", "David Peoples"], genre: "Sci-Fi",
    tagline: "Man has made his match... now it's his problem.",
    plotKeywords: ["replicant", "dystopia", "rain", "origami", "retirement"],
    posterUrl: "https://image.tmdb.org/t/p/w500/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg"
  },
  {
    id: 17, title: "The Exorcist", year: 1973, director: "William Friedkin",
    cast: ["Ellen Burstyn", "Max von Sydow", "Linda Blair", "Jason Miller"],
    characters: ["Chris MacNeil", "Father Merrin", "Regan", "Father Karras"],
    writers: ["William Peter Blatty"], genre: "Horror",
    tagline: "Something almost beyond comprehension is happening to a girl on this street.",
    plotKeywords: ["possession", "demon", "priest", "Georgetown", "pea soup"],
    posterUrl: "https://image.tmdb.org/t/p/w500/4ucLGcXVVSVnsfkGtbLY4XAius8.jpg"
  },
  {
    id: 18, title: "Groundhog Day", year: 1993, director: "Harold Ramis",
    cast: ["Bill Murray", "Andie MacDowell", "Chris Elliott", "Stephen Tobolowsky"],
    characters: ["Phil Connors", "Rita Hanson", "Larry", "Ned Ryerson"],
    writers: ["Danny Rubin", "Harold Ramis"], genre: "Comedy",
    tagline: "He's having the worst day of his life... over, and over...",
    plotKeywords: ["time loop", "weatherman", "Pennsylvania", "February", "self-improvement"],
    posterUrl: "https://image.tmdb.org/t/p/w500/gCgt1WARPdyGnbFSoHsMfRNL0Kb.jpg"
  },
  {
    id: 19, title: "Fight Club", year: 1999, director: "David Fincher",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter", "Meat Loaf"],
    characters: ["Tyler Durden", "The Narrator", "Marla Singer", "Robert Paulson"],
    writers: ["Chuck Palahniuk", "Jim Uhls"], genre: "Thriller",
    tagline: "Mischief. Mayhem. Soap.",
    plotKeywords: ["insomnia", "soap", "underground", "anarchy", "twist"],
    posterUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
  },
  {
    id: 20, title: "Jurassic Park", year: 1993, director: "Steven Spielberg",
    cast: ["Sam Neill", "Laura Dern", "Jeff Goldblum", "Richard Attenborough"],
    characters: ["Alan Grant", "Ellie Sattler", "Ian Malcolm", "John Hammond"],
    writers: ["Michael Crichton", "David Koepp"], genre: "Sci-Fi",
    tagline: "An adventure 65 million years in the making.",
    plotKeywords: ["dinosaurs", "theme park", "DNA", "island", "chaos theory"],
    posterUrl: "https://image.tmdb.org/t/p/w500/oU7Oez2kCMptmBjS7ISwLuuA46l.jpg"
  },
  {
    id: 21, title: "The Big Lebowski", year: 1998, director: "Joel Coen",
    cast: ["Jeff Bridges", "John Goodman", "Julianne Moore", "Steve Buscemi"],
    characters: ["The Dude", "Walter Sobchak", "Maude Lebowski", "Donny"],
    writers: ["Joel Coen", "Ethan Coen"], genre: "Comedy",
    tagline: "Her life was in their hands. Now her toe is in the mail.",
    plotKeywords: ["bowling", "rug", "kidnapping", "White Russian", "nihilists"],
    posterUrl: "https://image.tmdb.org/t/p/w500/9mprbw31MGdd66LR0AQKaDKEFOE.jpg"
  },
  {
    id: 22, title: "Terminator 2: Judgment Day", year: 1991, director: "James Cameron",
    cast: ["Arnold Schwarzenegger", "Linda Hamilton", "Robert Patrick", "Edward Furlong"],
    characters: ["T-800", "Sarah Connor", "T-1000", "John Connor"],
    writers: ["James Cameron", "William Wisher"], genre: "Action",
    tagline: "It's nothing personal.",
    plotKeywords: ["cyborg", "future", "liquid metal", "Skynet", "nuclear"],
    posterUrl: "https://image.tmdb.org/t/p/w500/weVXMD5QBGeQil4HEATZqAkXvLi.jpg"
  },
  {
    id: 23, title: "Casablanca", year: 1942, director: "Michael Curtiz",
    cast: ["Humphrey Bogart", "Ingrid Bergman", "Paul Henreid", "Claude Rains"],
    characters: ["Rick Blaine", "Ilsa Lund", "Victor Laszlo", "Captain Renault"],
    writers: ["Julius Epstein", "Philip Epstein"], genre: "Drama",
    tagline: "They had a date with fate in Casablanca!",
    plotKeywords: ["wartime", "nightclub", "letters of transit", "love triangle", "Morocco"],
    posterUrl: "https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg"
  },
  {
    id: 24, title: "Mad Max: Fury Road", year: 2015, director: "George Miller",
    cast: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult", "Hugh Keays-Byrne"],
    characters: ["Max Rockatansky", "Furiosa", "Nux", "Immortan Joe"],
    writers: ["George Miller", "Brendan McCarthy"], genre: "Action",
    tagline: "What a lovely day!",
    plotKeywords: ["desert", "chase", "war rig", "wasteland", "water"],
    posterUrl: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFBO.jpg"
  },
  {
    id: 25, title: "Get Out", year: 2017, director: "Jordan Peele",
    cast: ["Daniel Kaluuya", "Allison Williams", "Bradley Whitford", "Catherine Keener"],
    characters: ["Chris Washington", "Rose Armitage", "Dean Armitage", "Missy Armitage"],
    writers: ["Jordan Peele"], genre: "Horror",
    tagline: "Just because you're invited, doesn't mean you're welcome.",
    plotKeywords: ["hypnosis", "sunken place", "suburb", "deer", "teacup"],
    posterUrl: "https://image.tmdb.org/t/p/w500/qGZIJIB0FU2sMBkNtvgTdPGhcoT.jpg"
  },
  {
    id: 26, title: "The Princess Bride", year: 1987, director: "Rob Reiner",
    cast: ["Cary Elwes", "Robin Wright", "Mandy Patinkin", "Wallace Shawn"],
    characters: ["Westley", "Buttercup", "Inigo Montoya", "Vizzini"],
    writers: ["William Goldman"], genre: "Comedy",
    tagline: "She gets kidnapped. He gets killed. But it all ends up okay.",
    plotKeywords: ["true love", "sword fight", "pirate", "miracle", "inconceivable"],
    posterUrl: "https://image.tmdb.org/t/p/w500/gpMV0fWNgQlchmIYMKEwCzFmJmE.jpg"
  },
  {
    id: 27, title: "Inception", year: 2010, director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
    characters: ["Cobb", "Arthur", "Ariadne", "Eames"],
    writers: ["Christopher Nolan"], genre: "Sci-Fi",
    tagline: "Your mind is the scene of the crime.",
    plotKeywords: ["dreams", "layers", "totem", "limbo", "spinning top"],
    posterUrl: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg"
  },
  {
    id: 28, title: "Ferris Bueller's Day Off", year: 1986, director: "John Hughes",
    cast: ["Matthew Broderick", "Alan Ruck", "Mia Sara", "Jeffrey Jones"],
    characters: ["Ferris Bueller", "Cameron Frye", "Sloane Peterson", "Ed Rooney"],
    writers: ["John Hughes"], genre: "Comedy",
    tagline: "One man's struggle to take it easy.",
    plotKeywords: ["school", "skip day", "Ferrari", "Chicago", "fourth wall"],
    posterUrl: "https://image.tmdb.org/t/p/w500/9LTQMiSMnhABBsjfhGMVer4wEfF.jpg"
  },
  {
    id: 29, title: "No Country for Old Men", year: 2007, director: "Joel Coen",
    cast: ["Javier Bardem", "Josh Brolin", "Tommy Lee Jones", "Woody Harrelson"],
    characters: ["Anton Chigurh", "Llewelyn Moss", "Ed Tom Bell", "Carson Wells"],
    writers: ["Joel Coen", "Ethan Coen"], genre: "Thriller",
    tagline: "There are no clean getaways.",
    plotKeywords: ["coin toss", "desert", "money", "cattle gun", "fate"],
    posterUrl: "https://image.tmdb.org/t/p/w500/bj1v6YKF8yHqA489GFfPC6FJR0C.jpg"
  },
  {
    id: 30, title: "Parasite", year: 2019, director: "Bong Joon-ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong", "Choi Woo-shik"],
    characters: ["Ki-taek", "Dong-ik", "Yeon-kyo", "Ki-woo"],
    writers: ["Bong Joon-ho", "Han Jin-won"], genre: "Thriller",
    tagline: "Act like you own the place.",
    plotKeywords: ["class", "basement", "infiltration", "smell", "stairs"],
    posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"
  },
];

export const allMovieTitles = movies.map(m => m.title);
