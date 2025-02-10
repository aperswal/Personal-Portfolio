import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle,
  Heart,
  Volume2,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { withNoSSR } from '@/lib/utils/dynamic';

interface Song {
  title: string;
  artist: string;
  rank: number;
  isNew?: boolean;
  change?: number;
  duration?: string;
}

const recentSongs: Song[] = [
  { title: "Carry You Home", artist: "Alex Warren", rank: 1, isNew: true, duration: "3:24" },
  { title: "Love The Hell Out Of You", artist: "Lewis Capaldi", rank: 2, isNew: true, duration: "3:45" },
  { title: "Sports car", artist: "Tate McRae", rank: 3, isNew: true, duration: "2:56" },
  { title: "Warriors", artist: "League of Legends, 2WEI, Edda Hayes", rank: 4, change: 1, duration: "3:37" },
  { title: "Sultan", artist: "Ananya Bhat, et al.", rank: 5, isNew: true, duration: "4:12" },
  { title: "Bam Bhole", artist: "Meghdeep Bose, Pinky Poonawala", rank: 6, isNew: true, duration: "3:18" },
  { title: "Ghamand Kar", artist: "Sachet-Parampara", rank: 7, change: -4, duration: "4:02" },
  { title: "Gehre Andhere", artist: "Vishal Dadlani", rank: 8, change: -6, duration: "3:55" },
  { title: "Middle Of The Night (Violin)", artist: "Joel Sunny, Dramatic Violin", rank: 9, isNew: true, duration: "3:15" },
  { title: "Tere Mast Mast Do Nain", artist: "Rahat Fateh Ali Khan", rank: 10, isNew: true, duration: "5:01" }
];

