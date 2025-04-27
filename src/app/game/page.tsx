'use client';

import { useState, useEffect } from 'react';

type Piece = '♔' | '♕' | '♖' | '♗' | '♘' | '♙' | '♚' | '♛' | '♜' | '♝' | '♞' | '♟' | null;
type Board = Piece[][];

// 체스판 초기 배치 (우측 하단이 밝은색 칸이 오도록 수정)
const initialBoard: Board = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
];

export default function ChessGame() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [hasMoved, setHasMoved] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'check' | 'checkmate' | 'stalemate'>('playing');

  const isWhitePiece = (piece: Piece) => piece === piece?.toUpperCase();
  const isCurrentPlayerPiece = (piece: Piece) => isWhitePiece(piece) === isWhiteTurn;

  // 기물의 이동 가능한 위치 계산
  const getValidMoves = (row: number, col: number): [number, number][] => {
    const piece = board[row][col];
    if (!piece) return [];

    const moves: [number, number][] = [];
    const isWhite = isWhitePiece(piece);

    // 폰의 이동
    if (piece === '♙' || piece === '♟') {
      const direction = isWhite ? -1 : 1;
      const startRow = isWhite ? 6 : 1;
      
      // 앞으로 한 칸 이동
      if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
        moves.push([row + direction, col]);
      }
      
      // 처음 위치에서 두 칸 이동
      if (row === startRow && !board[row + direction][col] && !board[row + direction * 2][col]) {
        moves.push([row + direction * 2, col]);
      }
      
      // 대각선으로 상대 기물 잡기
      if (row + direction >= 0 && row + direction < 8) {
        if (col - 1 >= 0 && board[row + direction][col - 1] && isWhitePiece(board[row + direction][col - 1]) !== isWhite) {
          moves.push([row + direction, col - 1]);
        }
        if (col + 1 < 8 && board[row + direction][col + 1] && isWhitePiece(board[row + direction][col + 1]) !== isWhite) {
          moves.push([row + direction, col + 1]);
        }
      }
    }
    
    // 룩의 이동
    else if (piece === '♖' || piece === '♜') {
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dx, dy] of directions) {
        let newRow = row + dx;
        let newCol = col + dy;
        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          if (!board[newRow][newCol]) {
            moves.push([newRow, newCol]);
          } else if (isWhitePiece(board[newRow][newCol]) !== isWhite) {
            moves.push([newRow, newCol]);
            break;
          } else {
            break;
          }
          newRow += dx;
          newCol += dy;
        }
      }
    }
    
    // 나이트의 이동
    else if (piece === '♘' || piece === '♞') {
      const knightMoves = [
        [row - 2, col - 1], [row - 2, col + 1],
        [row - 1, col - 2], [row - 1, col + 2],
        [row + 1, col - 2], [row + 1, col + 2],
        [row + 2, col - 1], [row + 2, col + 1]
      ];
      return knightMoves.filter(([r, c]) => 
        r >= 0 && r < 8 && c >= 0 && c < 8 && 
        (!board[r][c] || isWhitePiece(board[r][c]) !== isWhite)
      ) as [number, number][];
    }
    
    // 비숍의 이동
    else if (piece === '♗' || piece === '♝') {
      const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      for (const [dx, dy] of directions) {
        let newRow = row + dx;
        let newCol = col + dy;
        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          if (!board[newRow][newCol]) {
            moves.push([newRow, newCol]);
          } else if (isWhitePiece(board[newRow][newCol]) !== isWhite) {
            moves.push([newRow, newCol]);
            break;
          } else {
            break;
          }
          newRow += dx;
          newCol += dy;
        }
      }
    }
    
    // 퀸의 이동
    else if (piece === '♕' || piece === '♛') {
      const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
      ];
      for (const [dx, dy] of directions) {
        let newRow = row + dx;
        let newCol = col + dy;
        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          if (!board[newRow][newCol]) {
            moves.push([newRow, newCol]);
          } else if (isWhitePiece(board[newRow][newCol]) !== isWhite) {
            moves.push([newRow, newCol]);
            break;
          } else {
            break;
          }
          newRow += dx;
          newCol += dy;
        }
      }
    }
    
    // 킹의 이동
    else if (piece === '♔' || piece === '♚') {
      const kingMoves = [
        [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
        [row, col - 1], [row, col + 1],
        [row + 1, col - 1], [row + 1, col], [row + 1, col + 1]
      ];
      return kingMoves.filter(([r, c]) => 
        r >= 0 && r < 8 && c >= 0 && c < 8 && 
        (!board[r][c] || isWhitePiece(board[r][c]) !== isWhite)
      ) as [number, number][];
    }

    return moves;
  };

  const handleSquareClick = (row: number, col: number) => {
    const piece = board[row][col];
    
    // 이미 말이 선택된 경우, 이동 시도
    if (selectedPiece) {
      const [selectedRow, selectedCol] = selectedPiece;
      const validMoves = getValidMoves(selectedRow, selectedCol);
      
      // 같은 말을 다시 클릭한 경우, 선택 취소
      if (selectedRow === row && selectedCol === col) {
        setSelectedPiece(null);
        setHasMoved(false);
        return;
      }

      // 유효한 이동인지 확인
      if (validMoves.some(([r, c]) => r === row && c === col)) {
        const newBoard = [...board].map(row => [...row]);
        newBoard[row][col] = newBoard[selectedRow][selectedCol];
        newBoard[selectedRow][selectedCol] = null;
        
        setBoard(newBoard);
        setSelectedPiece(null);
        setHasMoved(true);
        return;
      }

      // 유효하지 않은 위치를 클릭한 경우, 새로운 말 선택 시도
      if (piece && isCurrentPlayerPiece(piece)) {
        setSelectedPiece([row, col]);
        setHasMoved(false);
        return;
      }

      // 유효하지 않은 이동인 경우, 선택 취소
      setSelectedPiece(null);
      setHasMoved(false);
      return;
    }

    // 말이 선택되지 않은 상태에서 현재 턴의 말을 클릭한 경우
    if (piece && isCurrentPlayerPiece(piece)) {
      setSelectedPiece([row, col]);
      setHasMoved(false);
    }
  };

  const isSelected = (row: number, col: number) => {
    if (!selectedPiece) return false;
    const [selectedRow, selectedCol] = selectedPiece;
    return row === selectedRow && col === selectedCol;
  };

  const isValidMove = (row: number, col: number) => {
    if (!selectedPiece) return false;
    const [selectedRow, selectedCol] = selectedPiece;
    const validMoves = getValidMoves(selectedRow, selectedCol);
    return validMoves.some(([r, c]) => r === row && c === col);
  };

  const handleEndTurn = () => {
    if (hasMoved) {
      setIsWhiteTurn(prev => !prev);
      setHasMoved(false);
      setSelectedPiece(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">체스 게임</h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="grid grid-cols-8 gap-0">
            {board.map((row, rowIndex) => (
              row.map((piece, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-16 h-16 flex items-center justify-center text-3xl
                    ${(rowIndex + colIndex) % 2 === 0 ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'}
                    ${isSelected(rowIndex, colIndex) ? 'ring-2 ring-blue-500' : ''}
                    ${selectedPiece && isValidMove(rowIndex, colIndex) ? 'cursor-pointer hover:bg-opacity-70' : 'cursor-default'}
                    ${piece && !isCurrentPlayerPiece(piece) ? 'opacity-50' : ''}
                    transition-colors duration-200
                  `}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {piece}
                </div>
              ))
            ))}
          </div>
        </div>
        <div className="mt-4 text-center space-y-4">
          <p className={`text-lg font-semibold ${isWhiteTurn ? 'text-gray-800' : 'text-gray-600'}`}>
            현재 턴: {isWhiteTurn ? '백색' : '흑색'}
          </p>
          {selectedPiece && (
            <p className="text-sm text-gray-600">
              말을 선택했습니다. 이동할 위치를 클릭하세요.
            </p>
          )}
          {hasMoved && (
            <button
              onClick={handleEndTurn}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              턴 종료
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 