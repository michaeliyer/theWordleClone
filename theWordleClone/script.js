let lowerCasefixedWordsLarge = fixedWordsLarge.map((word) =>
  word.toLowerCase()
);

const inputField = document.getElementById("guess");
const submitButton = document.getElementById("submit");
const previousGuessesContainer = document.getElementById("previous-guesses");
const filteredWordsContainer = document.getElementById("filtered-words");
const wordCount = document.getElementById("word-count");
const wordDropdown = document.getElementById("word-dropdown");
const newWordButton = document.getElementById("new-word");

let possibleWords = [...lowerCasefixedWordsLarge];
let previousGuesses = [];
let secretWord = "";

function resetGame() {
  possibleWords = [...lowerCasefixedWordsLarge];
  previousGuesses = [];
  previousGuessesContainer.innerHTML = "";
  filteredWordsContainer.innerHTML = "";
  wordCount.textContent = possibleWords.length;
  inputField.value = "";
  if (wordDropdown) {
    wordDropdown.value = "";
  }
}

function generateNewSecretWord() {
  secretWord =
    lowerCasefixedWordsLarge[
      Math.floor(Math.random() * lowerCasefixedWordsLarge.length)
    ];
  resetGame();
}

if (newWordButton) {
  newWordButton.addEventListener("click", generateNewSecretWord);
  generateNewSecretWord();
} else {
  generateNewSecretWord();
}

// ✅ Populate dropdown with sorted words
