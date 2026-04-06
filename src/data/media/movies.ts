export interface Movie {
  title: string;
  year: string;
  rating: number;
  duration: string;
  genre: string[];
  poster: string;
  description: string;
  type: "movie" | "series";
}

export const movies: Movie[] = [
  {
    title: "Om Shanti Om",
    year: "2007",
    rating: 6.7,
    duration: "2h 42m",
    genre: ["Drama", "Action", "Romance"],
    poster: "https://image.tmdb.org/t/p/original/2mnqkI871E0thcIwsB6K6Bhemb2.jpg",
    description:
      "A struggling actor's life changes dramatically after he witnesses a murder and is reborn as a wealthy family's son to seek revenge.",
    type: "movie",
  },
  {
    title: "Mission: Impossible Series",
    year: "1996-2024",
    rating: 7.5,
    duration: "Series",
    genre: ["Action", "Thriller", "Spy"],
    poster: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
    description:
      "An IMF agent takes on various high-risk missions to protect the world from dangerous threats.",
    type: "movie",
  },
  {
    title: "The Dark Knight Trilogy",
    year: "2005-2012",
    rating: 9.0,
    duration: "Series",
    genre: ["Action", "Drama", "Crime"],
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description:
      "Bruce Wayne's journey as Batman, from his origins to his final sacrifice for Gotham City.",
    type: "movie",
  },
  {
    title: "The Bourne Series",
    year: "2002-2016",
    rating: 7.9,
    duration: "Series of 5 films",
    genre: ["Action", "Mystery", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/2smjeyT38DOZYMhdNHreVGJWRMF.jpg",
    description:
      "A CIA assassin with amnesia tries to uncover his true identity while evading government agents.",
    type: "movie",
  },
  {
    title: "James Bond Series",
    year: "1962-2021",
    rating: 7.7,
    duration: "Series of 25 films",
    genre: ["Action", "Adventure", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg",
    description:
      "The adventures of British Secret Service agent James Bond, code-named 007.",
    type: "movie",
  },
  {
    title: "Hercule Poirot Collection",
    year: "1974-2022",
    rating: 7.5,
    duration: "Multiple films",
    genre: ["Crime", "Drama", "Mystery"],
    poster: "https://image.tmdb.org/t/p/w500/kVr5zIAFSPRQ57Y1zE7KzmhzdMQ.jpg",
    description:
      "Agatha Christie's famous detective solves complex murder mysteries with his 'little grey cells'.",
    type: "movie",
  },
  {
    title: "Sherlock Holmes Series",
    year: "2009-2011",
    rating: 7.6,
    duration: "2 films",
    genre: ["Action", "Adventure", "Mystery"],
    poster: "https://image.tmdb.org/t/p/w500/momkKuWburNTqKBF6ez7rvhYVhE.jpg",
    description:
      "Detective Sherlock Holmes and Dr. Watson join forces to solve crimes in Victorian London.",
    type: "movie",
  },
  {
    title: "The Hangover Trilogy",
    year: "2009-2013",
    rating: 7.7,
    duration: "Series of 3 films",
    genre: ["Comedy"],
    poster: "https://image.tmdb.org/t/p/w500/uluhlXubGu1VxU63X9VHCLWDAYP.jpg",
    description:
      "A group of friends experience wild adventures and memory loss during bachelor parties.",
    type: "movie",
  },
  {
    title: "Bhool Bhulaiyaa",
    year: "2007",
    rating: 7.3,
    duration: "2h 39m",
    genre: ["Horror", "Comedy", "Mystery"],
    poster: "https://image.tmdb.org/t/p/original/soRW3p4GlPphHiFkwbqYGrodQ5S.jpg",
    description:
      "An NRI and his wife decide to stay in his ancestral home, paying no heed to the warnings about ghosts. Soon, inexplicable occurrences cause him to call a psychiatrist to help solve the mystery.",
    type: "movie",
  },
  {
    title: "Stree",
    year: "2018-2024",
    rating: 7.6,
    duration: "2 films",
    genre: ["Comedy", "Horror"],
    poster: "https://image.tmdb.org/t/p/original/vkbSB8U9uPN18ssXCf8taetBae.jpg",
    description: "A town is haunted by a mysterious female spirit who targets men.",
    type: "movie",
  },
  {
    title: "Breaking Bad",
    year: "2008-2013",
    rating: 9.5,
    duration: "5 Seasons",
    genre: ["Crime", "Drama", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    description:
      "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's financial future.",
    type: "series",
  },
  {
    title: "Game of Thrones",
    year: "2011-2019",
    rating: 9.3,
    duration: "8 Seasons",
    genre: ["Fantasy", "Drama", "Action"],
    poster: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    description:
      "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.",
    type: "series",
  },
  {
    title: "Rick and Morty",
    year: "2013-Present",
    rating: 9.1,
    duration: "7 Seasons",
    genre: ["Animation", "Adventure", "Comedy"],
    poster: "https://image.tmdb.org/t/p/w500/8kOWDBK6XlPUzckuHDo3wwVRFwt.jpg",
    description:
      "An alcoholic scientist and his grandson go on bizarre adventures across the multiverse.",
    type: "series",
  },
  {
    title: "Suits",
    year: "2011-2019",
    rating: 8.5,
    duration: "9 Seasons",
    genre: ["Comedy", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/vQiryp6LioFxQThywxbC6TuoDjy.jpg",
    description:
      "A talented college dropout starts working as a law associate despite never attending law school.",
    type: "series",
  },
  {
    title: "How I Met Your Mother",
    year: "2005-2014",
    rating: 8.3,
    duration: "9 Seasons",
    genre: ["Comedy", "Romance"],
    poster: "https://image.tmdb.org/t/p/w500/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg",
    description:
      "Ted Mosby recounts to his kids the events that led him to meet their mother.",
    type: "series",
  },
  {
    title: "Friends",
    year: "1994-2004",
    rating: 8.9,
    duration: "10 Seasons",
    genre: ["Comedy", "Romance"],
    poster: "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    description: "Follows the lives of six friends living in New York City.",
    type: "series",
  },
  {
    title: "Brooklyn Nine-Nine",
    year: "2013-2021",
    rating: 8.4,
    duration: "8 Seasons",
    genre: ["Comedy", "Crime"],
    poster: "https://image.tmdb.org/t/p/original/A3SymGlOHefSKbz1bCOz56moupS.jpg",
    description: "The adventures of the 99th precinct of the NYPD.",
    type: "series",
  },
  {
    title: "New Girl",
    year: "2011-2018",
    rating: 7.7,
    duration: "7 Seasons",
    genre: ["Comedy", "Romance"],
    poster: "https://image.tmdb.org/t/p/original/lktCmXmoeR3ikhqE9SLN2IumwUx.jpg",
    description: "After a bad break-up, Jess moves in with three single guys.",
    type: "series",
  },
  {
    title: "Lucifer",
    year: "2016-2021",
    rating: 8.1,
    duration: "6 Seasons",
    genre: ["Crime", "Drama", "Fantasy"],
    poster: "https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg",
    description:
      "The Devil relocates to Los Angeles and opens a nightclub while helping the LAPD solve crimes.",
    type: "series",
  },
  {
    title: "The Three-Body Problem",
    year: "2024",
    rating: 7.9,
    duration: "1 Season",
    genre: ["Drama", "Mystery", "Sci-Fi"],
    poster: "https://image.tmdb.org/t/p/original/sphnjjiYb50SbWMToW7fyGigH1n.jpg",
    description:
      "A young woman's fateful decision in 1960s China reverberates across space and time into the present day.",
    type: "series",
  },
  {
    title: "Castlevania",
    year: "2017-2021",
    rating: 8.3,
    duration: "4 Seasons",
    genre: ["Animation", "Action", "Adventure"],
    poster: "https://image.tmdb.org/t/p/original/noJuAV1S2YQdD3gsy0iLasOAupk.jpg",
    description:
      "A vampire hunter fights to save a city from an army of otherworldly creatures.",
    type: "series",
  },
  {
    title: "The Legend of Vox Machina",
    year: "2022-Present",
    rating: 8.3,
    duration: "2 Seasons",
    genre: ["Animation", "Action", "Adventure"],
    poster: "https://image.tmdb.org/t/p/original/b5A0qkGrZJTyVv3gT6b8clFEz9R.jpg",
    description:
      "A group of misfit adventurers embark on quests in the fantasy world of Exandria.",
    type: "series",
  },
  {
    title: "One Piece",
    year: "2023-Present",
    rating: 8.4,
    duration: "2 Seasons",
    genre: ["Action", "Adventure", "Fantasy"],
    poster: "https://image.tmdb.org/t/p/w500/rVX05xRKS5JhEYQFObCi4lAnZT4.jpg",
    description:
      "Monkey D. Luffy sets off on an adventure to find the fabled treasure One Piece and become King of the Pirates.",
    type: "series",
  },
  {
    title: "Ted Lasso",
    year: "2020-2023",
    rating: 8.8,
    duration: "3 Seasons",
    genre: ["Comedy", "Drama", "Sport"],
    poster: "https://image.tmdb.org/t/p/w500/5fhZdwP1DVJ0FyVH6vrFdHwpXIn.jpg",
    description:
      "An American college football coach is hired to manage a professional soccer team in England despite having no experience.",
    type: "series",
  },
  {
    title: "Attack on Titan",
    year: "2013-2023",
    rating: 9.1,
    duration: "4 Seasons",
    genre: ["Animation", "Action", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    description:
      "Humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid beings. A young boy vows to reclaim the world after a Titan breaches the wall.",
    type: "series",
  },
  {
    title: "Black Bird",
    year: "2022",
    rating: 7.9,
    duration: "1 Season",
    genre: ["Crime", "Drama", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/qu312pwM61NPTr7nexvovCClDNP.jpg",
    description:
      "A convicted drug dealer is transferred to a maximum-security prison to befriend a suspected serial killer and extract a confession.",
    type: "series",
  },
  {
    title: "Dhurandhar 2",
    year: "2025",
    rating: 8.2,
    duration: "1 Season",
    genre: ["Comedy", "Crime", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/ov8vrRLZGoXHpYjSY9Vpv1tHJX7.jpg",
    description:
      "A crafty con man takes on a new high-stakes scheme in this sequel to the hit Indian comedy-thriller.",
    type: "series",
  },
  {
    title: "The Last Dance",
    year: "2020",
    rating: 9.1,
    duration: "1 Season",
    genre: ["Documentary", "Sport"],
    poster: "https://image.tmdb.org/t/p/w500/oVf4xGGbDtwVHiKn8uTuSriY7PH.jpg",
    description:
      "A documentary chronicling Michael Jordan and the Chicago Bulls' dynasty through the lens of their final championship season in 1997-98.",
    type: "series",
  },
  {
    title: "Invincible",
    year: "2021-Present",
    rating: 8.7,
    duration: "3 Seasons",
    genre: ["Animation", "Action", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/yDWJYRAwMNKbIYT8ZB33qy84uzO.jpg",
    description:
      "An adult animated series about Mark Grayson, a teenager who inherits superpowers from his father, the most powerful superhero on Earth.",
    type: "series",
  },
  {
    title: "The Boys",
    year: "2019-Present",
    rating: 8.7,
    duration: "4 Seasons",
    genre: ["Action", "Comedy", "Crime"],
    poster: "https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg",
    description:
      "A group of vigilantes set out to take down corrupt superheroes who abuse their powers.",
    type: "series",
  },
];
