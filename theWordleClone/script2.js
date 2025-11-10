// Import wordList and convert all words to lowercase for consistency
import { dailyWordsSmall } from "./theWholeEnchilada.js";
const lowerCaseWordList = dailyWordsSmall.map((word) => word.toLowerCase());

const inputField = document.getElementById("guess");
const submitButton = document.getElementById("submit");
const previousGuessesContainer = document.getElementById("previous-guesses");
const filteredWordsContainer = document.getElementById("filtered-words");
const wordCount = document.getElementById("word-count");
const wordDropdown = document.getElementById("word-dropdown");
const newWordButton = document.getElementById("new-word");

let possibleWords = [...lowerCaseWordList];
let previousGuesses = [];
let secretWord = "";

function resetGame() {
  possibleWords = [...lowerCaseWordList];
  previousGuesses = [];
  previousGuessesContainer.innerHTML = "";
  filteredWordsContainer.innerHTML = "";
  filteredWordsContainer.style.display = "none";
  wordCount.textContent = 0;
  inputField.value = "";
  if (wordDropdown) {
    wordDropdown.value = "";
  }
}

function generateNewSecretWord() {
  secretWord =
    lowerCaseWordList[Math.floor(Math.random() * lowerCaseWordList.length)];
  resetGame();
}

if (newWordButton) {
  newWordButton.addEventListener("click", generateNewSecretWord);
  generateNewSecretWord();
} else {
  generateNewSecretWord();
}

function updateWordList(words) {
  filteredWordsContainer.style.display = "block";
  wordCount.textContent = words.length;

  // Display words in a paragraph, comma-separated
  filteredWordsContainer.innerHTML =
    words.length === 0
      ? "<p>No possible words found.</p>"
      : `<p>${words.join(", ")}</p>`;
}

//word for dailySmall
// const secretWord = "LEVER"; // Change this for testing