const playlists = [
  { 
    name: "Hitting the road", 
    songs: [
      { title: "greedy", artist: "Tate McRae", rank: 1, duration: "2:11" },
      { title: "Beautiful Things", artist: "Benson Boone", rank: 2, duration: "3:24" },
      { title: "Daylight", artist: "David Kushner", rank: 3, duration: "3:31" },
      { title: "Chicago", artist: "Michael Jackson", rank: 4, duration: "3:42" },
      { title: "Wild Ones (feat. Jelly Roll)", artist: "Jessie Murph, Jelly Roll", rank: 5, duration: "3:15" },
      { title: "Mannat", artist: "Darshan Raval, Prakriti Kakar", rank: 6, duration: "4:22" },
      { title: "Before You", artist: "Benson Boone", rank: 7, duration: "3:33" },
      { title: "To Be Free", artist: "Dylan Gossett", rank: 8, duration: "3:12" },
      { title: "Allah Ke Bande", artist: "Kailash Kher", rank: 9, duration: "4:45" },
      { title: "Slow It Down", artist: "Benson Boone", rank: 10, duration: "3:21" },
      { title: "Money Trees", artist: "Kendrick Lamar, Jay Rock", rank: 11, duration: "6:27" },
      { title: "Too Sweet", artist: "Hozier", rank: 12, duration: "3:56" },
      { title: "Ghost Town", artist: "Benson Boone", rank: 13, duration: "3:18" },
      { title: "A Bar Song (Tipsy)", artist: "Shaboozey", rank: 14, duration: "2:59" },
      { title: "Star Hai Tu", artist: "Himani Kapoor, Siddharth Mahadevan, Divya Kumar", rank: 15, duration: "4:12" },
      { title: "Pretty Slowly", artist: "Benson Boone", rank: 16, duration: "3:08" },
      { title: "Sports car", artist: "Tate McRae", rank: 17, duration: "2:56" },
      { title: "Carry You Home", artist: "Alex Warren", rank: 18, duration: "3:24" },
      { title: "Love The Hell Out Of You", artist: "Lewis Capaldi", rank: 19, duration: "3:45" },
      { title: "i like the way you kiss me", artist: "Artemas", rank: 20, duration: "2:47" }
    ]
  },
  { 
    name: "Workout", 
    songs: [
      { title: "Invincible", artist: "Pop Smoke", rank: 1, duration: "3:45" },
      { title: "Creature", artist: "KSI", rank: 2, duration: "3:12" },
      { title: "In the Zone", artist: "P.L.", rank: 3, duration: "2:56" },
      { title: "Hustler", artist: "Zayde Wolf", rank: 4, duration: "3:21" },
      { title: "I Am Defiant", artist: "The Seige", rank: 5, duration: "3:33" },
      { title: "Die in This Town", artist: "The Seige", rank: 6, duration: "3:18" },
      { title: "Arise (From Marvel's \"Cloak & Dagger\")", artist: "The Seige", rank: 7, duration: "4:02" },
      { title: "Gladiator", artist: "Zayde Wolf", rank: 8, duration: "3:45" },
      { title: "Believer", artist: "Imagine Dragons", rank: 9, duration: "3:24" },
      { title: "Enemy (with JID) - from the series Arcane League of Legends", artist: "Imagine Dragons, JID, Arcane, League of Legends", rank: 10, duration: "2:53" },
      { title: "Run This Town", artist: "JAY-Z, Rihanna, Kanye West", rank: 11, duration: "4:27" },
      { title: "Clique", artist: "Kanye West, JAY-Z, Big Sean", rank: 12, duration: "4:53" },
      { title: "Survivor", artist: "2WEI, Edda Hayes", rank: 13, duration: "3:33" },
      { title: "Legend", artist: "The Score", rank: 14, duration: "3:05" },
      { title: "Vato", artist: "Snoop Dogg, B-Real", rank: 15, duration: "4:44" },
      { title: "BOP", artist: "DaBaby", rank: 16, duration: "2:37" },
      { title: "Panda", artist: "Desiigner", rank: 17, duration: "4:06" },
      { title: "Broke In A Minute", artist: "Tory Lanez", rank: 18, duration: "2:36" },
      { title: "King Kong", artist: "DeStorm Power", rank: 19, duration: "3:15" },
      { title: "Clear Eyes, Full Heart, Can't Lose", artist: "T. Powell", rank: 20, duration: "3:42" },
      { title: "Cold-Blooded", artist: "Zayde Wolf", rank: 21, duration: "3:28" },
      { title: "Can't Be Touched (feat. Mr. Magic & Trouble)", artist: "Roy Jones Jr., Mr Magic, Trouble", rank: 22, duration: "3:47" },
      { title: "Holy Ghost", artist: "Montana of 300", rank: 23, duration: "3:51" }
    ]
  },
  { 
    name: "Studying", 
    songs: [
      { title: "In The Stars", artist: "Benson Boone", rank: 1, duration: "3:33" },
      { title: "To Love Someone", artist: "Benson Boone", rank: 2, duration: "3:45" },
      { title: "Daylight", artist: "David Kushner", rank: 3, duration: "3:31" },
      { title: "Before You", artist: "Benson Boone", rank: 4, duration: "3:33" },
      { title: "To Be Free", artist: "Dylan Gossett", rank: 5, duration: "3:12" },
      { title: "Maula Mere Lele Meri Jaan", artist: "Salim–Sulaiman, Krishna Beuraa, Salim Merchant, Jaideep Sahni", rank: 6, duration: "4:45" },
      { title: "Slow It Down", artist: "Benson Boone", rank: 7, duration: "3:21" },
      { title: "Forever", artist: "Lewis Capaldi", rank: 8, duration: "3:42" },
      { title: "drivers license", artist: "Olivia Rodrigo", rank: 9, duration: "4:02" },
      { title: "What A Time (feat. Niall Horan)", artist: "Julia Michaels, Niall Horan", rank: 10, duration: "3:53" },
      { title: "Waves", artist: "Dean Lewis", rank: 11, duration: "3:35" },
      { title: "Be Alright", artist: "Dean Lewis", rank: 12, duration: "3:16" },
      { title: "Us", artist: "James Bay", rank: 13, duration: "3:08" },
      { title: "Let It Go", artist: "James Bay", rank: 14, duration: "4:01" },
      { title: "Complicated", artist: "Olivia O'Brien", rank: 15, duration: "3:22" },
      { title: "This City", artist: "Sam Fischer", rank: 16, duration: "3:05" },
      { title: "Ghost Town", artist: "Benson Boone", rank: 17, duration: "3:18" },
      { title: "July", artist: "Noah Cyrus", rank: 18, duration: "2:48" },
      { title: "Jeena Jeena", artist: "Sachin-Jigar, Atif Aslam", rank: 19, duration: "4:44" },
      { title: "Purvaiya", artist: "Shankar Mahadevan", rank: 20, duration: "5:12" },
      { title: "Idea 10", artist: "Gibran Alcocer", rank: 21, duration: "3:33" },
      { title: "NIGHTS LIKE THESE", artist: "Benson Boone", rank: 22, duration: "3:21" }
    ]
  },
  { 
    name: "Home", 
    songs: [
      { title: "Samjho Na", artist: "Aditya Rikhari", rank: 1, duration: "3:42" },
      { title: "Chaand Baaliyan Duet", artist: "Aditya A, Ishita Parakh", rank: 2, duration: "2:15" },
      { title: "Chale Sabse Dur", artist: "Ganeshsingh Rathore", rank: 3, duration: "4:01" },
      { title: "Choo Lo", artist: "The Local Train", rank: 4, duration: "4:23" },
      { title: "Ghar", artist: "Bharat Chauhan", rank: 5, duration: "3:55" },
      { title: "Laash", artist: "Lifafa", rank: 6, duration: "3:33" },
      { title: "Mann Ki Baat", artist: "Lifafa", rank: 7, duration: "4:12" },
      { title: "Samay Samjhayega (Lofi)", artist: "Mohit Lalwani, Bharat Kamal", rank: 8, duration: "3:21" },
      { title: "Ranjha - Lofi Flip", artist: "SPECRO, SKETCH, Jasleen Royal, B Praak, Bollywood Lofi", rank: 9, duration: "4:15" },
      { title: "Pal", artist: "Javed-Mohsin, Arijit Singh, Shreya Ghoshal, Kunaal Vermaa, Prashant Ingole", rank: 10, duration: "4:45" },
      { title: "Main Rang Sharbaton Ka (Lofi Mix)", artist: "Atif Aslam, Chinmayi, Abhimanyu-Pragya", rank: 11, duration: "5:02" },
      { title: "Tujh Mein Rab Dikhta Hai - II", artist: "Salim–Sulaiman, Shreya Ghoshal, Jaideep Sahni", rank: 12, duration: "4:37" },
      { title: "Kahaan Ho Tum", artist: "Prateek Kuhad", rank: 13, duration: "3:45" },
      { title: "Udd Gaye", artist: "Ritviz", rank: 14, duration: "3:01" },
      { title: "Rutho Jo Tum (Tum Prem Ho)", artist: "Mohit Lalwani, Bharat Kamal", rank: 15, duration: "4:22" },
      { title: "Awaargi", artist: "Aditya A", rank: 16, duration: "3:33" },
      { title: "Aao Chalein", artist: "Taba Chake", rank: 17, duration: "3:15" },
      { title: "Mere Liye Tum Kaafi Ho (From \"Shubh Mangal Zyada Saavdhan\")", artist: "Ayushmann Khurrana, Tanishk-Vayu", rank: 18, duration: "3:45" },
      { title: "Kabhii Tumhhe (From \"Shershaah\")", artist: "Javed-Mohsin, Darshan Raval", rank: 19, duration: "4:01" },
      { title: "Tere Saath", artist: "Karm Solah", rank: 20, duration: "3:28" },
      { title: "Baarishein", artist: "Anuv Jain", rank: 21, duration: "3:35" },
      { title: "Tujhe Kitna Chahne Lage (From \"Kabir Singh\")", artist: "Arijit Singh, Mithoon", rank: 22, duration: "4:44" },
      { title: "Kaun Tujhe", artist: "Palak Muchhal", rank: 23, duration: "4:01" }
    ]
  },
  {
    name: "Podcasts",
    songs: [
      { title: "Grumpy SEO Guy", artist: "Grumpy SEO Guy", rank: 1, duration: "1:12:45" },
      { title: "My First Million", artist: "Hubspot Media", rank: 2, duration: "1:35:22" },
      { title: "a16z Podcast", artist: "Andreessen Horowitz", rank: 3, duration: "45:18" },
      { title: "Your Episodes", artist: "Saved & downloaded episodes", rank: 4, duration: "--:--" },
      { title: "Acquired", artist: "Ben Gilbert and David Rosenthal", rank: 5, duration: "2:15:33" },
      { title: "The Startup Ideas Podcast", artist: "Greg Isenberg", rank: 6, duration: "52:41" },
      { title: "The Colin and Samir Show", artist: "Colin and Samir", rank: 7, duration: "1:23:15" },
      { title: "Marketing School - Digital Marketing", artist: "Eric Siu and Neil Patel", rank: 8, duration: "28:44" },
      { title: "Pivot", artist: "New York Magazine", rank: 9, duration: "1:02:18" },
      { title: "How to Take Over the World", artist: "Ben Wilson | QCODE", rank: 10, duration: "1:45:29" },
      { title: "First Principles with Christian Keil", artist: "Christian Keil", rank: 11, duration: "55:12" },
      { title: "First Principles", artist: "The Ken", rank: 12, duration: "42:37" },
      { title: "Revisionist History", artist: "Pushkin Industries", rank: 13, duration: "48:55" },
      { title: "Prof G Markets", artist: "Vox Media Podcast Network", rank: 14, duration: "38:22" },
      { title: "The Tim Ferriss Show", artist: "Tim Ferriss: Bestselling Author, Human Guinea Pig", rank: 15, duration: "2:05:44" }
    ]
  }
];

