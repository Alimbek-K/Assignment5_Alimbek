
const MAX_LIVES = 3;
const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

let lives = MAX_LIVES;
let streak = 0;
let bestStreak = 0;
let currentNumber = randomNumber();
let gameOver = false;

const livesText = document.getElementById("lives");
const streakText = document.getElementById("streak");
const bestStreakText = document.getElementById("bestStreak");
const currentNumberText = document.getElementById("currentNumber");
const messageText = document.getElementById("message");

const higherBtn = document.getElementById("higherBtn");
const lowerBtn = document.getElementById("lowerBtn");
const restartBtn = document.getElementById("restartBtn");

function randomNumber() {
    return Math.floor(
        Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)
    ) + MIN_NUMBER;
}

function updateDisplay() {
    livesText.textContent = lives;
    streakText.textContent = streak;
    bestStreakText.textContent = bestStreak;
    currentNumberText.textContent = currentNumber;
}

function showMessage(text, type) {
    messageText.textContent = text;

    messageText.classList.remove(
        "success",
        "error",
        "game-over"
    );

    if (type === "success" || type === "error" || type === "game-over") {
        messageText.classList.add(type);
    }
}

function makeGuess(guess) {
    if (gameOver) {
        showMessage("Game over! Please restart.", "game-over");
        return;
    }

    if (guess !== "higher" && guess !== "lower") {
        showMessage("Invalid move!", "error");
        return;
    }

    const nextNumber = randomNumber();

    let correct = false;

    if (guess === "higher" && nextNumber >= currentNumber) {
        correct = true;
    } else if (guess === "lower" && nextNumber <= currentNumber) {
        correct = true;
    }

    if (correct === true) {
        streak++;

        if (streak > bestStreak) {
            bestStreak = streak;
        }

        showMessage(
            "Correct! The next number was " + nextNumber,
            "success"
        );
    } else {
        lives--;
        streak = 0;

        showMessage(
            "Wrong! The next number was " + nextNumber,
            "error"
        );
    }

    currentNumber = nextNumber;

    if (lives === 0) {
        gameOver = true;

        showMessage(
            messageText.textContent + " Game Over!",
            "game-over"
        );

        higherBtn.disabled = true;
        lowerBtn.disabled = true;
    }

    updateDisplay();
}

function restartGame() {
    lives = MAX_LIVES;
    streak = 0;
    currentNumber = randomNumber();
    gameOver = false;

    higherBtn.disabled = false;
    lowerBtn.disabled = false;

    showMessage("New game! Make your guess.", "");

    updateDisplay();
}

higherBtn.addEventListener("click", function () {
    makeGuess("higher");
});

lowerBtn.addEventListener("click", function () {
    makeGuess("lower");
});

restartBtn.addEventListener("click", restartGame);

updateDisplay();
