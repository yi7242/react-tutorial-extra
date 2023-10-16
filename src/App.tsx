import React, { useState } from "react";

type SquareValue = "O" | "X" | null;
interface SquareProps {
  value: SquareValue;
  highlight: boolean;
  onSquareClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, highlight, onSquareClick }) => {
  return (
    <button
      className={highlight ? "square win" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
};

interface BoardProps {
  xIsNext: boolean;
  squares: Array<SquareValue>;
  onPlay: (squares: Array<SquareValue>) => void;
}
const Board: React.FC<BoardProps> = ({ xIsNext, squares, onPlay }) => {
  const winner = calculateWinner(squares);
  let status;
  if (winner.winner) {
    status = "Winner: " + winner.winner;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }
  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares).winner) return;
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  const checkHighlight = (n: Number) => {
    if (winner.line) {
      return winner.line.includes(n);
    }
    return false;
  };
  const board = [...Array(3)].map((_, i) => {
    let threeSquares = [...Array(3)].map((_, j) => {
      let n = 3 * i + j;
      return (
        <Square
          key={n}
          value={squares[n]}
          highlight={checkHighlight(n)}
          onSquareClick={() => handleClick(n)}
        />
      );
    });
    return (
      <div key={i} className="board-row">
        {threeSquares}
      </div>
    );
  });
  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
};
interface IToggleSort {
  isAscend: boolean;
  onAscendClick: () => void;
}

const ToggleSort: React.FC<IToggleSort> = ({ isAscend, onAscendClick }) => {
  return (
    <button onClick={onAscendClick}>
      {isAscend ? "Ascend Order" : "Descend Order"}
    </button>
  );
};
export default function Game() {
  const [history, setHistory] = useState<Array<Array<SquareValue>>>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [isAscend, setIsAscend] = useState<boolean>(true);
  const currentSquares: Array<SquareValue> = history[currentMove];
  const xIsNext: boolean = currentMove % 2 === 0;
  function handlePlay(nextSquares: Array<SquareValue>) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }
  function toggleAscend() {
    setIsAscend(!isAscend);
  }
  const moves = history.map((squares, move) => {
    let description: string;
    if (move === currentMove) {
      return (
        <li key={move}>
          <div>You are at Move #{move}</div>
        </li>
      );
    } else if (move > 0) {
      description = "Go To Move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{isAscend ? moves : moves.reverse()}</ol>
        <ToggleSort isAscend={isAscend} onAscendClick={toggleAscend} />
      </div>
    </div>
  );
}
type WinnerType = {
  winner?: SquareValue;
  line?: Number[];
};
const calculateWinner = (squares: Array<SquareValue>) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const winner: WinnerType = {
        winner: squares[a],
        line: lines[i],
      };
      return winner;
    }
  }
  const winner: WinnerType = {};
  return winner;
};
