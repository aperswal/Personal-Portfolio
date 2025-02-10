import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Book {
  title: string;
  author: string;
  cover: string;
  rating: number;
  status: 'favorites' | 'reading' | 'want-to-read';
  genre: string[];
  yearPublished?: number;
  progress?: number;
}

const initialWantToReadBooks: Book[] = [
  {
    title: "Poor Charlie's Almanack",
    author: "Charles T. Munger",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Business", "Philosophy"],
    yearPublished: 2023
  },
  {
    title: "The Beginning of Infinity",
    author: "David Deutsch",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Philosophy"],
    yearPublished: 2011
  },
  {
    title: "The Evolution of Cooperation",
    author: "Robert Axelrod",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Psychology"],
    yearPublished: 2006
  },
  {
    title: "The Compleat Strategyst",
    author: "J. D. Williams",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Mathematics", "Strategy"],
    yearPublished: 1986
  },
  // Add all Taleb's Incerto series
  {
    title: "Fooled by Randomness",
    author: "Nassim Nicholas Taleb",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Philosophy", "Finance"],
    yearPublished: 2004
  },
  {
    title: "The Black Swan",
    author: "Nassim Nicholas Taleb",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Philosophy", "Finance"],
    yearPublished: 2007
  },
  {
    title: "Antifragile",
    author: "Nassim Nicholas Taleb",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Philosophy", "Finance"],
    yearPublished: 2012
  },
  {
    title: "Skin in the Game",
    author: "Nassim Nicholas Taleb",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Philosophy", "Finance"],
    yearPublished: 2018
  },
  // Add Matt Ridley's books
  {
    title: "The Rational Optimist",
    author: "Matt Ridley",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Economics"],
    yearPublished: 2010
  },
  {
    title: "Genome",
    author: "Matt Ridley",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Biology"],
    yearPublished: 1999
  },
  // Add more science and philosophy books
  {
    title: "The Fabric of Reality",
    author: "David Deutsch",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Physics"],
    yearPublished: 1997
  },
  {
    title: "Objective Knowledge",
    author: "Karl R. Popper",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Philosophy", "Science"],
    yearPublished: 1972
  },
  {
    title: "Seven Brief Lessons on Physics",
    author: "Carlo Rovelli",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Physics"],
    yearPublished: 2014
  },
  {
    title: "Reality Is Not What It Seems",
    author: "Carlo Rovelli",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Physics"],
    yearPublished: 2014
  },
  {
    title: "The Sovereign Individual",
    author: "James Dale Davidson",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Economics", "Technology"],
    yearPublished: 1997
  },
  {
    title: "The Lessons of History",
    author: "Will Durant",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["History", "Philosophy"],
    yearPublished: 1968
  },
  {
    title: "Thinking Physics",
    author: "Lewis Carroll Epstein",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Physics"],
    yearPublished: 2009
  },
  {
    title: "Thing Explainer",
    author: "Randall Munroe",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Education"],
    yearPublished: 2015
  },
  // Feynman books
  {
    title: "Genius: The Life and Science of Richard Feynman",
    author: "James Gleick",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Biography", "Science"],
    yearPublished: 1992
  },
  {
    title: "Perfectly Reasonable Deviations from the Beaten Track",
    author: "Richard P. Feynman",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Letters"],
    yearPublished: 2005
  },
  {
    title: "Six Easy Pieces",
    author: "Richard P. Feynman",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Physics"],
    yearPublished: 1994
  },
  // More Matt Ridley books
  {
    title: "Evolution Everything",
    author: "Matt Ridley",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Evolution"],
    yearPublished: 2015
  },
  {
    title: "The Origins of Virtue",
    author: "Matt Ridley",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Psychology"],
    yearPublished: 1996
  },
  {
    title: "The Red Queen",
    author: "Matt Ridley",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Evolution"],
    yearPublished: 1993
  },
  // Business and Marketing books
  {
    title: "Getting Everything You Can Out of All You've Got",
    author: "Jay Abraham",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Business", "Marketing"],
    yearPublished: 2000
  },
  {
    title: "Rework",
    author: "Jason Fried",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Business", "Productivity"],
    yearPublished: 2010
  },
  {
    title: "Product-Led Growth",
    author: "Wes Bush",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Business", "Product"],
    yearPublished: 2019
  },
  // Philosophy books
  {
    title: "Tao Te Ching",
    author: "Lao Tzu",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Philosophy", "Spirituality"],
    yearPublished: -600
  },
  {
    title: "The Complete Essays",
    author: "Michel de Montaigne",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Philosophy", "Essays"],
    yearPublished: 1580
  },
  {
    title: "Nicomachean Ethics",
    author: "Aristotle",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Philosophy", "Ethics"],
    yearPublished: -340
  }
];

