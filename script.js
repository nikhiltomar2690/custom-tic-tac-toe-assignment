// Grabbing the "start-game" button and saying "Hey, when you get clicked, run the startGame function!"
document.getElementById("start-game").addEventListener("click", startGame);
// Setting up our scoreboard. Right now, it's a sad, empty void of no victories.
let xWins = 0;
let oWins = 0;
// We haven't played any rounds yet, so this is also 0.
let roundsPlayed = 0;
// X gets to go first, because X is cool.
let currentPlayer = "X";
// We don't know how big our game board is yet, so we'll leave this undefined for now.
let size;
// We also don't know how many rounds you need to win to be crowned the ultimate champion.
let roundsToWin;
// This will hold our game board once we have one. Right now, it's just an empty placeholder.
let board;

// Function to start the game
function startGame() {
  // Get the size of the board from the input field and convert it to an integer
  size = parseInt(document.getElementById("size").value);
  // Get the number of rounds to win from the input field and convert it to an integer
  roundsToWin = parseInt(document.getElementById("rounds-to-win").value);
  // Create a new game board of the specified size, filled with empty strings
  board = Array(size)
    .fill()
    .map(() => Array(size).fill(""));
  // Call the createBoard function to create the game board
  createBoard(size);
  // Set the current player to "X"
  currentPlayer = "X";
  // Clear the message
  document.getElementById("message").innerText = "";
  // Show the game board, container, message, and score
  document.getElementById("game-board").classList.add("visible");
  document.querySelector(".container").classList.add("visible");
  document.getElementById("message").classList.add("visible");
  document.getElementById("score").classList.add("visible");
  // Hide the timer
  document.getElementById("timer").classList.remove("visible");
}

// Function to create the game board
function createBoard(size) {
  // Get the game board element
  const gameBoard = document.getElementById("game-board");
  // Clear the game board
  gameBoard.innerHTML = "";
  // Set the grid template columns and rows to match the size of the board
  gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  // Loop over each row
  for (let row = 0; row < size; row++) {
    // Loop over each column in the current row
    for (let col = 0; col < size; col++) {
      // Create a new div element for the cell
      const cell = document.createElement("div");
      // Add the "cell" class to the cell
      cell.classList.add("cell");
      // Add an event listener to the cell that makes a move when the cell is clicked
      cell.addEventListener("click", () => makeMove(row, col));
      // Append the cell to the game board
      gameBoard.appendChild(cell);
    }
  }
}

