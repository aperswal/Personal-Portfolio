import React, { useState, useRef, useEffect, useCallback } from 'react';
import { withNoSSR } from '@/lib/utils/dynamic';

// ASCII Brick Breaker game types
interface Brick {
  x: number;
  y: number;
  visible: boolean;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface Paddle {
  x: number;
  length: number;
}

interface BrickBreakerState {
  bricks: Brick[];
  ball: Ball;
  paddle: Paddle;
  score: number;
  lives: number;
  level: number;
  gameRunning: boolean;
  gameOver: boolean;
  levelComplete: boolean;
  width: number;
  height: number;
}

// Main Terminal Component
const TerminalComponent = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>(['Welcome to MyOS Terminal', 'Type "help" for available commands']);
  const [gameMode, setGameMode] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const terminalDivRef = useRef<HTMLDivElement>(null);
  
  // Brick Breaker game state
  const [gameState, setGameState] = useState<BrickBreakerState>({
    bricks: [],
    ball: { x: 0, y: 0, dx: 1, dy: -1 },
    paddle: { x: 0, length: 6 },
    score: 0,
    lives: 3,
    level: 1,
    gameRunning: false,
    gameOver: false,
    levelComplete: false,
    width: 40, // Terminal game width
    height: 20, // Terminal game height
  });

  // Helper to colorize text for terminal display
  const colorizeText = (text: string, colorCode: number) => {
    // We'll just return the character without styling in this implementation
    // In a real terminal with ANSI support, we'd add color codes
    return text;
  };
  
  // Render the game board as ASCII
  const renderGameBoard = (state: BrickBreakerState) => {
    const { width, height, bricks, paddle, ball } = state;
    
    // Create empty board
    const board: string[][] = Array(height).fill(0).map(() => Array(width).fill(' '));
    
    // Add top border
    board[0] = Array(width).fill('─');
    board[0][0] = '┌';
    board[0][width - 1] = '┐';
    
    // Add side borders
    for (let y = 1; y < height - 1; y++) {
      board[y][0] = '│';
      board[y][width - 1] = '│';
    }
    
    // Add bottom border
    board[height - 1] = Array(width).fill('─');
    board[height - 1][0] = '└';
    board[height - 1][width - 1] = '┘';
    
    // Add score and level info
    const infoText = ` LEVEL: ${state.level} | SCORE: ${state.score} | LIVES: ${'♥'.repeat(state.lives)} `;
    const startPos = Math.floor((width - infoText.length) / 2);
    
    for (let i = 0; i < infoText.length; i++) {
      if (startPos + i < width - 1) {
        board[0][startPos + i] = infoText[i];
      }
    }
    
    // Add bricks
    bricks.forEach(brick => {
      if (brick.visible) {
        const brickX = brick.x * 4 + 1; // Spacing for bricks
        
        // Draw a 3-character wide brick
        for (let i = 0; i < 3; i++) {
          if (brickX + i < width - 1) {
            const brickChar = colorizeText('█', brick.y % 6); // Different colors based on row
            board[brick.y][brickX + i] = brickChar;
          }
        }
      }
    });
    
    // Add paddle
    for (let i = 0; i < paddle.length; i++) {
      const paddleX = paddle.x + i;
      if (paddleX > 0 && paddleX < width - 1) {
        board[height - 2][paddleX] = '▀';
      }
    }
    
    // Add ball
    if (ball.x > 0 && ball.x < width - 1 && ball.y > 0 && ball.y < height - 1) {
      board[ball.y][ball.x] = '●';
    }
    
    // Convert board to string with newlines
    return board.map(row => row.join('')).join('\n');
  };
  
