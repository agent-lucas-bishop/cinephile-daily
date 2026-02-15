export interface CastMember {
  name: string;
  character: string;
  profilePath: string | null;
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  directorPhoto: string | null;
  cast: CastMember[];
  writers: string[];
  genre: string;
  tagline: string;
  plotKeywords: string[];
  posterUrl: string;
}

const IMG = 'https://image.tmdb.org/t/p/w185';
const POSTER = 'https://image.tmdb.org/t/p/w500';

export const movies: Movie[] = [
  {
    id: 1, title: "The Godfather", year: 1972, director: "Francis Ford Coppola",
    directorPhoto: `${IMG}/IwGgkmW6IoJ9vuNF0T9CU3FYUX.jpg`,
    cast: [
      { name: "Marlon Brando", character: "Vito Corleone", profilePath: "/iyO183LVAJ0I4ZkNibINPjfAjCP.jpg" },
      { name: "Al Pacino", character: "Michael Corleone", profilePath: "/m8HAAjq1T75JypKk0v1FFQn4ysZ.jpg" },
      { name: "James Caan", character: "Sonny Corleone", profilePath: "/v3flJtQEyczxENi29yJyvnN6Lvt.jpg" },
      { name: "Robert Duvall", character: "Tom Hagen", profilePath: "/ybMmK25h4IVtfE7qrnlVp47RQlh.jpg" },
      { name: "Diane Keaton", character: "Kay Adams", profilePath: null },
    ],
    writers: ["Mario Puzo", "Francis Ford Coppola"], genre: "Drama",
    tagline: "An offer you can't refuse.",
    plotKeywords: ["mafia", "family", "power", "crime", "New York"],
    posterUrl: `${POSTER}/3bhkrj58Vtu7enYsRolD1fZdja1.jpg`
  },
  {
    id: 2, title: "Pulp Fiction", year: 1994, director: "Quentin Tarantino",
    directorPhoto: `${IMG}/1gjcpAa99FAOWGnrUvHEXXsRs7o.jpg`,
    cast: [
      { name: "John Travolta", character: "Vincent Vega", profilePath: "/zyDLuyohFiON7QliYyP8hnxu2eX.jpg" },
      { name: "Samuel L. Jackson", character: "Jules Winnfield", profilePath: "/AiAYAqwpM5xmiFrAIeQvUXDCVvo.jpg" },
      { name: "Uma Thurman", character: "Mia Wallace", profilePath: "/sBgAZWi3o4FsnaTvnTNtK6jpQcF.jpg" },
      { name: "Bruce Willis", character: "Butch Coolidge", profilePath: "/w3aXr1e7gQCn8MSp1vW4sXHn99P.jpg" },
      { name: "Tim Roth", character: "Pumpkin", profilePath: null },
    ],
    writers: ["Quentin Tarantino", "Roger Avary"], genre: "Thriller",
    tagline: "You won't know the facts until you've seen the fiction.",
    plotKeywords: ["hitman", "briefcase", "dance", "adrenaline", "nonlinear"],
    posterUrl: `${POSTER}/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg`
  },
  {
    id: 3, title: "The Shawshank Redemption", year: 1994, director: "Frank Darabont",
    directorPhoto: `${IMG}/vZ50guP86otYTiBSGfi35GNHWVf.jpg`,
    cast: [
      { name: "Tim Robbins", character: "Andy Dufresne", profilePath: "/3FfJMIVwXgsIXbAT8ECBSZJAncR.jpg" },
      { name: "Morgan Freeman", character: "Red", profilePath: "/jPsLqiYGSofU4s6BjrxnefMfabb.jpg" },
      { name: "Bob Gunton", character: "Warden Norton", profilePath: "/ulbVvuBToBN3aCGcV028hwO0MOP.jpg" },
      { name: "William Sadler", character: "Heywood", profilePath: "/xC9sijoDnjS3oDZ5eszcGKHKAOp.jpg" },
    ],
    writers: ["Stephen King", "Frank Darabont"], genre: "Drama",
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    plotKeywords: ["prison", "escape", "friendship", "hope", "corruption"],
    posterUrl: `${POSTER}/9cjIGRiQZ1kHFsURYClYmxFOGch.jpg`
  },
  {
    id: 4, title: "Jaws", year: 1975, director: "Steven Spielberg",
    directorPhoto: `${IMG}/tZxcg19YQ3e8fJ0pOs7hjlnmmr6.jpg`,
    cast: [
      { name: "Roy Scheider", character: "Chief Brody", profilePath: "/y0MTwkCm5fIKjM1xH90tZbjAHql.jpg" },
      { name: "Robert Shaw", character: "Quint", profilePath: "/bU4IJ4J1mgrriRTdQ4BOemoHvtt.jpg" },
      { name: "Richard Dreyfuss", character: "Matt Hooper", profilePath: "/q2BPu6zWwFtnzQfpl4fgbKqURXM.jpg" },
      { name: "Lorraine Gary", character: "Ellen Brody", profilePath: "/6JKNdZopypnFnD9xSSlDs6YTHMC.jpg" },
    ],
    writers: ["Peter Benchley", "Carl Gottlieb"], genre: "Thriller",
    tagline: "Don't go in the water.",
    plotKeywords: ["shark", "beach", "island", "ocean", "summer"],
    posterUrl: `${POSTER}/lxM6kqilAdpdhqUl2biYp5frUxE.jpg`
  },
  {
    id: 5, title: "Alien", year: 1979, director: "Ridley Scott",
    directorPhoto: `${IMG}/zABJmN9opmqD4orWl3KSdCaSo7Q.jpg`,
    cast: [
      { name: "Sigourney Weaver", character: "Ripley", profilePath: "/wTSnfktNBLd6kwQxgvkqYw6vEon.jpg" },
      { name: "Tom Skerritt", character: "Dallas", profilePath: "/oWFCyBLm1lsbsbT5Nmx3SPMaqFZ.jpg" },
      { name: "John Hurt", character: "Kane", profilePath: "/bjNSzt1d7uK3q5PbtFXUJrRt4qg.jpg" },
      { name: "Ian Holm", character: "Ash", profilePath: null },
    ],
    writers: ["Dan O'Bannon", "Ronald Shusett"], genre: "Sci-Fi",
    tagline: "In space no one can hear you scream.",
    plotKeywords: ["spacecraft", "creature", "survival", "android", "xenomorph"],
    posterUrl: `${POSTER}/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg`
  },
  {
    id: 6, title: "The Silence of the Lambs", year: 1991, director: "Jonathan Demme",
    directorPhoto: `${IMG}/w9Lw3xTEFQUYELkl9AH5i3p5OhJ.jpg`,
    cast: [
      { name: "Jodie Foster", character: "Clarice Starling", profilePath: "/8DAd9knKivHR4CCStxlNEQXzjIh.jpg" },
      { name: "Anthony Hopkins", character: "Hannibal Lecter", profilePath: "/u8AAGd2tF6uQcj9TXgyR4q8kn4H.jpg" },
      { name: "Scott Glenn", character: "Jack Crawford", profilePath: "/keBKcMPojtRTi5ImLXOoKDmDbqU.jpg" },
      { name: "Ted Levine", character: "Buffalo Bill", profilePath: "/451KSkowLW6M2Au0wBKZZcidgGm.jpg" },
    ],
    writers: ["Thomas Harris", "Ted Tally"], genre: "Thriller",
    tagline: "To enter the mind of a killer she must challenge the mind of a madman.",
    plotKeywords: ["serial killer", "FBI", "psychiatrist", "cannibal", "investigation"],
    posterUrl: `${POSTER}/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg`
  },
  {
    id: 7, title: "Back to the Future", year: 1985, director: "Robert Zemeckis",
    directorPhoto: `${IMG}/lPYDQ5LYNJ12rJZENtyASmVZ1Ql.jpg`,
    cast: [
      { name: "Michael J. Fox", character: "Marty McFly", profilePath: "/2JB4FMgQmnhbBlQ4SxWFN9EIVDi.jpg" },
      { name: "Christopher Lloyd", character: "Doc Brown", profilePath: "/nxVjpyb3UrfbPZnEyDNlQVlFAs5.jpg" },
      { name: "Lea Thompson", character: "Lorraine Baines", profilePath: "/85E9NTEfkRdUdK4kTrrnk5of25w.jpg" },
      { name: "Crispin Glover", character: "George McFly", profilePath: "/imBnLpSXvg61qDDdEfvL6R4ITKt.jpg" },
    ],
    writers: ["Robert Zemeckis", "Bob Gale"], genre: "Sci-Fi",
    tagline: "He's the only kid ever to get into trouble before he was born.",
    plotKeywords: ["time travel", "DeLorean", "1955", "high school", "lightning"],
    posterUrl: `${POSTER}/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg`
  },
  {
    id: 8, title: "Goodfellas", year: 1990, director: "Martin Scorsese",
    directorPhoto: `${IMG}/g3DjfKsgZQWZiw30I20hZVk1oMX.jpg`,
    cast: [
      { name: "Ray Liotta", character: "Henry Hill", profilePath: "/rhaCUi04uEXDFvuPM5Drj1AprE6.jpg" },
      { name: "Robert De Niro", character: "Jimmy Conway", profilePath: "/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg" },
      { name: "Joe Pesci", character: "Tommy DeVito", profilePath: "/zbAdhqbMfRXSz26TjxJvB5f2eL5.jpg" },
      { name: "Lorraine Bracco", character: "Karen Hill", profilePath: "/tAtpCzN4sTOy1RHpMpJj52zTO4S.jpg" },
    ],
    writers: ["Nicholas Pileggi", "Martin Scorsese"], genre: "Drama",
    tagline: "Three decades of life in the Mafia.",
    plotKeywords: ["gangster", "betrayal", "witness protection", "heist", "cocaine"],
    posterUrl: `${POSTER}/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg`
  },
  {
    id: 9, title: "The Matrix", year: 1999, director: "Lana Wachowski",
    directorPhoto: `${IMG}/5KuRHnoH8UkSCFHMKf4YjKOvzOM.jpg`,
    cast: [
      { name: "Keanu Reeves", character: "Neo", profilePath: "/8RZLOyYGsoRe9p44q3xin9QkMHv.jpg" },
      { name: "Laurence Fishburne", character: "Morpheus", profilePath: "/2GbXERENPpl5MmlqOLlPVaVtifD.jpg" },
      { name: "Carrie-Anne Moss", character: "Trinity", profilePath: "/xD4jTA3KmVp5Rq3aHcymL9DUGjD.jpg" },
      { name: "Hugo Weaving", character: "Agent Smith", profilePath: "/t4ScpYIHlXVD41scEyiGdQDYflX.jpg" },
    ],
    writers: ["Lana Wachowski", "Lilly Wachowski"], genre: "Sci-Fi",
    tagline: "Welcome to the Real World.",
    plotKeywords: ["simulation", "chosen one", "martial arts", "red pill", "machines"],
    posterUrl: `${POSTER}/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg`
  },
  {
    id: 10, title: "Psycho", year: 1960, director: "Alfred Hitchcock",
    directorPhoto: `${IMG}/108fiNM6poRieMg7RIqLJRxdAwG.jpg`,
    cast: [
      { name: "Anthony Perkins", character: "Norman Bates", profilePath: "/7FipKwmg2woHNvt5ATeXLBirHXs.jpg" },
      { name: "Janet Leigh", character: "Marion Crane", profilePath: "/2dv9IqJEx31RSoH7xAHlJZXF5uB.jpg" },
      { name: "Vera Miles", character: "Lila Crane", profilePath: "/9PDTsJnBfrAlvVPOBBFS3ehN8lD.jpg" },
      { name: "John Gavin", character: "Sam Loomis", profilePath: "/n8vlG1PRtNzv6vlwjTNK7UnoKr0.jpg" },
    ],
    writers: ["Joseph Stefano", "Robert Bloch"], genre: "Horror",
    tagline: "A new—and altogether different—screen excitement!!!",
    plotKeywords: ["motel", "shower", "split personality", "murder", "theft"],
    posterUrl: `${POSTER}/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg`
  },
  {
    id: 11, title: "Raiders of the Lost Ark", year: 1981, director: "Steven Spielberg",
    directorPhoto: `${IMG}/tZxcg19YQ3e8fJ0pOs7hjlnmmr6.jpg`,
    cast: [
      { name: "Harrison Ford", character: "Indiana Jones", profilePath: "/zVnHagUvXkR2StdOtquEwsiwSVt.jpg" },
      { name: "Karen Allen", character: "Marion Ravenwood", profilePath: "/eJszpndpRzrXbSlz7RUlApoTykn.jpg" },
      { name: "Paul Freeman", character: "Belloq", profilePath: "/mLDHLughdhSe6AqsklX0Zhjk9Rx.jpg" },
      { name: "John Rhys-Davies", character: "Sallah", profilePath: "/qpXl1YnqQsUKYEDm3BB2zK5wbhe.jpg" },
    ],
    writers: ["Lawrence Kasdan", "George Lucas"], genre: "Action",
    tagline: "The Return of the Great Adventure.",
    plotKeywords: ["archaeologist", "ark", "Nazis", "adventure", "Egypt"],
    posterUrl: `${POSTER}/ceG9VzoRAVGwivFU403Wc0AHAb0.jpg`
  },
  {
    id: 12, title: "The Shining", year: 1980, director: "Stanley Kubrick",
    directorPhoto: `${IMG}/yFT0VyIelI9aegZrsAwOG5iVP4v.jpg`,
    cast: [
      { name: "Jack Nicholson", character: "Jack Torrance", profilePath: "/hBHcQIEa6P48HQAlLZkh0eKSSkG.jpg" },
      { name: "Shelley Duvall", character: "Wendy Torrance", profilePath: "/zwscEWl7QLiOsfsvzGXFjAQCVp3.jpg" },
      { name: "Danny Lloyd", character: "Danny Torrance", profilePath: "/5pEmugZ6m25RB0cXbL4t5D4kZAO.jpg" },
      { name: "Scatman Crothers", character: "Dick Hallorann", profilePath: "/fcyBuyPEFLphQTiBDXLE9Z4p6ne.jpg" },
    ],
    writers: ["Stephen King", "Stanley Kubrick"], genre: "Horror",
    tagline: "A masterpiece of modern horror.",
    plotKeywords: ["hotel", "isolation", "twins", "axe", "winter"],
    posterUrl: `${POSTER}/nRj5511mZdTl4saWEPoj9QroTIu.jpg`
  },
  {
    id: 13, title: "Forrest Gump", year: 1994, director: "Robert Zemeckis",
    directorPhoto: `${IMG}/lPYDQ5LYNJ12rJZENtyASmVZ1Ql.jpg`,
    cast: [
      { name: "Tom Hanks", character: "Forrest Gump", profilePath: "/oFvZoKI6lvU03n4YoNGAll9rkas.jpg" },
      { name: "Robin Wright", character: "Jenny Curran", profilePath: "/d3rIv0y2p0jMsQ7ViR7O1606NZa.jpg" },
      { name: "Gary Sinise", character: "Lt. Dan Taylor", profilePath: "/olRjiV8ZhBixQiTvrGwXhpVXxsV.jpg" },
      { name: "Sally Field", character: "Mrs. Gump", profilePath: "/5fBK36MdmdwQQMuP0W70rXADXih.jpg" },
    ],
    writers: ["Winston Groom", "Eric Roth"], genre: "Drama",
    tagline: "Life is like a box of chocolates.",
    plotKeywords: ["running", "Vietnam", "shrimp", "ping pong", "feather"],
    posterUrl: `${POSTER}/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg`
  },
  {
    id: 14, title: "Die Hard", year: 1988, director: "John McTiernan",
    directorPhoto: `${IMG}/yVfDkVbgQHD1A7JSV8Z47EjB1mU.jpg`,
    cast: [
      { name: "Bruce Willis", character: "John McClane", profilePath: "/w3aXr1e7gQCn8MSp1vW4sXHn99P.jpg" },
      { name: "Alan Rickman", character: "Hans Gruber", profilePath: "/nKl8ZRYjBJya7aj7phJUyrtSll6.jpg" },
      { name: "Bonnie Bedelia", character: "Holly Gennaro", profilePath: "/2dCd7HGOfmn4x7v97EcNIwy12io.jpg" },
      { name: "Reginald VelJohnson", character: "Sgt. Al Powell", profilePath: "/r0F5y1PAQEDM08MBj3oI1IIX4gi.jpg" },
    ],
    writers: ["Jeb Stuart", "Steven E. de Souza"], genre: "Action",
    tagline: "Forty stories of sheer adventure!",
    plotKeywords: ["skyscraper", "hostage", "Christmas", "barefoot", "terrorists"],
    posterUrl: `${POSTER}/yFihWxQcmqcaBR31QM6Y8gT6aYV.jpg`
  },
  {
    id: 15, title: "Ghostbusters", year: 1984, director: "Ivan Reitman",
    directorPhoto: `${IMG}/zqD7JCRwqWVAdFqspDU6kzdqkan.jpg`,
    cast: [
      { name: "Bill Murray", character: "Peter Venkman", profilePath: "/nnCsJc9x3ZiG3AFyiyc3FPehppy.jpg" },
      { name: "Dan Aykroyd", character: "Ray Stantz", profilePath: "/iVMmeVJx8IpCEjlGBZWzIWvX5Qo.jpg" },
      { name: "Harold Ramis", character: "Egon Spengler", profilePath: "/kmTMTxthkDAsygk3Am4IUSVYYRi.jpg" },
      { name: "Sigourney Weaver", character: "Dana Barrett", profilePath: "/wTSnfktNBLd6kwQxgvkqYw6vEon.jpg" },
    ],
    writers: ["Dan Aykroyd", "Harold Ramis"], genre: "Comedy",
    tagline: "Who you gonna call?",
    plotKeywords: ["ghosts", "proton pack", "New York", "Stay Puft", "containment"],
    posterUrl: `${POSTER}/6AUBjoDiudOFkNfMgLgMvEiEjGF.jpg`
  },
  {
    id: 16, title: "Blade Runner", year: 1982, director: "Ridley Scott",
    directorPhoto: `${IMG}/zABJmN9opmqD4orWl3KSdCaSo7Q.jpg`,
    cast: [
      { name: "Harrison Ford", character: "Rick Deckard", profilePath: "/zVnHagUvXkR2StdOtquEwsiwSVt.jpg" },
      { name: "Rutger Hauer", character: "Roy Batty", profilePath: "/45kp2fmVWloddrz7LF94MmT4tWf.jpg" },
      { name: "Sean Young", character: "Rachael", profilePath: "/yfJADYt6xYPpg1g7Z7TTW0bcL2s.jpg" },
      { name: "Daryl Hannah", character: "Pris", profilePath: null },
    ],
    writers: ["Hampton Fancher", "David Peoples"], genre: "Sci-Fi",
    tagline: "Man has made his match... now it's his problem.",
    plotKeywords: ["replicant", "dystopia", "rain", "origami", "retirement"],
    posterUrl: `${POSTER}/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg`
  },
  {
    id: 17, title: "The Exorcist", year: 1973, director: "William Friedkin",
    directorPhoto: null,
    cast: [
      { name: "Ellen Burstyn", character: "Chris MacNeil", profilePath: null },
      { name: "Max von Sydow", character: "Father Merrin", profilePath: null },
      { name: "Linda Blair", character: "Regan", profilePath: null },
      { name: "Jason Miller", character: "Father Karras", profilePath: null },
    ],
    writers: ["William Peter Blatty"], genre: "Horror",
    tagline: "Something almost beyond comprehension is happening to a girl on this street.",
    plotKeywords: ["possession", "demon", "priest", "Georgetown", "pea soup"],
    posterUrl: `${POSTER}/4ucLGcXVVSVnsfkGtbLY4XAius8.jpg`
  },
  {
    id: 18, title: "Groundhog Day", year: 1993, director: "Harold Ramis",
    directorPhoto: `${IMG}/kmTMTxthkDAsygk3Am4IUSVYYRi.jpg`,
    cast: [
      { name: "Bill Murray", character: "Phil Connors", profilePath: "/nnCsJc9x3ZiG3AFyiyc3FPehppy.jpg" },
      { name: "Andie MacDowell", character: "Rita Hanson", profilePath: "/akeheO4i3cR1HpSU8yu9HrLcsKm.jpg" },
      { name: "Chris Elliott", character: "Larry", profilePath: "/oZFGgyDCZaanGfco1UdfxM4rHAJ.jpg" },
      { name: "Stephen Tobolowsky", character: "Ned Ryerson", profilePath: "/uL8yfcm0dCFYFQt052kczVQVvac.jpg" },
    ],
    writers: ["Danny Rubin", "Harold Ramis"], genre: "Comedy",
    tagline: "He's having the worst day of his life... over, and over...",
    plotKeywords: ["time loop", "weatherman", "Pennsylvania", "February", "self-improvement"],
    posterUrl: `${POSTER}/gCgt1WARPdyGnbFSoHsMfRNL0Kb.jpg`
  },
  {
    id: 19, title: "Fight Club", year: 1999, director: "David Fincher",
    directorPhoto: `${IMG}/tpEczFclQZeKAiCeKZZ0adRvtfz.jpg`,
    cast: [
      { name: "Brad Pitt", character: "Tyler Durden", profilePath: "/cckcYc2v0yh1tc9QjRelptcOBko.jpg" },
      { name: "Edward Norton", character: "The Narrator", profilePath: "/8nytsqL59SFJTVYVrN72k6qkGgJ.jpg" },
      { name: "Helena Bonham Carter", character: "Marla Singer", profilePath: "/hJMbNSPJ2PCahsP3rNEU39C8GWU.jpg" },
      { name: "Meat Loaf", character: "Robert Paulson", profilePath: "/7gKLR1u46OB8WJ6m06LemNBCMx6.jpg" },
    ],
    writers: ["Chuck Palahniuk", "Jim Uhls"], genre: "Thriller",
    tagline: "Mischief. Mayhem. Soap.",
    plotKeywords: ["insomnia", "soap", "underground", "anarchy", "twist"],
    posterUrl: `${POSTER}/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg`
  },
  {
    id: 20, title: "Jurassic Park", year: 1993, director: "Steven Spielberg",
    directorPhoto: `${IMG}/tZxcg19YQ3e8fJ0pOs7hjlnmmr6.jpg`,
    cast: [
      { name: "Sam Neill", character: "Alan Grant", profilePath: "/iIfuxalf37xUayuGyK0zG7z6WEZ.jpg" },
      { name: "Laura Dern", character: "Ellie Sattler", profilePath: "/gB9PnGEvxKg33OSlcqptQwTBwPE.jpg" },
      { name: "Jeff Goldblum", character: "Ian Malcolm", profilePath: "/kcyEPgYtBP5Pm6LLeLGfXKjYovL.jpg" },
      { name: "Richard Attenborough", character: "John Hammond", profilePath: "/6DRvtpCCmgDT90EKifGTDN1sXY2.jpg" },
    ],
    writers: ["Michael Crichton", "David Koepp"], genre: "Sci-Fi",
    tagline: "An adventure 65 million years in the making.",
    plotKeywords: ["dinosaurs", "theme park", "DNA", "island", "chaos theory"],
    posterUrl: `${POSTER}/oU7Oez2kCMptmBjS7ISwLuuA46l.jpg`
  },
  {
    id: 21, title: "The Big Lebowski", year: 1998, director: "Joel Coen",
    directorPhoto: `${IMG}/rgVaJNkZCgMarUcZuUAsVfXMWk3.jpg`,
    cast: [
      { name: "Jeff Bridges", character: "The Dude", profilePath: "/6ItMc51AeORUz6iIQxGnX3HEZaB.jpg" },
      { name: "John Goodman", character: "Walter Sobchak", profilePath: "/yyYqoyKHO7hE1zpgEV2XlqYWcNV.jpg" },
      { name: "Julianne Moore", character: "Maude Lebowski", profilePath: "/3YF19rWusxWfEI59ZM33dFhasRq.jpg" },
      { name: "Steve Buscemi", character: "Donny", profilePath: "/n0pZumkrcZrAPMoPq684RhYnjPV.jpg" },
    ],
    writers: ["Joel Coen", "Ethan Coen"], genre: "Comedy",
    tagline: "Her life was in their hands. Now her toe is in the mail.",
    plotKeywords: ["bowling", "rug", "kidnapping", "White Russian", "nihilists"],
    posterUrl: `${POSTER}/9mprbw31MGdd66LR0AQKaDKEFOE.jpg`
  },
  {
    id: 22, title: "Terminator 2: Judgment Day", year: 1991, director: "James Cameron",
    directorPhoto: `${IMG}/9NAZnTjBQ9WcXAQEzZpKy4vdQto.jpg`,
    cast: [
      { name: "Arnold Schwarzenegger", character: "T-800", profilePath: "/2marNcjIfCUE5Z2HyrcEiJHPbsA.jpg" },
      { name: "Linda Hamilton", character: "Sarah Connor", profilePath: "/7FNn9Z5xkRS9EFbGL2tpmpph9xV.jpg" },
      { name: "Robert Patrick", character: "T-1000", profilePath: "/qRv2Es9rZoloullTbzss3I5j1Mp.jpg" },
      { name: "Edward Furlong", character: "John Connor", profilePath: "/gzMDzH0UDXE4vS0xPhD1M8oTymo.jpg" },
    ],
    writers: ["James Cameron", "William Wisher"], genre: "Action",
    tagline: "It's nothing personal.",
    plotKeywords: ["cyborg", "future", "liquid metal", "Skynet", "nuclear"],
    posterUrl: `${POSTER}/weVXMD5QBGeQil4HEATZqAkXvLi.jpg`
  },
  {
    id: 23, title: "Casablanca", year: 1942, director: "Michael Curtiz",
    directorPhoto: `${IMG}/AnxPuEsdjPTJ6uIaHY0KdgBeu7t.jpg`,
    cast: [
      { name: "Humphrey Bogart", character: "Rick Blaine", profilePath: "/4pk2VbOb2td7iBZyir6Ji46HH4N.jpg" },
      { name: "Ingrid Bergman", character: "Ilsa Lund", profilePath: "/jXEE0P6705JbMAJ2nwtHjmqkd5F.jpg" },
      { name: "Paul Henreid", character: "Victor Laszlo", profilePath: "/kqlDSharpQjqeNVS5BZkqqJl3ZF.jpg" },
      { name: "Claude Rains", character: "Captain Renault", profilePath: "/agbKGRcw65QRfMPm1aDijUL1Lqd.jpg" },
    ],
    writers: ["Julius Epstein", "Philip Epstein"], genre: "Drama",
    tagline: "They had a date with fate in Casablanca!",
    plotKeywords: ["wartime", "nightclub", "letters of transit", "love triangle", "Morocco"],
    posterUrl: `${POSTER}/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg`
  },
  {
    id: 24, title: "Mad Max: Fury Road", year: 2015, director: "George Miller",
    directorPhoto: `${IMG}/35NQ8HjFXQlGYDz9UkhT08lKl5C.jpg`,
    cast: [
      { name: "Tom Hardy", character: "Max Rockatansky", profilePath: "/scbbuyWX3yuMjDlm1etAljrbCr0.jpg" },
      { name: "Charlize Theron", character: "Furiosa", profilePath: "/ie1KbeYFG5E0GVr1QP7tDNuXvga.jpg" },
      { name: "Nicholas Hoult", character: "Nux", profilePath: "/5hJutiYSr46ooDx4NUDGhGiONKG.jpg" },
      { name: "Hugh Keays-Byrne", character: "Immortan Joe", profilePath: "/7XSPjKNwmyEPMnmoVSQ42ykMz6M.jpg" },
    ],
    writers: ["George Miller", "Brendan McCarthy"], genre: "Action",
    tagline: "What a lovely day!",
    plotKeywords: ["desert", "chase", "war rig", "wasteland", "water"],
    posterUrl: `${POSTER}/8tZYtuWezp8JbcsvHYO0O46tFBO.jpg`
  },
  {
    id: 25, title: "Get Out", year: 2017, director: "Jordan Peele",
    directorPhoto: `${IMG}/kFUKn5g3ebpyZ3CSZZZo2HFWRNQ.jpg`,
    cast: [
      { name: "Daniel Kaluuya", character: "Chris Washington", profilePath: "/jj2kZqJobjom36wlhlYhc38nTwN.jpg" },
      { name: "Allison Williams", character: "Rose Armitage", profilePath: "/5Jy9HELKS1OYg7moRl8870OSfJq.jpg" },
      { name: "Bradley Whitford", character: "Dean Armitage", profilePath: "/hy3jwrcpmEpM7jLkrhlqQb1TfGN.jpg" },
      { name: "Catherine Keener", character: "Missy Armitage", profilePath: "/n4CTwGszs6cwS1wJRlDQ5Mlh7Ex.jpg" },
    ],
    writers: ["Jordan Peele"], genre: "Horror",
    tagline: "Just because you're invited, doesn't mean you're welcome.",
    plotKeywords: ["hypnosis", "sunken place", "suburb", "deer", "teacup"],
    posterUrl: `${POSTER}/qGZIJIB0FU2sMBkNtvgTdPGhcoT.jpg`
  },
  {
    id: 26, title: "The Princess Bride", year: 1987, director: "Rob Reiner",
    directorPhoto: `${IMG}/rcmPU3YlhHQVzZlV197qhmRsgEL.jpg`,
    cast: [
      { name: "Cary Elwes", character: "Westley", profilePath: "/9UszBdQJ9PmyBydIeIBxlStozhW.jpg" },
      { name: "Robin Wright", character: "Buttercup", profilePath: "/d3rIv0y2p0jMsQ7ViR7O1606NZa.jpg" },
      { name: "Mandy Patinkin", character: "Inigo Montoya", profilePath: "/1PeZ6roZvkcoyZZbvoSIWTgGe3a.jpg" },
      { name: "Wallace Shawn", character: "Vizzini", profilePath: null },
    ],
    writers: ["William Goldman"], genre: "Comedy",
    tagline: "She gets kidnapped. He gets killed. But it all ends up okay.",
    plotKeywords: ["true love", "sword fight", "pirate", "miracle", "inconceivable"],
    posterUrl: `${POSTER}/gpMV0fWNgQlchmIYMKEwCzFmJmE.jpg`
  },
  {
    id: 27, title: "Inception", year: 2010, director: "Christopher Nolan",
    directorPhoto: `${IMG}/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg`,
    cast: [
      { name: "Leonardo DiCaprio", character: "Cobb", profilePath: "/vo4fltT9zZ1kH8nhLetz8MED6jp.jpg" },
      { name: "Joseph Gordon-Levitt", character: "Arthur", profilePath: "/z2FA8js799xqtfiFjBTicFYdfk.jpg" },
      { name: "Elliot Page", character: "Ariadne", profilePath: "/nXO8DE4biVXY4UDYP0NdIY1zvXS.jpg" },
      { name: "Tom Hardy", character: "Eames", profilePath: "/scbbuyWX3yuMjDlm1etAljrbCr0.jpg" },
    ],
    writers: ["Christopher Nolan"], genre: "Sci-Fi",
    tagline: "Your mind is the scene of the crime.",
    plotKeywords: ["dreams", "layers", "totem", "limbo", "spinning top"],
    posterUrl: `${POSTER}/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg`
  },
  {
    id: 28, title: "Ferris Bueller's Day Off", year: 1986, director: "John Hughes",
    directorPhoto: `${IMG}/7QBh9D3Qjf667Q549VeJAAV7O38.jpg`,
    cast: [
      { name: "Matthew Broderick", character: "Ferris Bueller", profilePath: "/2Pq8pwOX5ZFfT2p5pNLGfvUi9Pp.jpg" },
      { name: "Alan Ruck", character: "Cameron Frye", profilePath: "/hj7CuWinT12hMKjRhSO4XEMVq7w.jpg" },
      { name: "Mia Sara", character: "Sloane Peterson", profilePath: "/gF1hYh0Rw5qCryiwGAWDdmiLufc.jpg" },
      { name: "Jeffrey Jones", character: "Ed Rooney", profilePath: "/2vlQDwmMlAAEKqdFIey0liR0T1E.jpg" },
    ],
    writers: ["John Hughes"], genre: "Comedy",
    tagline: "One man's struggle to take it easy.",
    plotKeywords: ["school", "skip day", "Ferrari", "Chicago", "fourth wall"],
    posterUrl: `${POSTER}/9LTQMiSMnhABBsjfhGMVer4wEfF.jpg`
  },
  {
    id: 29, title: "No Country for Old Men", year: 2007, director: "Joel Coen",
    directorPhoto: `${IMG}/rgVaJNkZCgMarUcZuUAsVfXMWk3.jpg`,
    cast: [
      { name: "Javier Bardem", character: "Anton Chigurh", profilePath: "/p5xjCovj1uzvA2SXrWLH78Nh1Jf.jpg" },
      { name: "Josh Brolin", character: "Llewelyn Moss", profilePath: "/sX2etBbIkxRaCsATyw5ZpOVMPTD.jpg" },
      { name: "Tommy Lee Jones", character: "Ed Tom Bell", profilePath: "/mCiZNRAzbnPojJEZwVZWLw9kzxR.jpg" },
      { name: "Woody Harrelson", character: "Carson Wells", profilePath: "/igxYDQBbTEdAqaJxaW6ffqswmUU.jpg" },
    ],
    writers: ["Joel Coen", "Ethan Coen"], genre: "Thriller",
    tagline: "There are no clean getaways.",
    plotKeywords: ["coin toss", "desert", "money", "cattle gun", "fate"],
    posterUrl: `${POSTER}/bj1v6YKF8yHqA489GFfPC6FJR0C.jpg`
  },
  {
    id: 30, title: "Parasite", year: 2019, director: "Bong Joon-ho",
    directorPhoto: `${IMG}/stwnTvZAoD8gEJEDHpDQyLCyDy5.jpg`,
    cast: [
      { name: "Song Kang-ho", character: "Ki-taek", profilePath: "/7dw9wIpFZ5nJZ3zqrue8t7hUUgQ.jpg" },
      { name: "Lee Sun-kyun", character: "Dong-ik", profilePath: "/nHFBbSFohzOUOvMxPVwe3Es2nJw.jpg" },
      { name: "Cho Yeo-jeong", character: "Yeon-kyo", profilePath: "/5MgWM8pkUiYkj9MEaEpO0Ir1FD9.jpg" },
      { name: "Choi Woo-shik", character: "Ki-woo", profilePath: "/hRDiuKWwe156zRjEu826eci7H3r.jpg" },
    ],
    writers: ["Bong Joon-ho", "Han Jin-won"], genre: "Thriller",
    tagline: "Act like you own the place.",
    plotKeywords: ["class", "basement", "infiltration", "smell", "stairs"],
    posterUrl: `${POSTER}/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg`
  },
];

export const allMovieTitles = movies.map(m => m.title);

/** Helper to get full headshot URL from a profilePath */
export function getHeadshotUrl(profilePath: string | null): string | null {
  if (!profilePath) return null;
  return `https://image.tmdb.org/t/p/w185${profilePath}`;
}
