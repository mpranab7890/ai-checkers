class CheckersUtils {
  static getAllPossibleMoves(squareBlocks, player) {
    var playerColor = player[0].type;
    var possibleMoves = {};
    player.forEach((playerPiece) => {
      if (playerPiece.isKing) {
        let result1 = CheckersUtils.getMove(playerPiece.squareNumber, RED_PIECE, squareBlocks);

        let result2 = CheckersUtils.getMove(playerPiece.squareNumber, BLACK_PIECE, squareBlocks);

        if (!(result1.length === 0 && result2.length === 0)) {
          possibleMoves[playerPiece.squareNumber] = result1.concat(result2);
        }
      } else {
        let result = CheckersUtils.getMove(playerPiece.squareNumber, playerColor, squareBlocks);
        if (result.length != 0) {
          possibleMoves[playerPiece.squareNumber] = result;
        }
      }
    });

    return possibleMoves;
  }

  static getMove(squareNumber, playerColor, squareBlocks) {
    var index = playerColor === RED_PIECE ? 1 : -1;
    var oppositionColor = playerColor == RED_PIECE ? BLACK_PIECE : RED_PIECE;
    var temp = new Array();
    if ((playerColor === RED_PIECE && squareNumber <= 55) || (playerColor === BLACK_PIECE && squareNumber >= 8)) {
      if (squareNumber % BLOCKS_PER_ROW === 0) {
        if (squareBlocks[squareNumber + index * BLOCKS_PER_ROW + 1].piece === NO_PIECE) {
          temp.push(squareNumber + index * BLOCKS_PER_ROW + 1);
        }
      } else if ((squareNumber + 1) % BLOCKS_PER_ROW === 0) {
        if (squareBlocks[squareNumber + index * BLOCKS_PER_ROW - 1].piece === NO_PIECE) {
          temp.push(squareNumber + index * BLOCKS_PER_ROW - 1);
        }
      } else {
        if (squareBlocks[squareNumber + index * BLOCKS_PER_ROW + 1].piece === NO_PIECE) {
          temp.push(squareNumber + index * BLOCKS_PER_ROW + 1);
        }

        if (squareBlocks[squareNumber + index * BLOCKS_PER_ROW - 1].piece === NO_PIECE) {
          temp.push(squareNumber + index * BLOCKS_PER_ROW - 1);
        }
      }
    }

    return temp;
  }

  static getAllCaptureMoves(squareBlocks, player) {
    var playerColor = player[0].type;
    var oppositionColor = playerColor == RED_PIECE ? BLACK_PIECE : RED_PIECE;
    var captureMoves = {};
    player.forEach((playerPiece) => {
      var result = [];
      if (playerPiece.isKing) {
        if (CheckersUtils.checkForValidCapture(playerColor, playerPiece.squareNumber)) {
          var result1 = CheckersUtils.getCaptureMove(
            playerPiece.squareNumber,
            playerColor,
            oppositionColor,
            squareBlocks
          );
          result = result.concat(result1);
        }
        if (CheckersUtils.checkForValidCapture(oppositionColor, playerPiece.squareNumber)) {
          var result2 = CheckersUtils.getCaptureMove(
            playerPiece.squareNumber,
            oppositionColor,
            oppositionColor,
            squareBlocks
          );
          result = result.concat(result2);
        }
        //result = result1.concat(result2);
      } else if (CheckersUtils.checkForValidCapture(playerColor, playerPiece.squareNumber)) {
        result = CheckersUtils.getCaptureMove(playerPiece.squareNumber, playerColor, oppositionColor, squareBlocks);
      }
      if (result.length != 0) {
        captureMoves[playerPiece.squareNumber] = result;
      }
    });

    return captureMoves;
  }

  static checkForValidCapture(playerColor, squareNumber) {
    if (
      (playerColor === BLACK_PIECE && squareNumber > BLACK_PIECE_CAPTURE_LIMIT) ||
      (playerColor == RED_PIECE && squareNumber < RED_PIECE_CAPTURE_LIMIT)
    ) {
      return true;
    }
    return false;
  }

  static getCaptureMove(squareNumber, playerColor, oppositionColor, squareBlocks) {
    var index = playerColor === RED_PIECE ? 1 : -1;
    //var oppositionColor = playerColor == RED_PIECE ? BLACK_PIECE : RED_PIECE;
    var temp = new Array();
    if (squareNumber % BLOCKS_PER_ROW === 0 || (squareNumber - 1) % BLOCKS_PER_ROW === 0) {
      let oppositionIndex = squareNumber + index * BLOCKS_PER_ROW + 1;
      if (squareBlocks[oppositionIndex].piece === oppositionColor) {
        if (squareBlocks[oppositionIndex + index * BLOCKS_PER_ROW + 1].piece === NO_PIECE) {
          temp.push(oppositionIndex + index * BLOCKS_PER_ROW + 1);
        }
      }
    } else if ((squareNumber + 1) % BLOCKS_PER_ROW === 0 || (squareNumber + 2) % BLOCKS_PER_ROW === 0) {
      let oppositionIndex = squareNumber + index * BLOCKS_PER_ROW - 1;
      if (squareBlocks[oppositionIndex].piece === oppositionColor) {
        if (squareBlocks[oppositionIndex + index * BLOCKS_PER_ROW - 1].piece === NO_PIECE) {
          temp.push(oppositionIndex + index * BLOCKS_PER_ROW - 1);
        }
      }
    } else {
      let oppositionIndex1 = squareNumber + index * BLOCKS_PER_ROW + 1;
      if (squareBlocks[oppositionIndex1].piece === oppositionColor) {
        if (squareBlocks[oppositionIndex1 + index * BLOCKS_PER_ROW + 1].piece === NO_PIECE) {
          temp.push(oppositionIndex1 + index * BLOCKS_PER_ROW + 1);
        }
      }

      let oppositionIndex2 = squareNumber + index * BLOCKS_PER_ROW - 1;
      if (squareBlocks[oppositionIndex2].piece === oppositionColor) {
        if (squareBlocks[oppositionIndex2 + index * BLOCKS_PER_ROW - 1].piece === NO_PIECE) {
          temp.push(oppositionIndex2 + index * BLOCKS_PER_ROW - 1);
        }
      }
    }

    return temp;
  }

  static possibleKingUpgrade = (pieceColor, squareNumber) => {
    if (pieceColor === BLACK_PIECE && squareNumber < 8) {
      return true;
    } else if (pieceColor === RED_PIECE && squareNumber > 55) {
      return true;
    }
    return false;
  };

  static checkGameOver = (squareBlocks, player) => {
    if (player.length === 0) {
      return true;
    } else if (
      Object.keys(CheckersUtils.getAllCaptureMoves(squareBlocks, player)).length === 0 &&
      Object.keys(CheckersUtils.getAllPossibleMoves(squareBlocks, player)).length === 0
    ) {
      console.log('No movesss');
      return true;
    } else {
      return false;
    }
  };
}