  // Update game state (for game loop)
  const updateGame = useCallback(() => {
    // Use current state instead of the closed over gameState from the dependency array
    setGameState(prevState => {
      // Don't process updates if game isn't running
      if (!prevState.gameRunning) return prevState;
      
      const { ball, paddle, bricks, width, height } = prevState;
      
      // Create a new ball with updated position
      const newBall = {
        ...ball,
        x: ball.x + ball.dx,
        y: ball.y + ball.dy
      };
      
      // Check for wall collisions
      if (newBall.x <= 1 || newBall.x >= width - 2) {
        newBall.dx = -newBall.dx;
      }
      
      if (newBall.y <= 1) {
        newBall.dy = -newBall.dy;
      }
      
      // Check if ball hits bottom (lose life)
      if (newBall.y >= height - 2) {
        // Check if ball hits paddle
        if (newBall.x >= paddle.x && newBall.x < paddle.x + paddle.length) {
          newBall.dy = -1;
          
          // Change horizontal direction based on where ball hits paddle
          const hitPosition = (newBall.x - paddle.x) / paddle.length;
          
          // Middle of paddle bounces straight up
          if (hitPosition > 0.4 && hitPosition < 0.6) {
            newBall.dx = 0;
          } 
          // Left side bounces left
          else if (hitPosition <= 0.4) {
            newBall.dx = -1;
          }
          // Right side bounces right
          else {
            newBall.dx = 1;
          }
        } else {
          // Ball missed paddle - lose a life
          const newLives = prevState.lives - 1;
          
          if (newLives <= 0) {
            // Game over
            if (gameIntervalRef.current) {
              clearInterval(gameIntervalRef.current);
              gameIntervalRef.current = null;
            }
            
            setOutput(prev => [
              ...prev.slice(0, -1), // Remove the last game board
              renderGameBoard({
                ...prevState,
                lives: 0
              }),
              "GAME OVER! Final score: " + prevState.score,
              "Press R to restart or Q to quit."
            ]);
            
            return {
              ...prevState,
              lives: 0,
              gameRunning: false,
              gameOver: true
            };
          }
          
          // Reset ball position but keep game running
          setOutput(prev => [
            ...prev.slice(0, -1), // Remove the last game board
            renderGameBoard({
              ...prevState,
              lives: newLives,
              ball: {
                x: Math.floor(width / 2),
                y: height - 3,
                dx: Math.random() > 0.5 ? 1 : -1,
                dy: -1
              }
            }),
            `Lost a life! ${newLives} remaining.`
          ]);
          
          return {
            ...prevState,
            lives: newLives,
            gameRunning: false,
            ball: {
              x: Math.floor(width / 2),
              y: height - 3,
              dx: Math.random() > 0.5 ? 1 : -1,
              dy: -1
            }
          };
        }
      }
      
      // Check for brick collisions
      let brickHit = false;
      const newBricks = [...bricks];
      
      // First, check if ball hits any brick
      for (let i = 0; i < newBricks.length; i++) {
        const brick = newBricks[i];
        
        if (brick.visible) {
          // Check if ball hit this brick (using the brick's 3-character width)
          const brickX = brick.x * 4 + 1;
          
          if (newBall.y === brick.y && 
              newBall.x >= brickX && 
              newBall.x < brickX + 3) {
            
            // Hit a brick - reverse direction and hide brick
            newBall.dy = -newBall.dy;
            newBricks[i] = { ...brick, visible: false };
            brickHit = true;
            
            // Update score
            const newScore = prevState.score + (10 * prevState.level);
            
            break; // Only hit one brick per update
          }
        }
      }
      
      // Count remaining visible bricks AFTER possibly hitting one
      let visibleBricksRemaining = 0;
      for (let i = 0; i < newBricks.length; i++) {
        if (newBricks[i].visible) {
          visibleBricksRemaining++;
        }
      }
      
      // If no visible bricks remain, level complete
      if (visibleBricksRemaining === 0) {
        const nextLevel = prevState.level + 1;
        
        if (nextLevel > 10) {
          // Beat all levels!
          if (gameIntervalRef.current) {
            clearInterval(gameIntervalRef.current);
            gameIntervalRef.current = null;
          }
          
          setOutput(prev => [
            ...prev.slice(0, -1), // Remove the last game board
            renderGameBoard({
              ...prevState,
              bricks: newBricks,
              ball: newBall,
              score: prevState.score + (brickHit ? 10 * prevState.level : 0)
            }),
            "🎉 CONGRATULATIONS! You completed all levels!",
            `Final score: ${prevState.score + (brickHit ? 10 * prevState.level : 0)}`,
            "Press R to play again or Q to quit."
          ]);
          
          return {
            ...prevState,
            bricks: newBricks,
            ball: newBall,
            score: prevState.score + (brickHit ? 10 * prevState.level : 0),
            gameRunning: false,
            gameOver: true
          };
        }
        
        // Next level
        setOutput(prev => [
          ...prev.slice(0, -1), // Remove the last game board
          renderGameBoard({
            ...prevState,
            bricks: newBricks,
            ball: newBall,
            score: prevState.score + (brickHit ? 10 * prevState.level : 0)
          }),
          `Level ${prevState.level} Complete! +${10 * prevState.level} points`,
          `Advancing to Level ${nextLevel}...`,
          "Press S or SPACE to start next level!"
        ]);
        
        // Initialize the next level
        setTimeout(() => {
          initBrickBreaker(nextLevel);
        }, 100);
        
        return {
          ...prevState,
          bricks: newBricks,
          ball: newBall,
          score: prevState.score + (brickHit ? 10 * prevState.level : 0),
          gameRunning: false,
          levelComplete: true
        };
      }
      
      // Update brick state and score if a brick was hit
      if (brickHit) {
        const updatedState = {
          ...prevState,
          bricks: newBricks,
          ball: newBall,
          score: prevState.score + (10 * prevState.level)
        };
        
        // Update the game board in the output
        setOutput(prev => [
          ...prev.slice(0, -1), // Remove the last game board
          renderGameBoard(updatedState)
        ]);
        
        return updatedState;
      }
      
      // Just update ball position
      const updatedState = {
        ...prevState,
        ball: newBall
      };
      
      // Update the game board in the output
      setOutput(prev => [
        ...prev.slice(0, -1), // Remove the last game board
        renderGameBoard(updatedState)
      ]);
      
      return updatedState;
    });
  }, []); // Remove gameState from dependency array to prevent recreation of the function
  
