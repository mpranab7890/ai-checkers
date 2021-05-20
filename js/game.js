class Game {
  constructor() {
    this.squareBlocks = [];
    this.redPieces = [];
    this.blackPieces = [];
    this.possibleMoves = [];
    this.turn = BLACK_PIECE;

    this.pieceClicked = false;
    this.capturePossible = false;

    this.currentPieceClicked = {};

    this.board = new Board();
  }

  initialize = () => {
    //Initialize board
    this.board.initBoard(this.squareBlocks, this.redPieces, this.blackPieces);
    this.updateScore();
    this.allCaptureMoves = CheckersUtils.getAllCaptureMoves(this.squareBlocks, this.blackPieces);

    //Event Listener for red piece
    this.redPieces.forEach((redPiece) => {
      redPiece.pieceElement.addEventListener('click', () => {
        if (this.turn === RED_PIECE) {
          this.handlePieceClick(redPiece);
        }
      });
    });

    //Event listener for black piece
    this.blackPieces.forEach((blackPiece) => {
      blackPiece.pieceElement.addEventListener('click', () => {
        if (this.turn === BLACK_PIECE) {
          this.handlePieceClick(blackPiece);
        }
      });
    });

    //Event listener for each square blocks
    this.squareBlocks.forEach((square) => {
      square.squareElement.addEventListener('click', () => this.handleBoardClick(square));
    });
  };

  //Event handler function for click event on pieces
  handlePieceClick = (piece) => {
    this.pieceClicked = true;
    this.currentPieceClicked = piece;

    //Removes borders on the previous squares corresponding to possible moves
    if (this.possibleMoves.length != 0) {
      this.removeBorders(this.possibleMoves);
    }

    //Checks if opponent's piece capture is possible
    if (Object.keys(this.allCaptureMoves).length != 0) {
      this.possibleMoves = this.allCaptureMoves[piece.squareNumber] ? this.allCaptureMoves[piece.squareNumber] : [];
      this.capturePossible = true;
    }

    //If capture is not possible, looks for a normal move
    else {
      if (piece.isKing) {
        let moves1 = CheckersUtils.getMove(piece.squareNumber, RED_PIECE, this.squareBlocks);
        let moves2 = CheckersUtils.getMove(piece.squareNumber, BLACK_PIECE, this.squareBlocks);
        this.possibleMoves = moves1.concat(moves2);
      } else {
        this.possibleMoves = CheckersUtils.getMove(piece.squareNumber, piece.type, this.squareBlocks);
      }
    }

    //Highlights squares with borders corresponding to possible moves
    this.highlightSquares(this.possibleMoves);
  };

  //Event handler function for click event on square blocks
  handleBoardClick = (square) => {
    if (this.pieceClicked) {
      if (
        square.squareNumber != this.currentPieceClicked.squareNumber &&
        this.possibleMoves.includes(square.squareNumber)
      ) {
        square.addPieceToDOM(this.currentPieceClicked.pieceElement, this.currentPieceClicked.type);
        this.squareBlocks[this.currentPieceClicked.squareNumber].removePieceFromDOM();
        if (this.capturePossible) {
          this.captureOpponentPiece(square);
          this.updateScore();
        }
        this.currentPieceClicked.update(square.squareNumber);
        this.resetParametersForNextPlayer(square);
      }
    }
  };

  //Capture opponent's piece. Removes captured piece from the array and removes the piece element from DOM
  captureOpponentPiece = (square) => {
    let pieceToRemove = (this.currentPieceClicked.squareNumber + square.squareNumber) / 2;
    if (this.turn === RED_PIECE) {
      this.blackPieces = this.blackPieces.filter((blackPiece) => {
        return blackPiece.squareNumber != pieceToRemove;
      });
    } else {
      this.redPieces = this.redPieces.filter((redPiece) => {
        return redPiece.squareNumber != pieceToRemove;
      });
    }
    this.squareBlocks[pieceToRemove].squareElement.getElementsByTagName('div')[0].replaceWith();
    this.squareBlocks[pieceToRemove].removePieceFromDOM();
  };

  resetParametersForNextPlayer = (square) => {
    this.removeBorders(this.possibleMoves);
    var c = [];

    //c = CheckersUtils.getCaptureMove(square.squareNumber, this.currentPieceClicked.type, this.squareBlocks);
    c = CheckersUtils.getAllCaptureMoves(this.squareBlocks, [this.currentPieceClicked])[square.squareNumber];
    c = c ? c : [];
    if (this.capturePossible && c.length != 0) {
      this.possibleMoves = c;
      this.highlightSquares(this.possibleMoves);
    } else {
      if (!this.currentPieceClicked.isKing && CheckersUtils.possibleKingUpgrade(this.turn, square.squareNumber)) {
        this.currentPieceClicked.upgradeToKing();
      }
      this.turn = this.turn == RED_PIECE ? BLACK_PIECE : RED_PIECE;
      let nextPlayer = this.turn == RED_PIECE ? this.redPieces : this.blackPieces;
      this.pieceClicked = false;
      this.capturePossible = false;
      this.allCaptureMoves = CheckersUtils.getAllCaptureMoves(this.squareBlocks, nextPlayer);
    }
  };

  //Update dom elements according to the remaining number of pieces
  updateScore = () => {
    DOM_redScore.innerHTML = this.redPieces.length;
    DOM_blackScore.innerHTML = this.blackPieces.length;
  };

  //Highlight squares by adding border for all possible moves for a piece
  highlightSquares = (possibleMoves) => {
    possibleMoves.forEach((possibleMove) => {
      this.squareBlocks[possibleMove].squareElement.classList.add('bordered-square');
    });
  };

  //Removes the previously added borders to squares corresponding to possible moves
  removeBorders = (possibleMoves) => {
    possibleMoves.forEach((possibleMove) => {
      this.squareBlocks[possibleMove].squareElement.classList.remove('bordered-square');
    });
  };
}
