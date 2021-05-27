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

  initialize = (gameMode = 'none', depth = 4) => {
    this.gameMode = gameMode;
    this.depth = depth;
    //Initialize board
    this.board.initBoard(this.squareBlocks, this.redPieces, this.blackPieces);
    this.updateScore();
    this.allCaptureMoves = CheckersUtils.getAllCaptureMoves(this.squareBlocks, this.blackPieces);

    new AI(this.depth);
    DOM_turn.innerText = BLACK_PIECE;
    DOM_turn.setAttribute('class', `${this.turn}-text`);

    //Event Listener for red piece. No need to set up onclick listener for AI mode.
    if (this.gameMode != AI_MODE) {
      this.redPieces.forEach((redPiece) => {
        redPiece.pieceElement.addEventListener('click', () => {
          if (this.turn === RED_PIECE) {
            this.handlePieceClick(redPiece);
          }
        });
      });
    }

    //Event listener for black piece
    this.blackPieces.forEach((blackPiece) => {
      blackPiece.pieceElement.addEventListener('click', () => {
        if (this.turn === BLACK_PIECE) {
          console.log('here');
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
    pieceClickAudio.play();
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
    if (
      (this.gameMode == AI_MODE && this.turn == RED_PIECE) ||
      (this.pieceClicked &&
        square.squareNumber != this.currentPieceClicked.squareNumber &&
        this.possibleMoves.includes(square.squareNumber))
    ) {
      square.addPieceToDOM(this.currentPieceClicked.pieceElement, this.currentPieceClicked.type);
      this.squareBlocks[this.currentPieceClicked.squareNumber].removePieceFromDOM();
      if (this.capturePossible) {
        this.captureOpponentPiece(square);
        this.updateScore();
      }
      pieceMovementAudio.play();
      this.currentPieceClicked.update(square.squareNumber);
      this.resetParametersForNextPlayer(square);
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
    pieceCaptureAudio.play();
  };

  resetParametersForNextPlayer = (square) => {
    this.removeBorders(this.possibleMoves);
    var nextCaptureJump = [];

    //Check if next capture for same player is available
    nextCaptureJump = CheckersUtils.getAllCaptureMoves(this.squareBlocks, [this.currentPieceClicked])[
      square.squareNumber
    ];
    nextCaptureJump = nextCaptureJump ? nextCaptureJump : [];

    //If double jump is possible, don't switch the turn and add capture move to the list of possible moves
    if (this.capturePossible && nextCaptureJump.length != 0) {
      this.possibleMoves = nextCaptureJump;
      if (this.gameMode === AI_MODE) {
        setTimeout(() => {
          this.AImove(square.squareNumber, nextCaptureJump[0]);
        }, 500);
      } else {
        this.highlightSquares(this.possibleMoves);
      }
    }
    //If another jump is not possible, reset parameters and switch the turn to another player
    else {
      if (!this.currentPieceClicked.isKing && CheckersUtils.possibleKingUpgrade(this.turn, square.squareNumber)) {
        this.currentPieceClicked.upgradeToKing();
      }

      this.turn = this.turn == RED_PIECE ? BLACK_PIECE : RED_PIECE;
      let nextPlayer = this.turn == RED_PIECE ? this.redPieces : this.blackPieces;
      this.pieceClicked = false;
      this.capturePossible = false;
      DOM_turn.innerText = this.turn;
      DOM_turn.setAttribute('class', `${this.turn}-text`);

      if (CheckersUtils.checkGameOver(this.squareBlocks, nextPlayer)) {
        this.handleGameOver(this.turn);
      } else {
        if (this.gameMode == AI_MODE && this.turn == RED_PIECE) {
          setTimeout(() => {
            this.handleAIMove();
          }, 200);
        } else {
          this.allCaptureMoves = CheckersUtils.getAllCaptureMoves(this.squareBlocks, nextPlayer);
          let maximizingPlayer = this.turn === RED_PIECE ? true : false;
          console.log(maximizingPlayer);
          this.recommendedMove = AI.getMoveFromAI(
            this.squareBlocks,
            this.redPieces,
            this.blackPieces,
            maximizingPlayer
          );
          let sourceBlock = parseInt(Object.keys(this.recommendedMove)[0]);
          let destinationBlock = this.recommendedMove[sourceBlock];
          DOM_recommendedMoveSource.innerText = CheckersUtils.convertToLabels(sourceBlock);
          DOM_recommendedMoveDestination.innerText = CheckersUtils.convertToLabels(destinationBlock);
          console.log(sourceBlock, destinationBlock);
        }
      }
    }
  };

  handleAIMove = () => {
    this.bestAIMove = AI.getMoveFromAI(this.squareBlocks, this.redPieces, this.blackPieces, true);
    console.log(this.bestAIMove);
    let sourceBlock = parseInt(Object.keys(this.bestAIMove)[0]);
    let destinationBlock = this.bestAIMove[sourceBlock];
    this.AImove(sourceBlock, destinationBlock);
    //this.allCaptureMoves = CheckersUtils.getAllCaptureMoves(this.squareBlocks, this.blackPieces);
  };

  AImove = (sourceBlock, destinationBlock) => {
    if (Math.abs(sourceBlock - destinationBlock) > 9) {
      this.capturePossible = true;
    }
    let redPieceIndex = this.redPieces.findIndex((r) => r.squareNumber === sourceBlock);
    this.currentPieceClicked = this.redPieces[redPieceIndex];
    this.handleBoardClick(this.squareBlocks[destinationBlock]);
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

  handleGameOver = (previousPlayer) => {
    DOM_gameOver.style.display = 'block';
    let winner = previousPlayer == RED_PIECE ? BLACK_PIECE : RED_PIECE;
    DOM_winner.innerHTML = winner;
    DOM_board.style.opacity = 0.6;
  };

  reset = () => {
    this.squareBlocks = [];
    this.redPieces = [];
    this.blackPieces = [];
    this.possibleMoves = [];
    this.turn = BLACK_PIECE;
    this.pieceClicked = false;
    this.capturePossible = false;
    this.currentPieceClicked = {};
    DOM_board.innerHTML = '';
  };
}
