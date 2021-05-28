const TYPES_OF_BLOCKS = 2;
const BLOCKS_PER_ROW = 8;
const TOTAL_BLOCKS = 64;
const RED_PIECE_END_BLOCK = 24;
const BLACK_PIECE_START_BLOCK = 40;
const BLACK_PIECE_CAPTURE_LIMIT = 16;
const RED_PIECE_CAPTURE_LIMIT = 48;
const EASY_MODE_DEPTH = 4;
const MEDIUM_MODE_DEPTH = 7;
const HARD_MODE_DEPTH = 10;

const AI_MODE = 'ai';
const TWO_PLAYER_MODE = 'none';
const RED_PIECE = 'red';
const BLACK_PIECE = 'black';
const NO_PIECE = 'none';

const INITIAL_ALPHA = -100;
const INITIAL_BETA = +100;
const INITIAL_MAX_VALUE = -10000;
const INITIAL_MIN_VALUE = +10000;

const BOARD_LABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
