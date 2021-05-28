class Square {
  constructor(squareElement, squareNumber, rowCount, piece) {
    this.squareElement = squareElement;
    this.squareNumber = squareNumber;
    this.rowCount = rowCount;
    this.piece = piece;

    this.styleSquare();
  }

  styleSquare = () => {
    console.log(getComputedStyle(DOM_board).height);
    this.squareElement.style.width = parseInt(getComputedStyle(DOM_board).width) / BLOCKS_PER_ROW + 'px';
    this.squareElement.style.height = parseInt(getComputedStyle(DOM_board).height) / BLOCKS_PER_ROW + 'px';
    if ((this.squareNumber + this.rowCount) % TYPES_OF_BLOCKS === 0) {
      this.squareElement.setAttribute('class', 'white-square');
    } else {
      this.squareElement.setAttribute('class', 'black-square');
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
