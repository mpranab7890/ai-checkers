class CheckersUtils {
  /**
   * Calculates all the possible moves for the current player
   *
   * @param {Array<Object>} squareBlocks - represents all square blocks of board
   * @param {Array<Object>} player - represents all the pieces of current player
   *
   * @returns {Object} - all the possible moves for the current player
   */
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

  /**
   * Calculates the possible moves for a particular piece on a particular square block
   *
   * @param {int} squareNumber - Square block number
   * @param {String} playerColor - Color of the pieces of the current player
   * @param {Array<Object>} squareBlocks - represents all square blocks of board
   *
   * @returns {Array} - all the possible square blocks to move for the current player
   */

  static getMove(squareNumber, playerColor, squareBlocks) {
    var index = playerColor === RED_PIECE ? 1 : -1;
    var oppositionColor = playerColor == RED_PIECE ? BLACK_PIECE : RED_PIECE;
    var temp = new Array();
    if (
      (playerColor === RED_PIECE && squareNumber <= LAST_ROW_START) ||
      (playerColor === BLACK_PIECE && squareNumber > FIRST_ROW_END)
    ) {
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

  /**
   * Calculates all the possible capture moves for the current player
   *
   * @param {Array<Object>} squareBlocks - represents all square blocks of board
   * @param {Array<Object>} player - represents all the pieces of current player
   *
   * @returns {Object} - all the possible capture moves for the current player
   */
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
      } else if (CheckersUtils.checkForValidCapture(playerColor, playerPiece.squareNumber)) {
        result = CheckersUtils.getCaptureMove(playerPiece.squareNumber, playerColor, oppositionColor, squareBlocks);
      }
      if (result.length != 0) {
        captureMoves[playerPiece.squareNumber] = result;
      }
    });

    return captureMoves;
  }

  /**
   * Checks for valid capture
   *
   * @param {String} playerColor - Color of all the pieces of the current player
   * @param {int} squareNumber - Square block number
   *
   * @returns {bool} - represents if capture is valid or not
   */

  static checkForValidCapture(playerColor, squareNumber) {
    if (
      (playerColor === BLACK_PIECE && squareNumber > BLACK_PIECE_CAPTURE_LIMIT) ||
      (playerColor == RED_PIECE && squareNumber < RED_PIECE_CAPTURE_LIMIT)
    ) {
      return true;
    }
    return false;
  }

  /**
   * Calculates the capture moves for a particular piece on a particular square block
   *
   * @param {int} squareNumber - Square block number
   * @param {String} playerColor - Color of all the pieces of the current player
   * @param {String} oppositionColor - Color of all the pieces of the opposition player
   * @param {Array<Object>} squareBlocks - represents all square blocks of board
   *
   * @returns {Array} - all the possible square blocks to move for the current player following the capture
   */

  static getCaptureMove(squareNumber, playerColor, oppositionColor, squareBlocks) {
    var index = playerColor === RED_PIECE ? 1 : -1;
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

  /**
   * Converts square block number to board labels.
   *
   * @param {int} squareNumber - Square block number
   *
   * @returns {String} - Board label corresponding to square block number
   */

  static convertToLabels = (squareNumber) => {
    let label = '';
    label += BOARD_LABELS[squareNumber % BLOCKS_PER_ROW];
    label += BLOCKS_PER_ROW - Math.floor(squareNumber / BLOCKS_PER_ROW);
    return label;
  };

  /**
   * Checks if upgrade to king is possible
   *
   * @param {String} pieceColor - Color of all the pieces of the current player
   * @param {int} squareNumber - Square block number
   *
   * @returns {bool} - represents if upgrade to king is possible or not
   *
   */

  static possibleKingUpgrade = (pieceColor, squareNumber) => {
    if (pieceColor === BLACK_PIECE && squareNumber < 8) {
      return true;
    } else if (pieceColor === RED_PIECE && squareNumber > 55) {
      return true;
    }
    return false;
  };

  /**
   * Checks if game is over or not
   *
   * @param {Array<Object>} squareBlocks - represents all square blocks of board
   * @param {Array<Object>} player - represents all the pieces of current player
   *
   * @returns {bool} - represents if game is over or not
   */

  static checkGameOver = (squareBlocks, player) => {
    if (player.length === 0) {
      return true;
    } else if (
      Object.keys(CheckersUtils.getAllCaptureMoves(squareBlocks, player)).length === 0 &&
      Object.keys(CheckersUtils.getAllPossibleMoves(squareBlocks, player)).length === 0
    ) {
      return true;
    } else {
      return false;
    }
  };
}
