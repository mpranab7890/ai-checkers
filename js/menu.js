// Contains required click handlers for all elements

DOM_playVSFriend.onclick = () => {
  DOM_menu.style.display = 'none';
  game.initialize();
  DOM_boardWrapper.style.display = 'block';
  pieceMovementAudio.play();
};

DOM_playVSComputer.onclick = () => {
  DOM_menuList.style.display = 'none';
  DOM_gameModeList.style.display = 'block';
  pieceMovementAudio.play();
};

DOM_homeButton.onclick = () => {
  game.reset();
  DOM_boardWrapper.style.display = 'none';
  DOM_gameModeList.style.display = 'none';
  DOM_gameOver.style.display = 'none';
  DOM_menu.style.display = 'block';
  DOM_board.style.opacity = 1;
  pieceMovementAudio.play();
};

DOM_returnToMainMenu.onclick = () => {
  game.reset();
  DOM_boardWrapper.style.display = 'none';
  DOM_gameModeList.style.display = 'none';
  DOM_gameOver.style.display = 'none';
  DOM_menu.style.display = 'block';
  DOM_board.style.opacity = 1;
  pieceMovementAudio.play();
};

DOM_easyMode.onclick = () => {
  game.initialize(AI_MODE, EASY_MODE_DEPTH);
  DOM_menuList.style.display = 'block';
  DOM_menu.style.display = 'none';
  DOM_boardWrapper.style.display = 'block';
  pieceMovementAudio.play();
};

DOM_mediumMode.onclick = () => {
  game.initialize(AI_MODE, MEDIUM_MODE_DEPTH);
  DOM_menuList.style.display = 'block';
  DOM_menu.style.display = 'none';
  DOM_boardWrapper.style.display = 'block';
  pieceMovementAudio.play();
};

DOM_hardMode.onclick = () => {
  game.initialize(AI_MODE, HARD_MODE_DEPTH);
  DOM_menuList.style.display = 'block';
  DOM_menu.style.display = 'none';
  DOM_boardWrapper.style.display = 'block';
  pieceMovementAudio.play();
};

DOM_instructions.onclick = () => {
  DOM_instructionsPage.style.display = 'block';
  DOM_menuList.style.display = 'none';
  pieceMovementAudio.play();
};

DOM_checkersLogo.onclick = () => {
  DOM_menuList.style.display = 'block';
  DOM_gameModeList.style.display = 'none';
  DOM_instructionsPage.style.display = 'none';
  pieceMovementAudio.play();
};

DOM_checkBox.onclick = () => {
  if (DOM_checkBox.checked == true) {
    DOM_recommendedMove.style.display = 'block';
  } else {
    DOM_recommendedMove.style.display = 'none';
  }
  pieceMovementAudio.play();
};
