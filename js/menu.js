DOM_playVSFriend.onclick = () => {
  DOM_menu.style.display = 'none';
  game.initialize();
  DOM_boardWrapper.style.display = 'block';
};

DOM_playVSComputer.onclick = () => {
  DOM_menuList.style.display = 'none';
  DOM_gameModeList.style.display = 'block';
};

DOM_homeButton.onclick = () => {
  game.reset();
  DOM_boardWrapper.style.display = 'none';
  DOM_gameModeList.style.display = 'none';
  DOM_menu.style.display = 'block';
};

DOM_returnToMainMenu.onclick = () => {
  game.reset();
  DOM_boardWrapper.style.display = 'none';
  DOM_gameModeList.style.display = 'none';
  DOM_gameOver.style.display = 'none';
  DOM_menu.style.display = 'block';
  DOM_board.style.opacity = 1;
};

DOM_easyMode.onclick = () => {
  game.initialize(AI_MODE, EASY_MODE_DEPTH);
  DOM_menuList.style.display = 'block';
  DOM_menu.style.display = 'none';
  DOM_boardWrapper.style.display = 'block';
};

DOM_mediumMode.onclick = () => {
  game.initialize(AI_MODE, MEDIUM_MODE_DEPTH);
  DOM_menuList.style.display = 'block';
  DOM_menu.style.display = 'none';
  DOM_boardWrapper.style.display = 'block';
};

DOM_hardMode.onclick = () => {
  game.initialize(AI_MODE, HARD_MODE_DEPTH);
  DOM_menuList.style.display = 'block';
  DOM_menu.style.display = 'none';
  DOM_boardWrapper.style.display = 'block';
};
