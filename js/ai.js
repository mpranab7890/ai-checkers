class AI {
  constructor(depth) {
    AI.depth = depth;
    AI.bestMove = {};
  }

  static makeCopy = (elements) => {
    var copyOfElement = elements.map((element) => {
      return { ...element };
    });

    return copyOfElement;
  };

  static getMoveFromAI = (squareBlocks, redPieces, blackPieces) => {
    AI.minimax(
      AI.makeCopy(squareBlocks),
      AI.makeCopy(redPieces),
      AI.makeCopy(blackPieces),
      AI.depth,
      INITIAL_ALPHA,
      INITIAL_BETA,
      true
    );

    return AI.bestMove;
  };

  static calculateHeuristic(redPieces, blackPieces) {
    let redScore = 0;
    let blackScore = 0;
    redPieces.forEach((redPiece) => {
      if (redPiece.isKing) {
        redScore += 5 + 8 + 2;
      } else {
        redScore += 5 + Math.floor(redPiece.squareNumber / 8);
      }
    });

    blackPieces.forEach((blackPiece) => {
      if (blackPiece.isKing) {
        blackScore += 5 + 8 + 2;
      } else {
        blackScore += 5 + (7 - Math.floor(blackPiece.squareNumber / 8));
      }
    });
    return redScore - blackScore;

    // return Math.random() * 1000;
  }

  static minimax(squareBlocks, redPieces, blackPieces, depth, alpha, beta, maximizingPlayer) {
    if (
      depth === 0 ||
      CheckersUtils.checkGameOver(squareBlocks, redPieces) ||
      CheckersUtils.checkGameOver(squareBlocks, blackPieces)
    ) {
      return AI.calculateHeuristic(redPieces, blackPieces);
    }

    if (maximizingPlayer) {
      var maxEval = -10000;
      let [possibleMoves, capturePossible] = AI.possibleMoves(squareBlocks, redPieces);
      // console.log(possibleMoves);
      for (const possibleMove of possibleMoves) {
        // console.log(possibleMove, depth);
        let [updatedSquareBlocks, updatedRedPieces, updatedBlackPieces] = AI.makeMove(
          possibleMove,
          capturePossible,
          AI.makeCopy(squareBlocks),
          AI.makeCopy(redPieces),
          AI.makeCopy(blackPieces),
          true
        );

        var evaluation = AI.minimax(
          updatedSquareBlocks,
          updatedRedPieces,
          updatedBlackPieces,
          depth - 1,
          alpha,
          beta,
          false
        );

        if (evaluation > maxEval) {
          maxEval = evaluation;
          if (depth == AI.depth) {
            AI.bestMove = possibleMove;
          }
        }

        alpha = Math.max(alpha, evaluation);
        //console.log(alpha);
        if (beta <= alpha) {
          break;
        }
      }
      return maxEval;
    } else {
      var minEval = +10000;

      let [possibleMoves, capturePossible] = AI.possibleMoves(squareBlocks, blackPieces);

      for (const possibleMove of possibleMoves) {
        let [updatedSquareBlocks, updatedRedPieces, updatedBlackPieces] = AI.makeMove(
          possibleMove,
          capturePossible,
          AI.makeCopy(squareBlocks),
          AI.makeCopy(redPieces),
          AI.makeCopy(blackPieces),
          false
        );
        let evaluation = AI.minimax(
          updatedSquareBlocks,
          updatedRedPieces,
          updatedBlackPieces,
          depth - 1,
          alpha,
          beta,
          true
        );
        //console.log('Human: ' + evaluation + ' ' + depth);

        minEval = Math.min(minEval, evaluation);

        beta = Math.min(beta, evaluation);

        if (beta <= alpha) {
          break;
        }
      }

      // console.log(beta);
      return minEval;
    }
  }

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
