// Import wordList and convert all words to lowercase for consistency
// import { fixedWordsLarge } from "./theWholeEnchiladaFuckaround.js";
import { fixedWordsLarge } from "./theWholeEnchilada.js";

let lowerCasefixedWordsLarge = fixedWordsLarge.map(word => word.toLowerCase());

// Store the current possible words (starts with the full list)
let possibleWords = [...lowerCasefixedWordsLarge];
let previousGuesses = [];






//word for fixedLarge
const secretWord = "ELEGY"; // Change this for testing








const inputField = document.getElementById("guess");
const submitButton = document.getElementById("submit");
const previousGuessesContainer = document.getElementById("previous-guesses");
const filteredWordsContainer = document.getElementById("filtered-words");
const wordCount = document.getElementById("word-count");

const wordDropdown = document.getElementById("word-dropdown"); // ✅ Ensure this is defined




// ✅ Populate dropdown with sorted words
function populateDropdown() {
    if (!wordDropdown) {
        console.error("Dropdown not found in the DOM!");
        return;
    }
    lowerCasefixedWordsLarge.forEach(word => {
        let option = document.createElement("option");
        option.value = word;
        option.textContent = word;
        wordDropdown.appendChild(option);
    });
}
populateDropdown();

// ✅ Sync dropdown with input field
wordDropdown.addEventListener("change", () => {
    inputField.value = wordDropdown.value; // Auto-fill input when dropdown is selected
});







let x = "The Secret Word = Jacko. Shhh...or you'll get hurt"
let y = "DICKLICKERSZ ARE IN CHARGE"



submitButton.addEventListener("click", () => {

   console.log(x)
   console.log(y)
   console.log(fixedWordsLarge)

    let userWord = inputField.value.toLowerCase();

    if (userWord.length !== 5 || !possibleWords.includes(userWord)) {
        alert("Please enter a valid 5-letter word!");
        return;
    }

    const feedback = getFeedback(secretWord.toLowerCase(), userWord);
    previousGuesses.push({ word: userWord, feedback });
    displayPreviousGuesses();
    
    possibleWords = filterWords(possibleWords, userWord, feedback);
    updatefixedWordsLarge(possibleWords);
});

function getFeedback(secret, guess) {
    let feedback = Array(5).fill("gray");
    let secretArr = secret.split("");
    let guessArr = guess.split("");

    // First pass: Check for Green (correct letter & position)
    for (let i = 0; i < 5; i++) {
        if (guessArr[i] === secretArr[i]) {
            feedback[i] = "green";
            secretArr[i] = null;
            guessArr[i] = null;
        }
    }

    // Second pass: Check for Orange (correct letter, wrong position)
    for (let i = 0; i < 5; i++) {
        if (guessArr[i] && secretArr.includes(guessArr[i])) {
            feedback[i] = "orange";
            secretArr[secretArr.indexOf(guessArr[i])] = null;
        }
    }

    return feedback;
}
// THE FILTER STUFF
function filterWords(fixedWordsLarge, guess, feedback) {
    return fixedWordsLarge.filter(word => {
        let wordArr = word.split("");
        let guessArr = guess.split("");

        let grayLetters = new Map(); // Gray letters and their count
        let orangeLetters = new Map(); // Orange letters and their incorrect positions
        let greenPositions = new Map(); // Green letters and their correct positions
        let guessLetterCount = {}; // Count occurrences of each letter in the guess

        // Count letter occurrences in the guess
        for (let letter of guessArr) {
            guessLetterCount[letter] = (guessLetterCount[letter] || 0) + 1;
        }

        // Extract constraints from feedback
        for (let i = 0; i < 5; i++) {
            let letter = guessArr[i];

            if (feedback[i] === "green") {
                greenPositions.set(i, letter);
            } else if (feedback[i] === "orange") {
                if (!orangeLetters.has(letter)) {
                    orangeLetters.set(letter, []);
                }
                orangeLetters.get(letter).push(i);
            } else if (feedback[i] === "gray") {
                if (!greenPositions.has(i) && !orangeLetters.has(letter)) {
                    grayLetters.set(letter, (grayLetters.get(letter) || 0) + 1);
                }
            }
        }

        // Count occurrences of each letter in the word
        let wordLetterCount = {};
        for (let letter of wordArr) {
            wordLetterCount[letter] = (wordLetterCount[letter] || 0) + 1;
        }

        // ✅ Green letter check (must be in the correct position)
        for (let [pos, letter] of greenPositions) {
            if (wordArr[pos] !== letter) return false;
        }

        // ✅ Orange letter check (must be in the word but NOT at the wrong positions)
        for (let [letter, wrongPositions] of orangeLetters) {
            if (!wordArr.includes(letter)) return false; // Letter must exist
            for (let pos of wrongPositions) {
                if (wordArr[pos] === letter) return false; // Letter must not be in wrong spot
            }
        }

        // ✅ Gray letter check (must NOT exist beyond expected count)
        for (let [letter, count] of grayLetters) {
            if (wordLetterCount[letter] > (guessLetterCount[letter] - count)) {
                return false; // Too many occurrences of a gray letter
            }
        }

        return true;
    });
}

