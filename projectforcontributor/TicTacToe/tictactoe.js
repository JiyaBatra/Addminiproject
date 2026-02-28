let currentPlayer = "X";
let board = ["","","","","","","","",""];
let gameActive = true;

const statusText = document.getElementById("status");

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function makeMove(cell, index) {
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  checkWinner();

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if(gameActive)
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;

    if (board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]) {

      statusText.textContent = `🎉 Player ${board[a]} Wins!`;
      gameActive = false;
      return;
    }
  }

  if (!board.includes("")) {
    statusText.textContent = "🤝 It's a Draw!";
    gameActive = false;
  }
}

function restartGame() {
  board = ["","","","","","","","",""];
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = "Player X's Turn";

  document.querySelectorAll(".cell")
    .forEach(cell => cell.textContent = "");
}