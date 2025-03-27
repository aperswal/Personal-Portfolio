import { useState } from 'react';
import { Info, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  image: string;
  description: string;
  technique: string;
  location: string;
  dimensions: string;
  movement: string;
  significance: string;
}

const artworks: Artwork[] = [
  {
    id: "sierra",
    title: "Among the Sierra Nevada, California",
    artist: "Albert Bierstadt",
    year: "1868",
    image: "/among_the_sierra_nevada.jpg",
    technique: "Oil on canvas",
    dimensions: "72 × 120 inches",
    location: "Smithsonian American Art Museum, Washington, D.C.",
    movement: "Hudson River School",
    description: "A dramatic landscape depicting the Sierra Nevada mountains with radiant light and atmospheric effects.",
    significance: "This painting exemplifies Bierstadt's romanticized vision of the American West, emphasizing the sublime grandeur of the wilderness."
  },
  {
    id: "convergence",
    title: "Convergence",
    artist: "Jackson Pollock",
    year: "1952",
    image: "/convergence.jpg",
    technique: "Oil and enamel on canvas",
    dimensions: "93.5 × 155 inches",
    location: "Albright-Knox Art Gallery, Buffalo, New York",
    movement: "Abstract Expressionism",
    description: "A masterpiece of abstract expressionism, showcasing Pollock's famous drip painting technique.",
    significance: "This painting represents the height of Pollock's 'action painting' period, where he would drip and splash paint onto canvas laid on the floor, creating intricate patterns that embodied both chaos and control."
  },
  {
    id: "wave",
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    year: "c. 1829-1833",
    image: "/wave.jpg",
    technique: "Woodblock print",
    dimensions: "10.1 × 14.9 inches",
    location: "Multiple collections worldwide",
    movement: "Ukiyo-e",
    description: "A towering wave threatens boats near Mount Fuji in this iconic Japanese woodblock print.",
    significance: "This print symbolizes the power of nature and has become one of the most recognized works of Japanese art in the world."
  },
  {
    id: "waterlilies",
    title: "Water Lilies (Nymphéas)",
    artist: "Claude Monet",
    year: "1920-1926",
    image: "/lillies.avif",
    technique: "Oil on canvas",
    dimensions: "Various sizes",
    location: "Musée de l'Orangerie, Paris",
    movement: "Impressionism",
    description: "Part of Monet's famous series depicting his flower garden at Giverny.",
    significance: "These paintings represent Monet's lifelong exploration of light, color, and reflection on water."
  },
  {
    id: "scream",
    title: "The Scream",
    artist: "Edvard Munch",
    year: "1893",
    image: "/scream.jpg",
    technique: "Oil, tempera, and pastel on cardboard",
    dimensions: "36 × 28.9 inches",
    location: "National Gallery, Oslo",
    movement: "Expressionism",
    description: "A figure with an agonized expression against a landscape with a tumultuous orange sky.",
    significance: "This painting has become an iconic symbol of existential anxiety and the human condition."
  },
  {
    id: "nighthawks",
    title: "Nighthawks",
    artist: "Edward Hopper",
    year: "1942",
    image: "/nighthawk.jpg",
    technique: "Oil on canvas",
    dimensions: "84.1 × 152.4 inches",
    location: "Art Institute of Chicago",
    movement: "American Realism",
    description: "A late-night scene in a downtown diner, viewed through the establishment's large windows.",
    significance: "The painting reflects themes of urban loneliness and isolation in modern American life."
  },
  {
    id: "garden",
    title: "The Garden of Earthly Delights",
    artist: "Hieronymus Bosch",
    year: "1490-1510",
    image: "/garden.jpeg",
    technique: "Oil on oak panels",
    dimensions: "87 × 153 inches (triptych)",
    location: "Museo del Prado, Madrid",
    movement: "Northern Renaissance",
    description: "A complex triptych depicting paradise, earthly pleasures, and hell.",
    significance: "This surreal masterpiece is known for its fantastical imagery and complex religious symbolism."
  },
  {
    id: "milkmaid",
    title: "The Milkmaid",
    artist: "Johannes Vermeer",
    year: "c. 1658",
    image: "/milkmaid.jpg",
    technique: "Oil on canvas",
    dimensions: "17.9 × 16.1 inches",
    location: "Rijksmuseum, Amsterdam",
    movement: "Dutch Golden Age",
    description: "A domestic servant pouring milk in a serene kitchen setting.",
    significance: "This painting exemplifies Vermeer's mastery of light and his elevation of everyday scenes to profound art."
  },
  {
    id: "raft",
    title: "The Raft of the Medusa",
    artist: "Théodore Géricault",
    year: "1818-1819",
    image: "/medusa.jpg",
    technique: "Oil on canvas",
    dimensions: "193.3 × 282.3 inches",
    location: "Louvre Museum, Paris",
    movement: "Romanticism",
    description: "Depicts the aftermath of the wreck of the French naval frigate Méduse.",
    significance: "A powerful political statement and masterpiece of French Romanticism."
  },
  {
    id: "sunday",
    title: "A Sunday Afternoon on the Island of La Grande Jatte",
    artist: "Georges Seurat",
    year: "1884-1886",
    image: "/sunday.jpg",
    technique: "Oil on canvas",
    dimensions: "81.7 × 121.25 inches",
    location: "Art Institute of Chicago",
    movement: "Pointillism",
    description: "A scene of Parisians relaxing in a suburban park using pointillist technique.",
    significance: "This painting pioneered the pointillist technique and influenced modern art."
  },
  {
    id: "wanderer",
    title: "The Wanderer Above the Sea of Fog",
    artist: "Caspar David Friedrich",
    year: "1818",
    image: "/wanderer.jpeg",
    technique: "Oil on canvas",
    dimensions: "37.3 × 29.4 inches",
    location: "Kunsthalle Hamburg",
    movement: "Romanticism",
    description: "A man standing upon a rocky precipice, contemplating a foggy landscape.",
    significance: "This painting embodies the Romantic ideal of the sublime in nature."
  }
];

