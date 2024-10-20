// ゲームの状態
let board = [];
let currentPlayer = 'black';
let difficulty = 1;

// ボードの初期化
function initializeBoard() {
  board = [];
  for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
      board[i][j] = '';
    }
  }
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
}

// ボードの描画
function renderBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (board[i][j] !== '') {
        cell.classList.add(board[i][j]);
        cell.textContent = '●';
      }
      cell.addEventListener('click', () => makeMove(i, j));
      boardElement.appendChild(cell);
    }
  }
}

// 石を置く
function makeMove(row, col) {
  if (isValidMove(row, col, currentPlayer)) {
    placeDisc(row, col, currentPlayer);
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    renderBoard();
    updateScore();
    if (currentPlayer === 'white') {
      setTimeout(makeComputerMove, 500);
    }
  }
}

// 有効な手かどうかを判定する
function isValidMove(row, col, player) {
  if (board[row][col] !== '') {
    return false;
  }
  const opponent = player === 'black' ? 'white' : 'black';
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      let r = row + i;
      let c = col + j;
      let hasOpponent = false;
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (board[r][c] === opponent) {
          hasOpponent = true;
        } else if (board[r][c] === player) {
          if (hasOpponent) {
            return true;
          } else {
            break;
          }
        } else {
          break;
        }
        r += i;
        c += j;
      }
    }
  }
  return false;
}

// 石を置く処理
function placeDisc(row, col, player) {
  board[row][col] = player;
  const opponent = player === 'black' ? 'white' : 'black';
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      let r = row + i;
      let c = col + j;
      let toFlip = [];
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (board[r][c] === opponent) {
          toFlip.push([r, c]);
        } else if (board[r][c] === player) {
          for (let cell of toFlip) {
            board[cell[0]][cell[1]] = player;
          }
          break;
        } else {
          break;
        }
        r += i;
        c += j;
      }
    }
  }
}

// コンピュータの手を決める
function makeComputerMove() {
  let bestScore = -Infinity;
  let bestMove = null;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (isValidMove(i, j, 'white')) {
        const score = evaluateMove(i, j, 'white', difficulty);
        if (score > bestScore) {
          bestScore = score;
          bestMove = [i, j];
        }
      }
    }
  }
  if (bestMove) {
    makeMove(bestMove[0], bestMove[1]);
  } else {
    currentPlayer = 'black';
  }
}

// 手を評価する
function evaluateMove(row, col, player, depth) {
  const opponent = player === 'black' ? 'white' : 'black';
  let score = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      let r = row + i;
      let c = col + j;
      let toFlip = [];
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (board[r][c] === opponent) {
          toFlip.push([r, c]);
        } else if (board[r][c] === player) {
          score += toFlip.length;
          break;
        } else {
          break;
        }
        r += i;
        c += j;
      }
    }
  }
  if (depth > 0) {
    let bestOpponentScore = Infinity;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (isValidMove(i, j, opponent)) {
          const opponentScore = evaluateMove(i, j, opponent, depth - 1);
          bestOpponentScore = Math.min(bestOpponentScore, opponentScore);
        }
      }
    }
    score -= bestOpponentScore;
  }
  return score;
}

// スコアの更新
function updateScore() {
  let blackScore = 0;
  let whiteScore = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === 'black') {
        blackScore++;
      } else if (board[i][j] === 'white') {
        whiteScore++;
      }
    }
  }
  document.getElementById('black-score').textContent = blackScore;
  document.getElementById('white-score').textContent = whiteScore;
}

// 難易度の変更
function changeDifficulty() {
  difficulty = parseInt(document.getElementById('level').value);
}

// ゲームの再スタート
function restartGame() {
  initializeBoard();
  currentPlayer = 'black';
  renderBoard();
  updateScore();
}

// ゲームの初期化
initializeBoard();
renderBoard();
updateScore();

// イベントリスナーの追加
document.getElementById('level').addEventListener('change', changeDifficulty);
document.getElementById('restart').addEventListener('click', restartGame);