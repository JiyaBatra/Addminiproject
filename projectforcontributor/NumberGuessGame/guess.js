let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

function checkGuess() {
  const userGuess = Number(document.getElementById("guessInput").value);
  const message = document.getElementById("message");
  const attemptsText = document.getElementById("attempts");

  if (!userGuess) {
    message.textContent = "⚠️ Enter a valid number!";
    return;
  }

  attempts++;

  if (userGuess === randomNumber) {
    message.textContent = "🎉 Correct! You guessed it!";
  } 
  else if (userGuess < randomNumber) {
    message.textContent = "📉 Too low! Try again.";
  } 
  else {
    message.textContent = "📈 Too high! Try again.";
  }

  attemptsText.textContent = "Attempts: " + attempts;
}

function restartGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  document.getElementById("message").textContent = "";
  document.getElementById("attempts").textContent = "";
  document.getElementById("guessInput").value = "";
}