const MusicComponent = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-black/50 backdrop-blur-md flex flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Library</h2>
            <nav className="space-y-2">
              {playlists.map((playlist) => (
                <button
                  key={playlist.name}
                  onClick={() => setSelectedPlaylist(playlist)}
                  className={cn(
                    "flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg transition-colors",
                    selectedPlaylist.name === playlist.name 
                      ? "bg-white/10 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className="text-xl">🎵</span>
                  {playlist.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Playlist Header */}
          <div className="p-8 bg-gradient-to-b from-blue-900/50 to-transparent">
            <h1 className="text-4xl font-bold mb-6">{selectedPlaylist.name}</h1>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause size={24} className="text-black" />
                ) : (
                  <Play size={24} className="text-black translate-x-[2px]" />
                )}
              </button>
            </div>
          </div>
          
          {/* Songs List */}
          <div className="px-8 py-4">
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 text-sm text-gray-400 px-4 py-2 border-b border-white/10">
              <span>#</span>
              <span>TITLE</span>
              <span>DURATION</span>
            </div>
            <div className="space-y-2 mt-2">
              {selectedPlaylist.songs.map((song) => (
                <div
                  key={`${song.title}-${song.artist}`}
                  className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 rounded-lg hover:bg-white/5 group items-center"
                >
                  <span className="text-gray-400 w-6 text-right">{song.rank}</span>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {song.title}
                      {song.isNew && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                          New
                        </span>
                      )}
                      {song.change && (
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          song.change > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        )}>
                          {song.change > 0 ? `+${song.change}` : song.change}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">{song.artist}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="opacity-0 group-hover:opacity-100 text-white hover:scale-110 transition-all">
                      <Heart size={16} />
                    </button>
                    <span className="text-gray-400">{song.duration}</span>
                    <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <div className="h-24 bg-gray-900/90 backdrop-blur-md border-t border-white/10 px-4">
        <div className="h-full flex items-center justify-between">
          {/* Current Song */}
          <div className="flex items-center gap-4 w-[30%]">
            <div className="w-14 h-14 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-2xl">🎬</span>
            </div>
            <div>
              <p className="font-medium">Interstellar Main Theme</p>
              <p className="text-sm text-gray-400">Hans Zimmer</p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <Heart size={16} />
            </button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-2 w-[40%]">
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white">
                <Shuffle size={20} />
              </button>
              <button className="text-gray-400 hover:text-white">
                <SkipBack size={20} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                {isPlaying ? (
                  <Pause size={16} className="text-black" />
                ) : (
                  <Play size={16} className="text-black translate-x-[1px]" />
                )}
              </button>
              <button className="text-gray-400 hover:text-white">
                <SkipForward size={20} />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Repeat size={20} />
              </button>
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-400">0:00</span>
              <div className="flex-1 h-1 bg-gray-800 rounded-full">
                <div 
                  className="h-full bg-white rounded-full"
                  style={{ width: `${(currentTime / 100) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">3:45</span>
            </div>
          </div>

          {/* Volume Controls */}
          <div className="flex items-center gap-2 w-[30%] justify-end">
            <button className="text-gray-400 hover:text-white">
              <Volume2 size={20} />
            </button>
            <div className="w-24 h-1 bg-gray-800 rounded-full">
              <div className="w-3/4 h-full bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Music = withNoSSR(MusicComponent); 