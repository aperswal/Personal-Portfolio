export interface Artwork {
  title: string;
  artist: string;
  year: string;
  movement: string;
  imagePath: string;
  alt: string;
}

export const artworks: Artwork[] = [
  {
    title: "Among the Sierra Nevada, California",
    artist: "Albert Bierstadt",
    year: "1868",
    movement: "Hudson River School",
    imagePath:
      "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/among-the-sierra-nevada.jpg",
    alt: "Dramatic landscape of the Sierra Nevada mountains bathed in golden light, with a still lake reflecting the peaks and deer grazing at the water's edge",
  },
  {
    title: "Convergence",
    artist: "Jackson Pollock",
    year: "1952",
    movement: "Abstract Expressionism",
    imagePath: "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/convergence.jpg",
    alt: "Large-scale abstract painting with chaotic drips and splashes of black, white, yellow, and red paint intertwined across the canvas",
  },
  {
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    year: "c. 1829-1833",
    movement: "Ukiyo-e",
    imagePath:
      "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/great-wave-off-kanagawa.jpg",
    alt: "A towering cresting wave with foamy fingers threatens small boats while Mount Fuji sits calmly in the background",
  },
  {
    title: "Water Lilies (Nympheas)",
    artist: "Claude Monet",
    year: "1920-1926",
    movement: "Impressionism",
    imagePath: "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/water-lilies.jpg",
    alt: "Soft impressionistic view of water lilies floating on a pond, with reflections of sky and foliage dissolving into patches of blue, green, and pink",
  },
  {
    title: "The Scream",
    artist: "Edvard Munch",
    year: "1893",
    movement: "Expressionism",
    imagePath: "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/the-scream.jpg",
    alt: "An agonized figure with an open mouth stands on a bridge against a swirling orange and red sky, hands clasped to the sides of its face",
  },
  {
    title: "Nighthawks",
    artist: "Edward Hopper",
    year: "1942",
    movement: "American Realism",
    imagePath: "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/nighthawks.jpg",
    alt: "Four people sit in a brightly lit downtown diner at night, seen through large glass windows from the empty street outside",
  },
  {
    title: "The Garden of Earthly Delights",
    artist: "Hieronymus Bosch",
    year: "1490-1510",
    movement: "Northern Renaissance",
    imagePath:
      "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/garden-of-earthly-delights.jpg",
    alt: "A surreal triptych depicting paradise on the left, fantastical earthly pleasures in the center, and a dark hellscape on the right, filled with hundreds of tiny bizarre figures",
  },
  {
    title: "The Milkmaid",
    artist: "Johannes Vermeer",
    year: "c. 1658",
    movement: "Dutch Golden Age",
    imagePath: "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/the-milkmaid.jpg",
    alt: "A domestic servant carefully pours milk from an earthenware jug into a bowl in a quiet, sunlit kitchen with a bare wall behind her",
  },
  {
    title: "The Raft of the Medusa",
    artist: "Theodore Gericault",
    year: "1818-1819",
    movement: "Romanticism",
    imagePath:
      "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/raft-of-the-medusa.jpg",
    alt: "Survivors on a makeshift raft in a stormy sea, some dead or dying, others desperately waving at a distant ship on the horizon",
  },
  {
    title: "A Sunday Afternoon on the Island of La Grande Jatte",
    artist: "Georges Seurat",
    year: "1884-1886",
    movement: "Pointillism",
    imagePath:
      "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/sunday-afternoon-grande-jatte.jpg",
    alt: "Parisians relaxing in a suburban park by the Seine, rendered entirely in tiny dots of color that blend together when viewed from a distance",
  },
  {
    title: "The Wanderer Above the Sea of Fog",
    artist: "Caspar David Friedrich",
    year: "1818",
    movement: "Romanticism",
    imagePath:
      "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/wanderer-above-sea-of-fog.jpg",
    alt: "A man in a dark coat stands on a rocky precipice with his back to the viewer, gazing out over a vast landscape of fog-covered mountains",
  },
  {
    title: "Skull of a Skeleton with Burning Cigarette",
    artist: "Vincent van Gogh",
    year: "1886",
    movement: "Realism",
    imagePath:
      "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/skull-skeleton-burning-cigarette.jpg",
    alt: "A human skeleton shown from the chest up against a dark background, with a lit cigarette clenched between its teeth",
  },
];