// Then define additionalBooks
const additionalBooks: Book[] = [
  {
    title: "The Third Chimpanzee",
    author: "Jared M. Diamond",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Evolution"],
    yearPublished: 1991
  },
  {
    title: "The Greatest Trade Ever",
    author: "Gregory Zuckerman",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Finance", "History"],
    yearPublished: 2009
  },
  {
    title: "Master of the Game",
    author: "Connie Bruck",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Business", "Biography"],
    yearPublished: 2023
  },
  {
    title: "A Universe from Nothing",
    author: "Lawrence M. Krauss",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Physics"],
    yearPublished: 2012
  },
  {
    title: "Judgment in Managerial Decision Making",
    author: "Max H. Bazerman",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Business", "Psychology"],
    yearPublished: 2008
  },
  {
    title: "Hard Drive: Bill Gates and the Making of the Microsoft Empire",
    author: "James Wallace",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Technology", "Biography"],
    yearPublished: 1992
  },
  {
    title: "In the Plex",
    author: "Steven Levy",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Technology", "Business"],
    yearPublished: 2011
  },
  {
    title: "The Little Book of Common Sense Investing",
    author: "John C. Bogle",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Finance", "Investment"],
    yearPublished: 2007
  },
  {
    title: "The Outsiders",
    author: "William N. Thorndike Jr.",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Business", "Leadership"],
    yearPublished: 2012
  },
  {
    title: "Seeking Wisdom",
    author: "Peter Bevelin",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Philosophy", "Business"],
    yearPublished: 2007
  },
  {
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Biology"],
    yearPublished: 1976
  },
  {
    title: "Outliers",
    author: "Malcolm Gladwell",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Psychology", "Sociology"],
    yearPublished: 2008
  },
  {
    title: "Hacking Growth",
    author: "Sean Ellis",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Business", "Marketing"],
    yearPublished: 2017
  },
  {
    title: "Only the Paranoid Survive",
    author: "Andrew S. Grove",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Business", "Leadership"],
    yearPublished: 1996
  },
  {
    title: "Three Scientists and Their Gods",
    author: "Robert Wright",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Science", "Philosophy"],
    yearPublished: 1988
  },
  {
    title: "Getting to Yes",
    author: "Roger Fisher",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Business", "Psychology"],
    yearPublished: 1981
  },
  {
    title: "The Warren Buffett Portfolio",
    author: "Robert G. Hagstrom",
    cover: "📚",
    rating: 0,
    status: "want-to-read",
    genre: ["Finance", "Investment"],
    yearPublished: 1999
  }
];

// Finally, combine them into a single wantToReadBooks array
const wantToReadBooks: Book[] = [...initialWantToReadBooks, ...additionalBooks];

