class Piece {
  constructor(pieceElement, squareNumber, type) {
    this.pieceElement = pieceElement;
    this.squareNumber = squareNumber;
    this.type = type;
    this.isKing = false;
    this.stylePiece();
  }

  stylePiece = () => {
    if (this.type === RED_PIECE) {
      this.pieceElement.setAttribute('class', 'red-piece');
    } else if (this.type == BLACK_PIECE) {
      this.pieceElement.setAttribute('class', 'black-piece');
    }
  };

  update = (squareNumber) => {
    this.squareNumber = squareNumber;
  };

  upgradeToKing = () => {
    this.isKing = true;

    if (this.type === RED_PIECE) {
      this.pieceElement.setAttribute('class', 'red-king');
    } else {
      this.pieceElement.setAttribute('class', 'black-king');
    }
  };
}