function displayPreviousGuesses() {
    previousGuessesContainer.innerHTML = "";
    previousGuesses.forEach((guess, index) => {
        let li = document.createElement("li");
        li.classList.add("guess-item");
        li.innerHTML = `<strong>${index + 1}.</strong> ${formatFeedback(guess.word, guess.feedback)}`;
        previousGuessesContainer.appendChild(li);
    });
}

function formatFeedback(word, feedback) {
    return word.split("").map((letter, i) => {
        return `<span class="letter-box ${feedback[i]}">${letter.toUpperCase()}</span>`;
    }).join("");
}


function updatefixedWordsLarge(words) {
    wordCount.textContent = words.length;
    
    // Display words in a paragraph, comma-separated
    filteredWordsContainer.innerHTML = words.length === 0 
        ? "<p>No possible words found.</p>" 
        : `<p>${words.join(", ")}</p>`;
}

















function displayFeedback(word, feedback) {
    feedbackContainer.innerHTML = "";
    word.split("").forEach((letter, i) => {
        let span = document.createElement("span");
        span.classList.add("letter-box", feedback[i]);
        span.textContent = letter.toUpperCase();
        span.style.animationDelay = `${i * 0.15}s`; // Staggered delay per letter
        feedbackContainer.appendChild(span);
    });
}








// // Import wordList and convert all words to lowercase for consistency
// import { curseWords } from "./theWholeEnchiladaFuckaround.js";
// let lowerCasecurseWords = curseWords.map(word => word.toLowerCase());

// // Store the current possible words (starts with the full list)
// let possibleWords = [...lowerCasecurseWords];
// let previousGuesses = [];


// const secretWord = "CUNTZ"; // Change this for testing



// const inputField = document.getElementById("guess");
// const submitButton = document.getElementById("submit");
// const previousGuessesContainer = document.getElementById("previous-guesses");
// const filteredWordsContainer = document.getElementById("filtered-words");
// const wordCount = document.getElementById("word-count");

// const wordDropdown = document.getElementById("word-dropdown"); // ✅ Ensure this is defined

// // ✅ Populate dropdown with sorted words
// function populateDropdown() {
//     if (!wordDropdown) {
//         console.error("Dropdown not found in the DOM!");
//         return;
//     }
//     lowerCasecurseWords.forEach(word => {
//         let option = document.createElement("option");
//         option.value = word;
//         option.textContent = word;
//         wordDropdown.appendChild(option);
//     });
// }
// populateDropdown();

// // ✅ Sync dropdown with input field
// wordDropdown.addEventListener("change", () => {
//     inputField.value = wordDropdown.value; // Auto-fill input when dropdown is selected
// });



// submitButton.addEventListener("click", () => {
//     let userWord = inputField.value.toLowerCase();

//     if (userWord.length !== 5 || !possibleWords.includes(userWord)) {
//         alert("Please enter a valid 5-letter word!");
//         return;
//     }

//     const feedback = getFeedback(secretWord.toLowerCase(), userWord);
//     previousGuesses.push({ word: userWord, feedback });
//     displayPreviousGuesses();
    
//     possibleWords = filterWords(possibleWords, userWord, feedback);
//     updatecurseWords(possibleWords);
// });

// function getFeedback(secret, guess) {
//     let feedback = Array(5).fill("gray");
//     let secretArr = secret.split("");
//     let guessArr = guess.split("");