export function Books() {
  const [activeShelf, setActiveShelf] = useState<'favorites' | 'reading' | 'want-to-read'>('favorites');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const favoriteBooks: Book[] = [
    {
      title: "The Autobiography of Benjamin Franklin",
      author: "Benjamin Franklin",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Autobiography", "History"],
      yearPublished: 1791
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Fiction", "Philosophy"],
      yearPublished: 1988
    },
    {
      title: "The Intelligent Investor",
      author: "Benjamin Graham",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Finance", "Investment"],
      yearPublished: 1949
    },
    {
      title: "Influence: The Psychology of Persuasion",
      author: "Robert B. Cialdini",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Psychology", "Business"],
      yearPublished: 1984
    },
    {
      title: "Ogilvy on Advertising",
      author: "David Ogilvy",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Marketing", "Business"],
      yearPublished: 1983
    },
    {
      title: "The Boron Letters",
      author: "Gary C. Halbert",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Marketing", "Business"],
      yearPublished: 2013
    },
    {
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["History", "Science"],
      yearPublished: 2011
    },
    {
      title: "The Price We Pay",
      author: "Marty Makary",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Healthcare", "Economics"],
      yearPublished: 2019
    },
    {
      title: "How to Win Friends and Influence People",
      author: "Dale Carnegie",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Self-Help", "Psychology"],
      yearPublished: 1936
    },
    {
      title: "The Greatest Salesman in the World",
      author: "Og Mandino",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Self-Help", "Business"],
      yearPublished: 1968
    },
    {
      title: "The White Tiger",
      author: "Aravind Adiga",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Fiction", "Contemporary"],
      yearPublished: 2008
    },
    {
      title: "Reality Transurfing",
      author: "Vadim Zeland",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Philosophy", "Self-Help"],
      yearPublished: 2004
    },
    {
      title: "Good to Great",
      author: "Jim Collins",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Business", "Leadership"],
      yearPublished: 2001
    },
    {
      title: "Where the Red Fern Grows",
      author: "Wilson Rawls",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Fiction", "Young Adult"],
      yearPublished: 1961
    },
    {
      title: "The Little Book That Beats the Market",
      author: "Joel Greenblatt",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Finance", "Investment"],
      yearPublished: 2005
    },
    {
      title: "Three Easy Pieces",
      author: "Remzi H. Arpaci-Dusseau",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Computer Science", "Operating Systems"],
      yearPublished: 2018
    },
    {
      title: "Invent and Wander",
      author: "Jeff Bezos",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Business", "Technology"],
      yearPublished: 2020
    },
    {
      title: "Code: The Hidden Language",
      author: "Charles Petzold",
      cover: "📚",
      rating: 5,
      status: "favorites",
      genre: ["Computer Science", "Technology"],
      yearPublished: 1999
    }
  ];

  // Add this to your component, right after the favoriteBooks array
  const readingBooks: Book[] = [
    {
      title: "Economic Facts & Fallacies",
      author: "Thomas Sowell",
      cover: "📚",
      rating: 0, // Since you haven't finished it yet
      status: "reading",
      progress: 75, // Adding the progress percentage
      genre: ["Economics", "Social Science"],
      yearPublished: 2008
    }
  ];

  // Update the allBooks combination to include readingBooks
  const allBooks = [...favoriteBooks, ...wantToReadBooks, ...readingBooks];

  // Update the filtered books to handle both shelf and genre filters
  const filteredBooks = allBooks.filter(book => {
    const matchesShelf = book.status === activeShelf;
    const matchesGenre = selectedGenre ? book.genre.includes(selectedGenre) : true;
    return matchesShelf && matchesGenre;
  });

  // Get all unique genres
  const allGenres = Array.from(new Set(allBooks.flatMap(book => book.genre))).sort();

  // Add function to handle genre filtering
  const handleGenreClick = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null); // Deselect if clicking the same genre
    } else {
      setSelectedGenre(genre); // Select new genre
    }
  };

  return (
    <div className="h-full flex bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-black p-6 flex flex-col">
        {/* Navigation section */}
        <div className="mb-8 flex-none">
          <h2 className="text-2xl font-bold mb-4">My Books</h2>
          <nav className="space-y-4">
            <button 
              onClick={() => setActiveShelf('favorites')}
              className={`flex items-center gap-3 w-full text-left ${activeShelf === 'favorites' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <span className="text-xl">📚</span> Favorites
            </button>
            <button 
              onClick={() => setActiveShelf('reading')}
              className={`flex items-center gap-3 w-full text-left ${activeShelf === 'reading' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <span className="text-xl">📖</span> Reading
            </button>
            <button 
              onClick={() => setActiveShelf('want-to-read')}
              className={`flex items-center gap-3 w-full text-left ${activeShelf === 'want-to-read' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <span className="text-xl">📚</span> Want to Read
            </button>
          </nav>
        </div>
        
        {/* Updated Genres section */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex justify-between items-center mb-4 flex-none">
            <h3 className="text-lg font-semibold">Genres</h3>
            {selectedGenre && (
              <button 
                onClick={() => setSelectedGenre(null)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1 pr-2 space-y-2">
            {allGenres.map((genre) => (
              <button 
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className={cn(
                  "block w-full text-left truncate px-2 py-1 rounded transition-colors",
                  genre === selectedGenre 
                    ? "bg-white/10 text-white" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {genre}
                <span className="float-right text-xs text-gray-500">
                  {allBooks.filter(book => book.genre.includes(genre)).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 pb-24">
        <div className="mb-8">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-3xl font-bold">
              {activeShelf === 'favorites' && 'Favorites'}
              {activeShelf === 'reading' && 'Currently Reading'}
              {activeShelf === 'want-to-read' && 'Want to Read'}
            </h1>
            {selectedGenre && (
              <span className="text-gray-400">
                • Filtered by {selectedGenre}
              </span>
            )}
          </div>
          <p className="text-gray-400">{filteredBooks.length} books</p>
        </div>

        <div className="space-y-6">
          {filteredBooks.map((book, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-6 flex gap-6">
              <div className="w-32 h-48 bg-gray-700 rounded-lg flex items-center justify-center text-4xl">
                {book.cover}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{book.title}</h3>
                <p className="text-gray-400 mb-2">by {book.author}</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400">
                        {star <= book.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  {book.rating > 0 && <span className="text-gray-400">({book.rating}/5)</span>}
                </div>
                {book.yearPublished && (
                  <p className="text-gray-400 mb-4">Published in {book.yearPublished}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {book.genre.map((g, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-700 rounded-full text-sm">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 