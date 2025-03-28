import { useState } from 'react';
import { Search, Star, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Movie {
  title: string;
  year: string;
  rating: number;
  duration: string;
  genre: string[];
  poster: string;
  description: string;
  type: 'movie' | 'series';
  seasons?: number;
}

const mediaList: Movie[] = [
  // Movies
  {
    title: "Om Shanti Om",
    year: "2007",
    rating: 6.7,
    duration: "2h 42m",
    genre: ["Drama", "Action", "Romance"],
    poster: "https://image.tmdb.org/t/p/original/2mnqkI871E0thcIwsB6K6Bhemb2.jpg",
    description: "A struggling actor's life changes dramatically after he witnesses a murder and is reborn as a wealthy family's son to seek revenge.",
    type: "movie"
  },
  {
    title: "Mission: Impossible Series",
    year: "1996-2024",
    rating: 7.5,
    duration: "Series",
    genre: ["Action", "Thriller", "Spy"],
    poster: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
    description: "An IMF agent takes on various high-risk missions to protect the world from dangerous threats.",
    type: "movie"
  },
  {
    title: "The Dark Knight Trilogy",
    year: "2005-2012",
    rating: 9.0,
    duration: "Series",
    genre: ["Action", "Drama", "Crime"],
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "Bruce Wayne's journey as Batman, from his origins to his final sacrifice for Gotham City.",
    type: "movie"
  },
  {
    title: "The Bourne Series",
    year: "2002-2016",
    rating: 7.9,
    duration: "Series of 5 films",
    genre: ["Action", "Mystery", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/2smjeyT38DOZYMhdNHreVGJWRMF.jpg",
    description: "A CIA assassin with amnesia tries to uncover his true identity while evading government agents.",
    type: "movie"
  },
  {
    title: "James Bond Series",
    year: "1962-2021",
    rating: 7.7,
    duration: "Series of 25 films",
    genre: ["Action", "Adventure", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg",
    description: "The adventures of British Secret Service agent James Bond, code-named 007.",
    type: "movie"
  },
  {
    title: "Hercule Poirot Collection",
    year: "1974-2022",
    rating: 7.5,
    duration: "Multiple films",
    genre: ["Crime", "Drama", "Mystery"],
    poster: "https://image.tmdb.org/t/p/w500/kVr5zIAFSPRQ57Y1zE7KzmhzdMQ.jpg",
    description: "Agatha Christie's famous detective solves complex murder mysteries with his 'little grey cells'.",
    type: "movie"
  },
  {
    title: "Sherlock Holmes Series",
    year: "2009-2011",
    rating: 7.6,
    duration: "2 films",
    genre: ["Action", "Adventure", "Mystery"],
    poster: "https://image.tmdb.org/t/p/w500/momkKuWburNTqKBF6ez7rvhYVhE.jpg",
    description: "Detective Sherlock Holmes and Dr. Watson join forces to solve crimes in Victorian London.",
    type: "movie"
  },
  {
    title: "The Hangover Trilogy",
    year: "2009-2013",
    rating: 7.7,
    duration: "Series of 3 films",
    genre: ["Comedy"],
    poster: "https://image.tmdb.org/t/p/w500/uluhlXubGu1VxU63X9VHCLWDAYP.jpg",
    description: "A group of friends experience wild adventures and memory loss during bachelor parties.",
    type: "movie"
  },
  {
    title: "Bhool Bhulaiyaa",
    year: "2007",
    rating: 7.3,
    duration: "2h 39m",
    genre: ["Horror", "Comedy", "Mystery"],
    poster: "https://image.tmdb.org/t/p/original/soRW3p4GlPphHiFkwbqYGrodQ5S.jpg",
    description: "An NRI and his wife decide to stay in his ancestral home, paying no heed to the warnings about ghosts. Soon, inexplicable occurrences cause him to call a psychiatrist to help solve the mystery.",
    type: "movie"
  },
  {
    title: "Stree",
    year: "2018-2024",
    rating: 7.6,
    duration: "2 films",
    genre: ["Comedy", "Horror"],
    poster: "https://image.tmdb.org/t/p/original/vkbSB8U9uPN18ssXCf8taetBae.jpg",
    description: "A town is haunted by a mysterious female spirit who targets men.",
    type: "movie"
  },

  // TV Shows
  {
    title: "Breaking Bad",
    year: "2008-2013",
    rating: 9.5,
    duration: "5 Seasons",
    genre: ["Crime", "Drama", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    description: "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's financial future.",
    type: "series"
  },
  {
    title: "Game of Thrones",
    year: "2011-2019",
    rating: 9.3,
    duration: "8 Seasons",
    genre: ["Fantasy", "Drama", "Action"],
    poster: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.",
    type: "series"
  },
  {
    title: "Rick and Morty",
    year: "2013-Present",
    rating: 9.1,
    duration: "7 seasons",
    genre: ["Animation", "Adventure", "Comedy"],
    poster: "https://image.tmdb.org/t/p/w500/8kOWDBK6XlPUzckuHDo3wwVRFwt.jpg",
    description: "An alcoholic scientist and his grandson go on bizarre adventures across the multiverse.",
    type: "series",
    seasons: 7
  },
  {
    title: "Suits",
    year: "2011-2019",
    rating: 8.5,
    duration: "9 seasons",
    genre: ["Comedy", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/vQiryp6LioFxQThywxbC6TuoDjy.jpg",
    description: "A talented college dropout starts working as a law associate despite never attending law school.",
    type: "series",
    seasons: 9
  },
  {
    title: "How I Met Your Mother",
    year: "2005-2014",
    rating: 8.3,
    duration: "9 seasons",
    genre: ["Comedy", "Romance"],
    poster: "https://image.tmdb.org/t/p/w500/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg",
    description: "Ted Mosby recounts to his kids the events that led him to meet their mother.",
    type: "series",
    seasons: 9
  },
  {
    title: "Friends",
    year: "1994-2004",
    rating: 8.9,
    duration: "10 seasons",
    genre: ["Comedy", "Romance"],
    poster: "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    description: "Follows the lives of six friends living in New York City.",
    type: "series",
    seasons: 10
  },
  {
    title: "Brooklyn Nine-Nine",
    year: "2013-2021",
    rating: 8.4,
    duration: "8 seasons",
    genre: ["Comedy", "Crime"],
    poster: "https://image.tmdb.org/t/p/original/A3SymGlOHefSKbz1bCOz56moupS.jpg",
    description: "The adventures of the 99th precinct of the NYPD.",
    type: "series",
    seasons: 8
  },
  {
    title: "New Girl",
    year: "2011-2018",
    rating: 7.7,
    duration: "7 seasons",
    genre: ["Comedy", "Romance"],
    poster: "https://image.tmdb.org/t/p/original/lktCmXmoeR3ikhqE9SLN2IumwUx.jpg",
    description: "After a bad break-up, Jess moves in with three single guys.",
    type: "series",
    seasons: 7
  },
  {
    title: "Lucifer",
    year: "2016-2021",
    rating: 8.1,
    duration: "6 seasons",
    genre: ["Crime", "Drama", "Fantasy"],
    poster: "https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg",
    description: "The Devil relocates to Los Angeles and opens a nightclub while helping the LAPD solve crimes.",
    type: "series",
    seasons: 6
  },
  {
    title: "The Three-Body Problem",
    year: "2024",
    rating: 7.9,
    duration: "1 season",
    genre: ["Drama", "Mystery", "Sci-Fi"],
    poster: "https://image.tmdb.org/t/p/original/sphnjjiYb50SbWMToW7fyGigH1n.jpg",
    description: "A young woman's fateful decision in 1960s China reverberates across space and time into the present day.",
    type: "series",
    seasons: 1
  },
  {
    title: "Castlevania",
    year: "2017-2021",
    rating: 8.3,
    duration: "4 seasons",
    genre: ["Animation", "Action", "Adventure"],
    poster: "https://image.tmdb.org/t/p/original/noJuAV1S2YQdD3gsy0iLasOAupk.jpg",
    description: "A vampire hunter fights to save a city from an army of otherworldly creatures.",
    type: "series",
    seasons: 4
  },
  {
    title: "The Legend of Vox Machina",
    year: "2022-Present",
    rating: 8.3,
    duration: "2 seasons",
    genre: ["Animation", "Action", "Adventure"],
    poster: "https://image.tmdb.org/t/p/original/b5A0qkGrZJTyVv3gT6b8clFEz9R.jpg",
    description: "A group of misfit adventurers embark on quests in the fantasy world of Exandria.",
    type: "series",
    seasons: 2
  }
];

export function Movies() {
  const [filter, setFilter] = useState<'all' | 'movies' | 'shows'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Get unique genres
  const allGenres = Array.from(
    new Set(mediaList.flatMap(item => item.genre))
  ).sort();

  // Filter media based on current filters
  const filteredMedia = mediaList.filter(item => {
    const matchesType = filter === 'all' || 
      (filter === 'movies' && item.type === 'movie') || 
      (filter === 'shows' && item.type === 'series');
    
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = !selectedGenre || item.genre.includes(selectedGenre);

    return matchesType && matchesSearch && matchesGenre;
  });

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-b from-yellow-500/20 to-transparent p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">IMDb Style Collection</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search titles..."
                className="bg-white/10 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-4 py-2 rounded-full",
                filter === 'all' ? "bg-yellow-500 text-black" : "bg-white/10"
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter('movies')}
              className={cn(
                "px-4 py-2 rounded-full",
                filter === 'movies' ? "bg-yellow-500 text-black" : "bg-white/10"
              )}
            >
              Movies
            </button>
            <button
              onClick={() => setFilter('shows')}
              className={cn(
                "px-4 py-2 rounded-full",
                filter === 'shows' ? "bg-yellow-500 text-black" : "bg-white/10"
              )}
            >
              TV Shows
            </button>
          </div>

          <select
            value={selectedGenre || ''}
            onChange={(e) => setSelectedGenre(e.target.value || null)}
            className="bg-white/10 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">All Genres</option>
            {allGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div 
              key={item.title}
              className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <div className="aspect-[2/3] relative overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold truncate">{item.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Star className="text-yellow-500" size={16} />
                    <span>{item.rating}</span>
                    <span>•</span>
                    <Clock size={16} />
                    <span>{item.duration}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.genre.map(g => (
                    <span 
                      key={g}
                      className="text-xs px-2 py-1 bg-gray-700 rounded-full"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-400">{item.year}</span>
                  <button className="flex items-center gap-1 text-yellow-500 hover:text-yellow-400">
                    <Info size={16} />
                    More Info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 