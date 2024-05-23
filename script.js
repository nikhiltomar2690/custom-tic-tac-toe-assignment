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
  document.getElementById("timer").classList.remove("visible");
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
      showCustomAlert(`${currentPlayer} wins this round!`, () => {
        if (currentPlayer === "X") xWins++;
        else oWins++;
        updateScore();
        if (xWins === roundsToWin) {
          showCustomAlert("Player X wins the game!", () => {
            resetGame();
            startGame();
          });
        } else if (oWins === roundsToWin) {
          showCustomAlert("Player O wins the game!", () => {
            resetGame();
            startGame();
          });
        } else {
          resetBoard();
        }
      });
      return;
    } else if (board.flat().every((cell) => cell !== "")) {
      showCustomAlert("It's a draw!", () => {
        roundsPlayed++;
        updateScore();
        resetBoard();
      });
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

function resetBoard() {
  board = Array(size)
    .fill()
    .map(() => Array(size).fill(""));
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.innerText = "";
    cell.classList.remove("X", "O");
  });
}

function startNewRound() {
  document.getElementById("timer").classList.add("visible");
  let countdown = 3;
  const timerElement = document.getElementById("countdown");
  timerElement.innerText = countdown;

  const countdownInterval = setInterval(() => {
    countdown--;
    timerElement.innerText = countdown;
    if (countdown === 0) {
      clearInterval(countdownInterval);
      document.getElementById("timer").classList.remove("visible");
      startGame();
    }
  }, 1000);
}

function showCustomAlert(message, callback) {
  const customAlert = document.createElement("div");
  customAlert.classList.add("custom-alert");
  customAlert.innerHTML = `
        <div class="custom-alert-content">
            <p>${message}</p>
            <button id="close-alert">OK</button>
        </div>
    `;
  document.body.appendChild(customAlert);

  document.getElementById("close-alert").addEventListener("click", () => {
    customAlert.remove();
    if (callback) callback();
  });
}