export function Gallery() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleNext = () => {
    if (!selectedArtwork) return;
    const currentIndex = artworks.findIndex(a => a.id === selectedArtwork.id);
    const nextIndex = (currentIndex + 1) % artworks.length;
    setSelectedArtwork(artworks[nextIndex]);
  };

  const handlePrevious = () => {
    if (!selectedArtwork) return;
    const currentIndex = artworks.findIndex(a => a.id === selectedArtwork.id);
    const previousIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    setSelectedArtwork(artworks[previousIndex]);
  };

  return (
    <div className="h-full bg-gray-900 text-white overflow-hidden">
      {selectedArtwork ? (
        // Detailed View
        <div className="h-full relative flex flex-col">
          {/* Navigation Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
            <button 
              onClick={() => setSelectedArtwork(null)}
              className="hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="hover:text-gray-300"
            >
              <Info size={24} />
            </button>
          </div>

          {/* Main Image Container - Add transition */}
          <div 
            className={cn(
              "flex-1 relative transition-all duration-300",
              showInfo ? "mr-96" : "mr-0"
            )}
          >
            <img
              src={selectedArtwork.image}
              alt={selectedArtwork.title}
              className="absolute inset-0 w-full h-full object-contain"
            />
            
            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Info Panel - Change to fixed positioning */}
          <div 
            className={cn(
              "fixed right-0 top-0 bottom-0 w-96 bg-black/90 backdrop-blur-xl p-6 overflow-y-auto transition-transform duration-300",
              showInfo ? "translate-x-0" : "translate-x-full"
            )}
          >
            <h2 className="text-2xl font-bold mb-2">{selectedArtwork.title}</h2>
            <p className="text-gray-400 mb-4">{selectedArtwork.artist}, {selectedArtwork.year}</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="text-gray-300">{selectedArtwork.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Significance</h3>
                <p className="text-gray-300">{selectedArtwork.significance}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Details</h3>
                <dl className="text-sm">
                  <dt className="text-gray-500">Technique</dt>
                  <dd className="text-gray-300 mb-1">{selectedArtwork.technique}</dd>
                  
                  <dt className="text-gray-500">Dimensions</dt>
                  <dd className="text-gray-300 mb-1">{selectedArtwork.dimensions}</dd>
                  
                  <dt className="text-gray-500">Location</dt>
                  <dd className="text-gray-300 mb-1">{selectedArtwork.location}</dd>
                  
                  <dt className="text-gray-500">Movement</dt>
                  <dd className="text-gray-300">{selectedArtwork.movement}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Grid View
        <div className="h-full overflow-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Art Gallery</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artworks.map((artwork) => (
              <button
                key={artwork.id}
                onClick={() => setSelectedArtwork(artwork)}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-800"
              >
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-medium">{artwork.title}</h3>
                    <p className="text-sm text-gray-400">{artwork.artist}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 