  // Initialize brick breaker game
  const initBrickBreaker = useCallback((level: number = 1) => {
    const width = 40;
    const height = 20;
    
    // Create bricks based on level
    const bricksPerRow = 10;
    const numRows = 1 + Math.min(level, 5); // More rows for higher levels (max 6)
    const bricks: Brick[] = [];
    
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < bricksPerRow; x++) {
        // Create patterns based on level
        if (level > 1) {
          // Skip some bricks for patterns in higher levels
          if (level === 2 && x % 2 === 0) continue;
          if (level === 3 && (x + y) % 2 === 0) continue;
          if (level === 4 && x % 3 === 0) continue;
          if (level === 5 && y % 2 === 1 && x % 2 === 0) continue;
          if (level === 6 && x === 3) continue;
          if (level === 7 && (x === 2 || x === 7)) continue;
          if (level === 8 && (x + y) % 3 === 0) continue;
          if (level === 9 && (x * y) % 3 === 0) continue;
          if (level === 10 && (x === 0 || x === 9 || y === 0 || y === numRows - 1)) continue;
        }
        
        bricks.push({
          x,
          y: y + 2, // Start bricks a few rows down
          visible: true
        });
      }
    }
    
    // Initialize new game state
    const newGameState = {
      bricks,
      ball: {
        x: Math.floor(width / 2),
        y: height - 3,
        dx: Math.random() > 0.5 ? 1 : -1, // Random initial direction
        dy: -1 // Always go up initially
      },
      paddle: {
        x: Math.floor(width / 2) - 3,
        length: 6
      },
      score: level === 1 ? 0 : gameState.score, // Keep score when leveling up
      lives: level === 1 ? 3 : gameState.lives, // Keep lives when leveling up
      level,
      gameRunning: false,
      gameOver: false,
      levelComplete: false,
      width,
      height
    };
    
    setGameState(newGameState);
    
    // Start the game paused
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    
    // Add game instructions to terminal output
    setOutput(prev => [
      ...prev,
      "",
      "=== BRICK BREAKER - LEVEL " + level + " ===",
      "Controls:",
      "  A/D or Left/Right: Move paddle",
      "  S or Space: Start/Pause game",
      "  Q: Quit game",
      "",
      "Press S or SPACE to start the game!",
      renderGameBoard(newGameState) // Use the new game state instead of the not-yet-updated state
    ]);
    
