class Square {
  constructor(squareElement, squareNumber, rowCount, piece) {
    this.squareElement = squareElement;
    this.squareNumber = squareNumber;
    this.rowCount = rowCount;
    this.piece = piece;

    this.styleSquare();
  }

  styleSquare = () => {
    this.squareElement.style.width = parseInt(getComputedStyle(DOM_board).width) / BLOCKS_PER_ROW + 'px';
    this.squareElement.style.height = parseInt(getComputedStyle(DOM_board).height) / BLOCKS_PER_ROW + 'px';
    if ((this.squareNumber + this.rowCount) % TYPES_OF_BLOCKS === 0) {
      this.squareElement.setAttribute('class', WHITE_BLOCK_STYLE_CLASS);
    } else {
      this.squareElement.setAttribute('class', BLACK_BLOCK_STYLE_CLASS);
    }
  };

  removePieceFromDOM = () => {
    let emptyElement = document.createElement('div');
    this.squareElement.appendChild(emptyElement);
    this.piece = NO_PIECE;
  };

  addPieceToDOM = (pieceElement, piece) => {
    this.squareElement.getElementsByTagName('div')[0].replaceWith(pieceElement);
    this.piece = piece;
  };
}
