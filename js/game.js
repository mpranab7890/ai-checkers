class Game {
  constructor() {
    this.squareBlocks = [];
    this.redPieces = [];
    this.blackPieces = [];
    this.possibleMoves = [];
    this.turn = BLACK_PIECE;
    this.currentPieceClicked = {};

    this.doubleJump = false;
    this.pieceClicked = false;
    this.capturePossible = false;

    this.board = new Board();
  }

  initialize = (gameMode = TWO_PLAYER_MODE, depth = EASY_MODE_DEPTH) => {
    this.gameMode = gameMode;
    this.depth = depth;

    //Initialize board
    this.board.initBoard(this.squareBlocks, this.redPieces, this.blackPieces);
    this.updateScore();
    this.allCaptureMoves = CheckersUtils.getAllCaptureMoves(this.squareBlocks, this.blackPieces);

    //Initialize AI
    new AI(this.depth);

    //Initial DOM modifications
    DOM_turn.innerText = BLACK_PIECE;
    DOM_turn.setAttribute('class', `${this.turn}-text`);

    //Event Listener for red piece. No need to set up onclick listener for AI mode.
    if (this.gameMode != AI_MODE) {
      this.redPieces.forEach((redPiece) => {
        redPiece.pieceElement.addEventListener('click', () => {
          if (this.turn === RED_PIECE && !this.doubleJump) {
            this.handlePieceClick(redPiece);
          }
        });
      });
    }

    //Event listener for black piece
    this.blackPieces.forEach((blackPiece) => {
      blackPiece.pieceElement.addEventListener('click', () => {
        if (this.turn === BLACK_PIECE && !this.doubleJump) {
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
    setTimeout(() => {
      pieceClickAudio.play();
    });
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
      //Add piece to another square block and remove from the current square block
      square.addPieceToDOM(this.currentPieceClicked.pieceElement, this.currentPieceClicked.type);
      this.squareBlocks[this.currentPieceClicked.squareNumber].removePieceFromDOM();

      // Check if capture is possible
      if (this.capturePossible) {
        this.captureOpponentPiece(square);
        this.updateScore();
      }
      setTimeout(() => {
        pieceMovementAudio.play();
      });

      this.currentPieceClicked.update(square.squareNumber);

      // Removes borders from the pieces which can capture opponent's piece
      if (!(this.gameMode == AI_MODE && this.turn == RED_PIECE) && !this.doubleJump) {
        this.removePieceBorders(this.allCaptureMoves, this.turn == RED_PIECE ? this.redPieces : this.blackPieces);
      }

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
    setTimeout(() => {
      pieceCaptureAudio.play();
    });
  };

  // Prepares for next player's turn
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
      this.doubleJump = true;
      this.possibleMoves = nextCaptureJump;
      if (this.gameMode === AI_MODE && this.turn === RED_PIECE) {
        setTimeout(() => {
          this.AImove(square.squareNumber, nextCaptureJump[0]);
        }, 500);
      } else {
        this.highlightSquares(this.possibleMoves);
      }
    }
    //If another jump is not possible, reset parameters and switch the turn to another player
    else {
      // Check if upgrade to king is possible
      if (!this.currentPieceClicked.isKing && CheckersUtils.possibleKingUpgrade(this.turn, square.squareNumber)) {
        this.currentPieceClicked.upgradeToKing();
      }

      // Reset parameters for next player
      this.doubleJump = false;
      this.turn = this.turn == RED_PIECE ? BLACK_PIECE : RED_PIECE;
      let nextPlayer = this.turn == RED_PIECE ? this.redPieces : this.blackPieces;
      this.pieceClicked = false;
      this.capturePossible = false;
      DOM_turn.innerText = this.turn;
      DOM_turn.setAttribute('class', `${this.turn}-text`);

      // Check if game is over
      if (CheckersUtils.checkGameOver(this.squareBlocks, nextPlayer)) {
        this.handleGameOver(this.turn);
      }

      // If game is not over
      else {
        // If game mode is vs Computer, switch turn to AI
        if (this.gameMode == AI_MODE && this.turn == RED_PIECE) {
          setTimeout(() => {
            this.handleAIMove();
          }, 300);
        }

        // If game mode is two player, get capture moves and recommended movesfor next player
        else {
          this.allCaptureMoves = CheckersUtils.getAllCaptureMoves(this.squareBlocks, nextPlayer);
          this.highlightPieces(this.allCaptureMoves, nextPlayer);
          if (this.gameMode === AI_MODE) {
            this.recommendedMove = AI.getMoveFromAI(this.squareBlocks, this.redPieces, this.blackPieces, false);
          }
          // Handles recommended move for next player
          else {
            let maximizingPlayer = this.turn === RED_PIECE ? true : false;

            this.recommendedMove = AI.getMoveFromAI(
              this.squareBlocks,
              this.redPieces,
              this.blackPieces,
              maximizingPlayer
            );
          }

          let sourceBlock = parseInt(Object.keys(this.recommendedMove)[0]);
          let destinationBlock = this.recommendedMove[sourceBlock];

          //DOM modifications for recommended move
          DOM_recommendedMoveSource.innerText = CheckersUtils.convertToLabels(sourceBlock);
          DOM_recommendedMoveSource.setAttribute('class', `${this.turn}-text`);
          DOM_recommendedMoveDestination.innerText = CheckersUtils.convertToLabels(destinationBlock);
          DOM_recommendedMoveDestination.setAttribute('class', `${this.turn}-text`);
        }
      }
    }
  };

  // Get the best move by AI
  handleAIMove = () => {
    this.bestAIMove = AI.getMoveFromAI(this.squareBlocks, this.redPieces, this.blackPieces, true);
    let sourceBlock = parseInt(Object.keys(this.bestAIMove)[0]);
    let destinationBlock = this.bestAIMove[sourceBlock];
    this.AImove(sourceBlock, destinationBlock);
  };

  // Move the piece on the board corresponding to the best move for AI
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

  //Highlight pieces for which capture is possible
  highlightPieces = (captureMovePieces, player) => {
    Object.keys(captureMovePieces).forEach((captureMovePiece) => {
      let index = player.findIndex((p) => p.squareNumber == captureMovePiece);
      player[index].pieceElement.classList.add('bordered-piece');
    });
  };

  //Removes the previously added borders to squares corresponding to possible moves
  removeBorders = (possibleMoves) => {
    possibleMoves.forEach((possibleMove) => {
      this.squareBlocks[possibleMove].squareElement.classList.remove('bordered-square');
    });
  };

  //Removes the previously added borders to pieces
  removePieceBorders = (captureMovePieces, player) => {
    Object.keys(captureMovePieces).forEach((captureMovePiece) => {
      let index = player.findIndex(
        (p) => p.squareNumber == captureMovePieces[captureMovePiece] || p.squareNumber == captureMovePiece
      );
      player[index].pieceElement.classList.remove('bordered-piece');
    });
  };

  // Displays game over menu
  handleGameOver = (previousPlayer) => {
    DOM_gameOver.style.display = 'block';
    let winner = previousPlayer == RED_PIECE ? BLACK_PIECE : RED_PIECE;
    DOM_winner.innerHTML = winner;
    DOM_winner.classList.add(`${winner}-text`);
    DOM_board.style.opacity = 0.6;
  };

  // reset everything to initial state
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
