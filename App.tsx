import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

// Card type definition
type Card = {
  id: number;
  letter: string;
  isFlipped: boolean;
  isMatched: boolean;
};

// Create initial cards array with pairs of letters
const createCards = (): Card[] => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const pairs = [...letters, ...letters];
  
  return pairs
    .sort(() => Math.random() - 0.5)
    .map((letter, index) => ({
      id: index,
      letter,
      isFlipped: false,
      isMatched: false,
    }));
};

function App() {
  const [cards, setCards] = useState<Card[]>(createCards());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Check if all cards are matched
  useEffect(() => {
    if (cards.every(card => card.isMatched)) {
      setGameWon(true);
    }
  }, [cards]);

  // Handle card click
  const handleCardClick = (id: number) => {
    if (
      isChecking ||
      flippedCards.length === 2 ||
      cards[id].isFlipped ||
      cards[id].isMatched
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);

    // If this is the second card, check for a match
    if (flippedCards.length === 1) {
      setIsChecking(true);
      setMoves(moves + 1);

      const firstCard = cards[flippedCards[0]];
      const secondCard = cards[id];

      if (firstCard.letter === secondCard.letter) {
        // Match found
        newCards[flippedCards[0]].isMatched = true;
        newCards[id].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        // No match, flip cards back
        setTimeout(() => {
          newCards[flippedCards[0]].isFlipped = false;
          newCards[id].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  // Reset game
  const resetGame = () => {
    setCards(createCards());
    setFlippedCards([]);
    setIsChecking(false);
    setMoves(0);
    setGameWon(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Memory Game</h1>
          <div className="flex justify-center items-center gap-4">
            <p className="text-lg text-gray-600">Moves: {moves}</p>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              New Game
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-xl cursor-pointer transform transition-all duration-300
                ${card.isFlipped || card.isMatched
                  ? 'rotate-y-180 bg-white'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600'}
                ${card.isMatched ? 'ring-4 ring-green-400' : ''}
                hover:scale-105
              `}
            >
              <div className="w-full h-full flex items-center justify-center">
                {(card.isFlipped || card.isMatched) && (
                  <span className="text-4xl font-bold text-gray-800 transform rotate-y-180">
                    {card.letter}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Win Message */}
        {gameWon && (
          <div className="mt-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow-lg inline-block">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Sparkles className="text-yellow-500" />
                Congratulations!
                <Sparkles className="text-yellow-500" />
              </h2>
              <p className="text-gray-600 mt-2">
                You won in {moves} moves!
              </p>
              <button
                onClick={resetGame}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;