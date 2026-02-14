let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let gameMode = null;

let scoreX = 0;
let scoreO = 0;

const cells = document.querySelectorAll(".cell");
const playerXDisplay = document.getElementById("playerX");
const playerODisplay = document.getElementById("playerO");
const modal = document.getElementById("resultModal");
const resultText = document.getElementById("resultText");
const turnBadge = document.getElementById("turnBadge");

document.getElementById("singleBtn").addEventListener("click", () => {
  gameMode = "single";
  resetGame();
});

document.getElementById("multiBtn").addEventListener("click", () => {
  gameMode = "multi";
  resetGame();
});

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
document.getElementById("restartBtn").addEventListener("click", restartRound);
document.getElementById("resetBtn").addEventListener("click", resetGame);

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || board[index] !== "") return;

  placeMark(index, currentPlayer);

  if (checkGameResult()) return;

  switchTurn();

  if (gameMode === "single" && currentPlayer === "O") {
    setTimeout(makeComputerMove, 500);
  }
}

function placeMark(index, player) {
  board[index] = player;
  cells[index].textContent = player;
}

function switchTurn() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  turnBadge.textContent = `${currentPlayer}'s Turn`;
}

function checkGameResult() {
  const patterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let pattern of patterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      pattern.forEach(i => cells[i].classList.add("win"));
      updateScore(board[a]);
      showResult(`${board[a]} Wins!`);
      gameActive = false;
      return true;
    }
  }

  if (!board.includes("")) {
    showResult("It's a Draw!");
    gameActive = false;
    return true;
  }

  return false;
}

function updateScore(winner) {
  if (winner === "X") {
    scoreX++;
    playerXDisplay.textContent = scoreX;
  } else {
    scoreO++;
    playerODisplay.textContent = scoreO;
  }
}

function showResult(message) {
  resultText.textContent = message;
  modal.classList.remove("hidden");
}

function restartRound() {
  board.fill("");
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win");
  });
  modal.classList.add("hidden");
  currentPlayer = "X";
  turnBadge.textContent = "X's Turn";
  gameActive = true;
}

function resetGame() {
  restartRound();
  scoreX = 0;
  scoreO = 0;
  playerXDisplay.textContent = "0";
  playerODisplay.textContent = "0";
}

function makeComputerMove() {
  if (!gameActive) return;

  let move =
    findWinningMove("O") ??
    findWinningMove("X") ??
    getBestMove();

  if (move !== undefined) {
    placeMark(move, "O");

    if (checkGameResult()) return;

    switchTurn();
  }
}

function findWinningMove(player) {
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = player;
      if (isWinning(player)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }
  return null;
}

function isWinning(player) {
  const patterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return patterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

function getBestMove() {
  const priority = [4,0,2,6,8,1,3,5,7];
  return priority.find(index => board[index] === "");
}
