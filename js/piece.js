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
      this.pieceElement.setAttribute('class', RED_PIECE_STYLE_CLASS);
    } else if (this.type == BLACK_PIECE) {
      this.pieceElement.setAttribute('class', BLACK_PIECE_STYLE_CLASS);
    }
  };

  update = (squareNumber) => {
    this.squareNumber = squareNumber;
  };

  upgradeToKing = () => {
    this.isKing = true;

    if (this.type === RED_PIECE) {
      this.pieceElement.setAttribute('class', RED_KING_STYLE_CLASS);
    } else {
      this.pieceElement.setAttribute('class', BLACK_KING_STYLE_CLASS);
    }
  };
}
