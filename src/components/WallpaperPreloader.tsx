export function WallpaperPreloader({ wallpapers }: { wallpapers: string[] }) {
  return (
    <div style={{ display: 'none' }}>
      {wallpapers.map((wallpaper, index) => (
        <img 
          key={index}
          src={wallpaper}
          alt=""
          className="wallpaper-preload"
        />
      ))}
    </div>
  );
} 