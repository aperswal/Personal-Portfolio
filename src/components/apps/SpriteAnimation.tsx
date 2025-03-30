import { useEffect, useRef } from 'react';

export function SpriteAnimation() {
  const spriteRef = useRef<HTMLDivElement>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Custom frame sequence that skips 4th column in rows 1-3
  // but includes all frames in row 4
  const framePositions = [
    // Row 1 (skip 4th column)
    {x: 0, y: 0}, {x: -256, y: 0}, {x: -512, y: 0}, 
    // Row 2 (skip 4th column)
    {x: 0, y: -256}, {x: -256, y: -256}, {x: -512, y: -256}, 
    // Row 3 (skip 4th column)
    {x: 0, y: -512}, {x: -256, y: -512}, {x: -512, y: -512}, 
    // Row 4 (keep all columns)
    {x: 0, y: -768}, {x: -256, y: -768}, {x: -512, y: -768}, {x: -768, y: -768}
  ];
  
  const TOTAL_FRAMES = framePositions.length;
  
  useEffect(() => {
    let currentFrame = 0;
    
    function updateFrame(frameIndex: number) {
      if (!spriteRef.current) return;
      
      const { x, y } = framePositions[frameIndex];
      spriteRef.current.style.backgroundPosition = `${x}px ${y}px`;
    }
    
    // Show initial frame
    updateFrame(0);
    
    // Start animation at 0.25x speed of 18fps
    const fps = 18;
    const speed = 0.15;
    const interval = 1000 / (fps * speed);
    
    // Start the animation loop
    animationIntervalRef.current = setInterval(() => {
      currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
      updateFrame(currentFrame);
    }, interval);
    
    // Cleanup on unmount
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-gray-400 mb-2">Live feed of me working</div>
      <div 
        ref={spriteRef}
        className="w-[256px] h-[256px] bg-white border-2 border-gray-700 rounded-lg"
        style={{
          backgroundImage: "url('/Sprite_1.png')",
          backgroundSize: "1024px 1024px"
        }}
      />
    </div>
  );
} 