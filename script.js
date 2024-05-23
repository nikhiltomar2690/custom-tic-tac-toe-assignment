document.getElementById("start-game").addEventListener("click", startGame);

let xWins = 0;
let oWins = 0;
let roundsPlayed = 0;
let currentPlayer = "X";
let size;
let roundsToWin;
let board;

function startGame() {
  size = parseInt(document.getElementById("size").value);
  roundsToWin = parseInt(document.getElementById("rounds-to-win").value);
  board = Array(size)
    .fill()
    .map(() => Array(size).fill(""));
  createBoard(size);
  currentPlayer = "X";
  document.getElementById("message").innerText = "";
  document.getElementById("game-board").classList.add("visible");
  document.querySelector(".container").classList.add("visible");
  document.getElementById("message").classList.add("visible");
  document.getElementById("score").classList.add("visible");
}

function createBoard(size) {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => makeMove(row, col));
      gameBoard.appendChild(cell);
    }
  }
}

function makeMove(row, col) {
  if (board[row][col] === "") {
    board[row][col] = currentPlayer;
    const cell = document.querySelector(
      `#game-board > :nth-child(${row * size + col + 1})`
    );
    cell.innerText = currentPlayer;
    cell.classList.add(currentPlayer);
    if (checkWin(row, col)) {
      document.getElementById(
        "message"
      ).innerText = `${currentPlayer} wins this round!`;
      if (currentPlayer === "X") xWins++;
      else oWins++;
      updateScore();
      if (xWins === roundsToWin) {
        alert("Player X wins the game!");
        resetGame();
      } else if (oWins === roundsToWin) {
        alert("Player O wins the game!");
        resetGame();
      } else {
        setTimeout(startGame, 2000);
      }
      return;
    } else if (board.flat().every((cell) => cell !== "")) {
      document.getElementById("message").innerText = "It's a draw!";
      roundsPlayed++;
      updateScore();
      setTimeout(startGame, 2000);
      return;
    }
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

function checkWin(row, col) {
  // Check row
  if (board[row].every((cell) => cell === currentPlayer)) return true;
  // Check column
  if (board.every((row) => row[col] === currentPlayer)) return true;
  // Check diagonal
  if (row === col && board.every((row, index) => row[index] === currentPlayer))
    return true;
  // Check anti-diagonal
  if (
    row + col === size - 1 &&
    board.every((row, index) => row[size - 1 - index] === currentPlayer)
  )
    return true;
  return false;
}

function updateScore() {
  document.getElementById("x-wins").innerText = xWins;
  document.getElementById("o-wins").innerText = oWins;
  roundsPlayed++;
  document.getElementById("rounds-played").innerText = roundsPlayed;
}

function resetGame() {
  xWins = 0;
  oWins = 0;
  roundsPlayed = 0;
  document.getElementById("x-wins").innerText = xWins;
  document.getElementById("o-wins").innerText = oWins;
  document.getElementById("rounds-played").innerText = roundsPlayed;
  document.getElementById("message").innerText = "";
  document.getElementById("game-board").classList.remove("visible");
  document.querySelector(".container").classList.remove("visible");
  document.getElementById("message").classList.remove("visible");
  document.getElementById("score").classList.remove("visible");
}
