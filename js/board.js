class Board {
  constructor() {}
  //Initialize board with squares and pieces
  initBoard = (squareArray, redPieces, blackPieces) => {
    var rowCount = -1;
    var leftLabelStart = BLOCKS_PER_ROW;
    for (let i = 0; i < TOTAL_BLOCKS; i++) {
      if (i % BLOCKS_PER_ROW === 0) {
        rowCount++;
        var squareRow = document.createElement('tr');
        DOM_board.appendChild(squareRow);
      }
      var piece = NO_PIECE;
      var squareElement = document.createElement('td');
      squareElement.setAttribute('id', i);
      var pieceElement = document.createElement('div');
      if (i < RED_PIECE_END_BLOCK && (i + rowCount) % TYPES_OF_BLOCKS != 0) {
        redPieces.push(new Piece(pieceElement, i, RED_PIECE));
        piece = RED_PIECE;
      } else if (i >= BLACK_PIECE_START_BLOCK && (i + rowCount) % TYPES_OF_BLOCKS != 0) {
        blackPieces.push(new Piece(pieceElement, i, BLACK_PIECE));
        piece = BLACK_PIECE;
      }

      if (i > LAST_ROW_START) {
        var bottomLabel = document.createElement('p');
        bottomLabel.innerText = BOARD_LABELS[i % BLOCKS_PER_ROW];
        bottomLabel.setAttribute('class', 'bottom-labels');
        squareElement.appendChild(bottomLabel);
      }

      if (i % BLOCKS_PER_ROW === 0) {
        var leftLabel = document.createElement('p');
        leftLabel.innerText = leftLabelStart--;
        leftLabel.setAttribute('class', 'left-labels');
        squareElement.appendChild(leftLabel);
      }

      squareElement.appendChild(pieceElement);
      squareRow.appendChild(squareElement);
      squareArray.push(new Square(squareElement, i, rowCount, piece));
    }
  };
}