    // Ensure terminal has focus
    if (terminalDivRef.current) {
      terminalDivRef.current.focus();
    }
  }, [gameState.score, gameState.lives]);

  useEffect(() => {
    inputRef.current?.focus();
    
    // Cleanup any game interval if component unmounts
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, []);

  // Focus the terminal div when in game mode
  useEffect(() => {
    if (gameMode === 'brickbreaker') {
      // Focus the terminal container to capture keyboard events
      setTimeout(() => {
        if (terminalDivRef.current) {
          terminalDivRef.current.focus();
          console.log('Set focus to terminal div for game controls');
        }
      }, 100);
    } else {
      // Focus the input field when not in game mode
      inputRef.current?.focus();
    }
  }, [gameMode]);
 
  // Global keyboard handler for when in game mode
  useEffect(() => {
    if (!gameMode) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameMode !== 'brickbreaker') return;
      
      if (e.key === 'q' || e.key === 'Q') {
        // Quit game
        if (gameIntervalRef.current) {
          clearInterval(gameIntervalRef.current);
          gameIntervalRef.current = null;
        }
        
        setGameMode(null);
        setOutput(prev => [...prev, "\nExiting Brick Breaker. Thanks for playing!"]);
        return;
      }
      
      if (e.key === 'r' || e.key === 'R') {
        // Restart game
        initBrickBreaker(1);
        return;
      }
      
      if ((e.key === 's' || e.key === 'S' || e.key === ' ') && !gameState.gameOver) {
        // Start/pause game
        e.preventDefault();
        setGameState(prev => {
          const newState = { ...prev, gameRunning: !prev.gameRunning };
          
          if (newState.gameRunning) {
            // Start game loop
            if (gameIntervalRef.current) {
              clearInterval(gameIntervalRef.current);
              gameIntervalRef.current = null;
            }
            
            // Use a shorter interval for smoother ball movement
            gameIntervalRef.current = setInterval(() => {
              updateGame();
            }, 120); // Make game slightly faster for better gameplay
            
            // Only add "Game started!" once to avoid message spam
            if (!prev.gameRunning) {
              setOutput(prev => [...prev.slice(0, -1), "Game started!", renderGameBoard(newState)]);
            }
          } else {
            // Pause game
            if (gameIntervalRef.current) {
              clearInterval(gameIntervalRef.current);
              gameIntervalRef.current = null;
            }
            
            // Only add "Game paused!" once to avoid message spam
            if (prev.gameRunning) {
              setOutput(prev => [...prev.slice(0, -1), "Game paused! Press S or SPACE to resume.", renderGameBoard(newState)]);
            }
          }
          
          return newState;
        });
        
        return;
      }
      
      if (!gameState.gameRunning) return;
      
      // Paddle movement
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setGameState(prev => {
          const updatedState = {
            ...prev,
            paddle: {
              ...prev.paddle,
              x: Math.max(1, prev.paddle.x - 2)
            }
          };
          
          // Update the game board immediately for responsive controls
          setOutput(prevOutput => [
            ...prevOutput.slice(0, -1), // Remove the last game board
            renderGameBoard(updatedState)
          ]);
          
          return updatedState;
        });
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        e.preventDefault();
        setGameState(prev => {
          const updatedState = {
            ...prev,
            paddle: {
              ...prev.paddle,
              x: Math.min(prev.width - prev.paddle.length - 1, prev.paddle.x + 2)
            }
          };
          
          // Update the game board immediately for responsive controls
          setOutput(prevOutput => [
            ...prevOutput.slice(0, -1), // Remove the last game board
            renderGameBoard(updatedState)
          ]);
          
          return updatedState;
        });
      }
    };
    
    // Add global event listener instead of relying on div focus
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameMode, gameState, initBrickBreaker, updateGame]);

  const handleCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase().trim();
    const args = lowerCmd.split(' ');
    const mainCommand = args[0];
    
    const commands: Record<string, string> = {
      help: 'Available commands:\n  help - Show this help message\n  clear - Clear the terminal\n  about - About this terminal\n  contact - Contact information\n  games - List available games\n  brickbreaker - Play Brick Breaker game (10 levels)',
      about: 'MyOS Terminal - A Unix-like terminal experience',
      contact: 'Email: adityaperswal@gmail.com\nGitHub: github.com/aperswal',
      clear: '',
      games: 'Available games:\n  brickbreaker - Classic brick breaking game with 10 levels\n\nTo play a game, type its name as a command.',
    };

    if (mainCommand === 'clear') {
      setOutput([]);
      return;
    }
    
    if (mainCommand === 'brickbreaker') {
      setGameMode('brickbreaker');
      initBrickBreaker(1);
      return;
    }

    const response = commands[mainCommand] || `Command not found: ${cmd}`;
    setOutput(prev => [...prev, `> ${cmd}`, response]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input.trim());
      setInput('');
    }
  };

  return (
    <div 
      ref={terminalDivRef}
      className="bg-black text-green-500 p-4 font-mono h-full flex flex-col" 
      tabIndex={0}
      style={{ outline: 'none' }} // Remove focus outline for cleaner look
    >
      <div className="flex-1 overflow-auto">
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      {!gameMode && (
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="mr-2">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            autoFocus
          />
        </form>
      )}
      {gameMode === 'brickbreaker' && (
        <div className="mt-2 text-center text-xs">
          <p>Game Controls: Space = Start/Pause | A/D = Move | R = Restart | Q = Quit</p>
        </div>
      )}
    </div>
  );
};

export const Terminal = withNoSSR(TerminalComponent); 