// Function to make a move
function makeMove(row, col) {
  // Check if the selected cell is empty
  if (board[row][col] === "") {
    // Set the cell to the current player
    board[row][col] = currentPlayer;
    // Get the cell element
    const cell = document.querySelector(
      `#game-board > :nth-child(${row * size + col + 1})`
    );
    // Set the text of the cell to the current player
    cell.innerText = currentPlayer;
    // Add the current player's class to the cell
    cell.classList.add(currentPlayer);
    // Check if the current player has won
    if (checkWin(row, col)) {
      // Show an alert that the current player has won the round
      showCustomAlert(`${currentPlayer} wins this round!`, () => {
        // Increment the number of wins for the current player
        if (currentPlayer === "X") xWins++;
        else oWins++;
        // Update the score
        updateScore();
        // Check if the current player has won the game
        if (xWins === roundsToWin) {
          // Show an alert that player X has won the game and restart the game
          showCustomAlert("Player X wins the game!", () => {
            resetGame();
            startGame();
          });
        } else if (oWins === roundsToWin) {
          // Show an alert that player O has won the game and restart the game
          showCustomAlert("Player O wins the game!", () => {
            resetGame();
            startGame();
          });
        } else {
          // Reset the board
          resetBoard();
        }
      });
      // Exit the function
      return;
    } else if (board.flat().every((cell) => cell !== "")) {
      // If all cells are filled and no one has won, it's a draw
      showCustomAlert("It's a draw!", () => {
        roundsPlayed++;
        updateScore();
        resetBoard();
      });
      // Exit the function
      return;
    }
    // Switch the current player
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

// Function to check if the current player has won
function checkWin(row, col) {
  // Check if all cells in the current row are filled by the current player
  if (board[row].every((cell) => cell === currentPlayer)) return true;
  // Check if all cells in the current column are filled by the current player
  if (board.every((row) => row[col] === currentPlayer)) return true;
  // Check if all cells in the diagonal from top-left to bottom-right are filled by the current player
  if (row === col && board.every((row, index) => row[index] === currentPlayer))
    return true;
  // Check if all cells in the diagonal from top-right to bottom-left are filled by the current player
  if (
    row + col === size - 1 &&
    board.every((row, index) => row[size - 1 - index] === currentPlayer)
  )
    return true;
  // If none of the conditions are met, return false
  return false;
}

function updateScore() {
  document.getElementById("x-wins").innerText = xWins;
  document.getElementById("o-wins").innerText = oWins;
  roundsPlayed++;
  document.getElementById("rounds-played").innerText = roundsPlayed;
}

// Function to reset the game
function resetGame() {
  // Reset the number of wins for player X and player O, and the number of rounds played
  xWins = 0;
  oWins = 0;
  roundsPlayed = 0;
  // Update the text of the "x-wins", "o-wins", and "rounds-played" elements to reflect the new scores
  document.getElementById("x-wins").innerText = xWins;
  document.getElementById("o-wins").innerText = oWins;
  document.getElementById("rounds-played").innerText = roundsPlayed;
  // Clear the message
  document.getElementById("message").innerText = "";
  // Hide the game board, container, message, and score
  document.getElementById("game-board").classList.remove("visible");
  document.querySelector(".container").classList.remove("visible");
  document.getElementById("message").classList.remove("visible");
  document.getElementById("score").classList.remove("visible");
}

// Function to reset the board
function resetBoard() {
  // Reset the board array to an empty size x size array
  board = Array(size)
    .fill()
    .map(() => Array(size).fill(""));
  // Get all the cell elements
  const cells = document.querySelectorAll(".cell");
  // Loop over each cell
  cells.forEach((cell) => {
    // Clear the text of the cell
    cell.innerText = "";
    // Remove the "X" and "O" classes from the cell
    cell.classList.remove("X", "O");
  });
}

// Function to start a new round
function startNewRound() {
  // Make the timer visible
  document.getElementById("timer").classList.add("visible");
  // Initialize the countdown to 3
  let countdown = 3;
  // Get the countdown element
  const timerElement = document.getElementById("countdown");
  // Set the text of the countdown element to the countdown
  timerElement.innerText = countdown;
  // Start a countdown interval that runs every second
  const countdownInterval = setInterval(() => {
    // Decrement the countdown
    countdown--;
    // Update the text of the countdown element
    timerElement.innerText = countdown;
    // If the countdown reaches 0
    if (countdown === 0) {
      // Clear the countdown interval
      clearInterval(countdownInterval);
      // Hide the timer
      document.getElementById("timer").classList.remove("visible");
      // Start the game
      startGame();
    }
  }, 1000);
}

// Function to show a custom alert
function showCustomAlert(message, callback) {
  // Create a new div element for the custom alert
  const customAlert = document.createElement("div");
  // Add the "custom-alert" class to the custom alert
  customAlert.classList.add("custom-alert");
  // Set the inner HTML of the custom alert to a div with the message and an OK button
  customAlert.innerHTML = `
        <div class="custom-alert-content">
            <p>${message}</p>
            <button id="close-alert">OK</button>
        </div>
    `;
  // Append the custom alert to the body
  document.body.appendChild(customAlert);
  // Add a click event listener to the OK button
  document.getElementById("close-alert").addEventListener("click", () => {
    // Remove the custom alert
    customAlert.remove();
    // If a callback function was provided, call it
    if (callback) callback();
  });
}