//     // First pass: Check for Green (correct letter & position)
//     for (let i = 0; i < 5; i++) {
//         if (guessArr[i] === secretArr[i]) {
//             feedback[i] = "green";
//             secretArr[i] = null;
//             guessArr[i] = null;
//         }
//     }

//     // Second pass: Check for Orange (correct letter, wrong position)
//     for (let i = 0; i < 5; i++) {
//         if (guessArr[i] && secretArr.includes(guessArr[i])) {
//             feedback[i] = "orange";
//             secretArr[secretArr.indexOf(guessArr[i])] = null;
//         }
//     }

//     return feedback;
// }
// // THE FILTER STUFF
// function filterWords(curseWords, guess, feedback) {
//     return curseWords.filter(word => {
//         let wordArr = word.split("");
//         let guessArr = guess.split("");

//         let grayLetters = new Map(); // Gray letters and their count
//         let orangeLetters = new Map(); // Orange letters and their incorrect positions
//         let greenPositions = new Map(); // Green letters and their correct positions
//         let guessLetterCount = {}; // Count occurrences of each letter in the guess

//         // Count letter occurrences in the guess
//         for (let letter of guessArr) {
//             guessLetterCount[letter] = (guessLetterCount[letter] || 0) + 1;
//         }

//         // Extract constraints from feedback
//         for (let i = 0; i < 5; i++) {
//             let letter = guessArr[i];

//             if (feedback[i] === "green") {
//                 greenPositions.set(i, letter);
//             } else if (feedback[i] === "orange") {
//                 if (!orangeLetters.has(letter)) {
//                     orangeLetters.set(letter, []);
//                 }
//                 orangeLetters.get(letter).push(i);
//             } else if (feedback[i] === "gray") {
//                 if (!greenPositions.has(i) && !orangeLetters.has(letter)) {
//                     grayLetters.set(letter, (grayLetters.get(letter) || 0) + 1);
//                 }
//             }
//         }

//         // Count occurrences of each letter in the word
//         let wordLetterCount = {};
//         for (let letter of wordArr) {
//             wordLetterCount[letter] = (wordLetterCount[letter] || 0) + 1;
//         }

//         // ✅ Green letter check (must be in the correct position)
//         for (let [pos, letter] of greenPositions) {
//             if (wordArr[pos] !== letter) return false;
//         }

//         // ✅ Orange letter check (must be in the word but NOT at the wrong positions)
//         for (let [letter, wrongPositions] of orangeLetters) {
//             if (!wordArr.includes(letter)) return false; // Letter must exist
//             for (let pos of wrongPositions) {
//                 if (wordArr[pos] === letter) return false; // Letter must not be in wrong spot
//             }
//         }

//         // ✅ Gray letter check (must NOT exist beyond expected count)
//         for (let [letter, count] of grayLetters) {
//             if (wordLetterCount[letter] > (guessLetterCount[letter] - count)) {
//                 return false; // Too many occurrences of a gray letter
//             }
//         }

//         return true;
//     });
// }

// function displayPreviousGuesses() {
//     previousGuessesContainer.innerHTML = "";
//     previousGuesses.forEach((guess, index) => {
//         let li = document.createElement("li");
//         li.classList.add("guess-item");
//         li.innerHTML = `<strong>${index + 1}.</strong> ${formatFeedback(guess.word, guess.feedback)}`;
//         previousGuessesContainer.appendChild(li);
//     });
// }

// function formatFeedback(word, feedback) {
//     return word.split("").map((letter, i) => {
//         return `<span class="letter-box ${feedback[i]}">${letter.toUpperCase()}</span>`;
//     }).join("");
// }


// function updatecurseWords(words) {
//     wordCount.textContent = words.length;
    
//     // Display words in a paragraph, comma-separated
//     filteredWordsContainer.innerHTML = words.length === 0 
//         ? "<p>No possible words found.</p>" 
//         : `<p>${words.join(", ")}</p>`;
// }



// function displayFeedback(word, feedback) {
//     feedbackContainer.innerHTML = "";
//     word.split("").forEach((letter, i) => {
//         let span = document.createElement("span");
//         span.classList.add("letter-box", feedback[i]);
//         span.textContent = letter.toUpperCase();
//         span.style.animationDelay = `${i * 0.15}s`; // Staggered delay per letter
//         feedbackContainer.appendChild(span);
//     });
// }
