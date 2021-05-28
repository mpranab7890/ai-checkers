class AI {
  constructor(depth) {
    AI.depth = depth;
    AI.bestRedMove = {};
    AI.bestBlackMove = {};
  }

  /**
   * Makes a deep copy of an array of objects so that the original object is not modified during recursive loop
   *
   * @param {Array<Object>} elements
   *
   * @returns {Array<Object>}
   */
  static makeCopy = (elements) => {
    var copyOfElement = elements.map((element) => {
      return { ...element };
    });

    return copyOfElement;
  };

  /**
   * Entry point for AI algorithm called from game.js
   *
   * @param {Array<Object>} squareBlocks - represents all square blocks of board
   * @param {Array<Object>} redPieces - represents all red pieces on board
   * @param {Array<Object>} blackPieces - represents all black pieces on board
   * @param {bool} maximizingPlayer - represents the type of current player
   *
   * @returns {Object} - the best move for the AI
   */

  static getMoveFromAI = (squareBlocks, redPieces, blackPieces, maximizingPlayer) => {
    AI.minimax(
      AI.makeCopy(squareBlocks),
      AI.makeCopy(redPieces),
      AI.makeCopy(blackPieces),
      AI.depth,
      INITIAL_ALPHA,
      INITIAL_BETA,
      maximizingPlayer
    );
    if (maximizingPlayer) {
      console.log(AI.bestRedMove);
    }
    return maximizingPlayer ? AI.bestRedMove : AI.bestBlackMove;
  };

  /**
   * A static evaluation function which gives a score to the current board state
   *
   * @param {Array<Object>} squareBlocks - represents all square blocks of board
   * @param {Array<Object>} redPieces - represents all red pieces on board
   *
   * @returns {int} - the score for the current board state
   */

  static calculateHeuristic(redPieces, blackPieces) {
    let redScore = 0;
    let blackScore = 0;
    redPieces.forEach((redPiece) => {
      if (redPiece.isKing) {
        redScore += 5 + 8 + 1;
      } else {
        redScore += 5 + Math.floor(redPiece.squareNumber / 8);
      }
    });

    blackPieces.forEach((blackPiece) => {
      if (blackPiece.isKing) {
        blackScore += 5 + 8;
      } else {
        blackScore += 5 + (7 - Math.floor(blackPiece.squareNumber / 8));
      }
    });
    return redScore - blackScore;
  }

  /**
   * The main function for the AI. Recursively evaluates each possible move for each player
   *
   * @param {Array<Object>} squareBlocks - represents all square blocks of board
   * @param {Array<Object>} redPieces - represents all red pieces on board
   * @param {Array<Object>} blackPieces - represents all black pieces on board
   * @param {int} depth - the maximum depth to visit for the game tree
   * @param {int} alpha - the best value till now for the maximizing player
   * @param {int} beta - the best value till now for the minimizing player
   * @param {bool} maximizingPlayer - the type of current player
   *
   * @returns {int} - the best evaluation value for the current game state
   */

  static minimax(squareBlocks, redPieces, blackPieces, depth, alpha, beta, maximizingPlayer) {
    if (
      depth === 0 ||
      CheckersUtils.checkGameOver(squareBlocks, redPieces) ||
      CheckersUtils.checkGameOver(squareBlocks, blackPieces)
    ) {
      return AI.calculateHeuristic(redPieces, blackPieces);
    }

    if (maximizingPlayer) {
      var maxEval = INITIAL_MAX_VALUE;
      //Gets all possible moves for the current game state and current player
      let [possibleMoves, capturePossible] = AI.possibleMoves(squareBlocks, redPieces);
      for (const possibleMove of possibleMoves) {
        //The AI makes it's move on the copy of the board. The original arrays and objects are not modified
        let [updatedSquareBlocks, updatedRedPieces, updatedBlackPieces] = AI.makeMove(
          possibleMove,
          capturePossible,
          AI.makeCopy(squareBlocks),
          AI.makeCopy(redPieces),
          AI.makeCopy(blackPieces),
          maximizingPlayer
        );

        //Recursively calculates the static evaluation for the current move.
        var evaluation = AI.minimax(
          updatedSquareBlocks,
          updatedRedPieces,
          updatedBlackPieces,
          depth - 1,
          alpha,
          beta,
          !maximizingPlayer
        );

        //Maximizing playArray<Object>er selects the move with the maximum value
        if (evaluation > maxEval) {
          maxEval = evaluation;
          if (depth === AI.depth) {
            AI.bestRedMove = possibleMove;
          }
        }

        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) {
          break;
        }
      }
      return maxEval;
    } else {
      var minEval = INITIAL_MIN_VALUE;
      //Gets all possible moves for the current game state and current player
      let [possibleMoves, capturePossible] = AI.possibleMoves(squareBlocks, blackPieces);

      for (const possibleMove of possibleMoves) {
        let [updatedSquareBlocks, updatedRedPieces, updatedBlackPieces] = AI.makeMove(
          possibleMove,
          capturePossible,
          AI.makeCopy(squareBlocks),
          AI.makeCopy(redPieces),
          AI.makeCopy(blackPieces),
          maximizingPlayer
        );
        let evaluation = AI.minimax(
          updatedSquareBlocks,
          updatedRedPieces,
          updatedBlackPieces,
          depth - 1,
          alpha,
          beta,
          !maximizingPlayer
        );

        //Minimizing player selects the move with the maximum value
        if (evaluation < minEval) {
          minEval = evaluation;
          if (depth === AI.depth) {
            AI.bestBlackMove = possibleMove;
          }
        }

        beta = Math.min(beta, evaluation);

        if (beta <= alpha) {
          break;
        }
      }

      return minEval;
    }
  }

  /**
   * All possible moves for current game state and converts them to a suitable form
   *
   * @param {Array<Object>} squareBlocks - represents all square blocks of board
   * @param {Array<Object>} player - represents all the pieces of a current player
   *
   * @returns {Array<Array<Object> , bool>} - all possible moves and a variable representing if capture is possible or not
   */
  static possibleMoves = (squareBlocks, player) => {
    var possibleMoves;
    var capturePossible = false;
    var finalPossibleMoves = [];
    var allCaptureMoves = CheckersUtils.getAllCaptureMoves(squareBlocks, player);
    if (Object.keys(allCaptureMoves).length != 0) {
      possibleMoves = allCaptureMoves;
      capturePossible = true;
    } else {
      possibleMoves = CheckersUtils.getAllPossibleMoves(squareBlocks, player);
    }
    Object.keys(possibleMoves).forEach((sourceBlock) => {
      for (const destinationBlock of possibleMoves[sourceBlock]) {
        finalPossibleMoves.push({ [sourceBlock]: destinationBlock });
      }
    });

    return [finalPossibleMoves, capturePossible];
  };

  /**
   * The player makes it's move on the virtual board. Pieces are added and removed as per the rules of the game
   *
   * @param {Object} possibleMove - A possible move for the player with source and deestination number
   * @param {bool} capturePossible - represents if capture is possible or not
   * @param {Array<Object>} squareBlocks - represents all square blocks of board
   * @param {Array<Object>} redPieces - represents all red pieces on board
   * @param {Array<Object>} blackPieces - represents all black pieces on board
   * @param {bool} turn - the type of current player
   *
   * @returns {Array<Array<Object>, Array<Object>, Array<Object> >} - updated board and pieces after making a move
   */
  static makeMove = (possibleMove, capturePossible, squareBlocks, redPieces, blackPieces, turn) => {
    let kingPossibility = false;
    let sourceBlock = parseInt(Object.keys(possibleMove)[0]);
    let destinationBlock = possibleMove[sourceBlock];
    let pieceToRemove = null;
    let nextCaptureJump = [];

    squareBlocks[sourceBlock].piece = NO_PIECE;
    squareBlocks[destinationBlock].piece = turn ? RED_PIECE : BLACK_PIECE;
    var index;
    if (turn) {
      index = redPieces.findIndex((r) => r.squareNumber === sourceBlock);
      redPieces[index].squareNumber = destinationBlock;
      if (!redPieces[index].isKing && CheckersUtils.possibleKingUpgrade(RED_PIECE, destinationBlock)) {
        redPieces[index].isKing = true;
        kingPossibility = true;
      }
    } else {
      index = blackPieces.findIndex((r) => r.squareNumber === sourceBlock);
      blackPieces[index].squareNumber = destinationBlock;
      if (!blackPieces[index].isKing && CheckersUtils.possibleKingUpgrade(BLACK_PIECE, destinationBlock)) {
        blackPieces[index].isKing = true;
        kingPossibility = true;
      }
    }

    if (capturePossible) {
      pieceToRemove = (sourceBlock + destinationBlock) / 2;

      if (turn) {
        blackPieces = blackPieces.filter((blackPiece) => {
          return blackPiece.squareNumber != pieceToRemove;
        });
      } else {
        redPieces = redPieces.filter((redPiece) => {
          return redPiece.squareNumber != pieceToRemove;
        });
      }
      squareBlocks[pieceToRemove].piece = NO_PIECE;
      nextCaptureJump = CheckersUtils.getAllCaptureMoves(squareBlocks, [turn ? redPieces[index] : blackPieces[index]])[
        destinationBlock
      ];
      nextCaptureJump = nextCaptureJump ? nextCaptureJump : [];
      if (nextCaptureJump.length != 0) {
        [squareBlocks, redPieces, blackPieces] = AI.makeMove(
          { [destinationBlock]: nextCaptureJump[0] },
          true,
          squareBlocks,
          redPieces,
          blackPieces,
          turn
        );
      }
    }

    return [squareBlocks, redPieces, blackPieces];
  };
}
