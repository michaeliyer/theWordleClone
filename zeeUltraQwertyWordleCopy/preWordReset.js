// import { wordleWords, combinedWords, fixedWordsLarge } from '../theWholeEnchilada.js';
import { wordleWords, dailyWordsSmall, dailyWordsLarge } from '../theWholeEnchilada.js';

// Create a Set of wordleWords for fast lookup (uppercase for comparison)
// wordleWords is an array of objects with a 'word' property
const wordleWordsSet = new Set(wordleWords.map(item => item.word.toUpperCase()));

// Create a Map to count occurrences of each word in wordleWords
const wordleWordsCount = new Map();
wordleWords.forEach(item => {
  const word = item.word.toUpperCase();
  wordleWordsCount.set(word, (wordleWordsCount.get(word) || 0) + 1);
});

// Create a Map to store all wordleWords entries by word (for quick lookup of details)
const wordleWordsDetails = new Map();
wordleWords.forEach(item => {
  const word = item.word.toUpperCase();
  if (!wordleWordsDetails.has(word)) {
    wordleWordsDetails.set(word, []);
  }
  wordleWordsDetails.get(word).push(item);
});

// Track if highlighting is active
let isWordleHighlightActive = false;

// Initialize the highlight functionality
document.addEventListener('DOMContentLoaded', () => {
  initWordleHighlight();
  // Watch for when words are re-rendered
  observeWordRendering();
  // Add duplicate indicators after a short delay to ensure words are rendered
  setTimeout(() => {
    addDuplicateIndicators();
  }, 500);
  // Initialize click handler for Wordle words
  initWordleWordClickHandler();
});

function initWordleHighlight() {
  // Wait for the button to exist
  const button = document.getElementById('highlightWordleButton');
  if (!button) {
    // If button doesn't exist yet, try again after a short delay
    setTimeout(initWordleHighlight, 100);
    return;
  }

  // Add click handler to the button
  button.addEventListener('click', toggleWordleHighlight);

  // Add CSS styles for the highlight
  addHighlightStyles();
}

function toggleWordleHighlight() {
  isWordleHighlightActive = !isWordleHighlightActive;
  applyWordleHighlight();
  
  // Update button appearance
  const button = document.getElementById('highlightWordleButton');
  if (button) {
    button.classList.toggle('active', isWordleHighlightActive);
  }
  
  // Update count display
  if (!isWordleHighlightActive) {
    updateHighlightCount(0);
  }
}

function getWordText(chip) {
  // Get the word text excluding any duplicate indicators
  // The word is the first text node in the chip
  let wordText = '';
  for (const node of chip.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      wordText += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE && 
               (!node.classList || !node.classList.contains('duplicate-indicator'))) {
      // Include text from other elements but not the duplicate indicator
      wordText += node.textContent;
    }
  }
  return wordText.trim().toUpperCase();
}

function getCountEmoji(count) {
  // Return the appropriate emoji based on the count
  const emojiMap = {
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
  };
  // For counts 10+, use 🔟 or show the number
  if (count >= 10) {
    return '🔟';
  }
  return emojiMap[count] || '';
}

function applyWordleHighlight() {
  // Get all word chips
  const wordChips = document.querySelectorAll('.word-chip');
  let highlightedCount = 0;
  
  wordChips.forEach(chip => {
    // Get word text without the duplicate indicator
    const word = getWordText(chip);
    const isWordleWord = wordleWordsSet.has(word);
    const wordCount = wordleWordsCount.get(word) || 0;
    
    if (isWordleWord) {
      if (isWordleHighlightActive) {
        chip.classList.add('highlight-wordle');
        highlightedCount++;
      } else {
        chip.classList.remove('highlight-wordle');
      }
    }
    
    // Always add/update duplicate indicator if word appears multiple times (regardless of highlighting state)
    const existingIndicator = chip.querySelector('.duplicate-indicator');
    if (wordCount >= 2) {
      const emoji = getCountEmoji(wordCount);
      if (existingIndicator) {
        // Update existing indicator with correct emoji
        existingIndicator.textContent = emoji;
      } else {
        // Create new indicator
        const indicator = document.createElement('span');
        indicator.className = 'duplicate-indicator';
        indicator.textContent = emoji;
        chip.appendChild(indicator);
      }
    } else if (existingIndicator) {
      existingIndicator.remove();
    }
  });
  
  // Update the count display
  updateHighlightCount(highlightedCount);
}

function updateHighlightCount(count) {
  // Find or create the count display element
  let countDisplay = document.getElementById('wordle-highlight-count');
  
  if (!countDisplay) {
    // Create the count display element
    const button = document.getElementById('highlightWordleButton');
    if (button && button.parentElement) {
      countDisplay = document.createElement('span');
      countDisplay.id = 'wordle-highlight-count';
      countDisplay.className = 'highlight-count';
      countDisplay.style.marginLeft = '8px';
      countDisplay.style.fontSize = '0.9em';
      countDisplay.style.opacity = '0.8';
      button.parentElement.appendChild(countDisplay);
    }
  }
  
  if (countDisplay) {
    if (isWordleHighlightActive && count > 0) {
      countDisplay.textContent = `(${count} highlighted)`;
      countDisplay.style.display = 'inline';
    } else {
      countDisplay.style.display = 'none';
    }
  }
}

function observeWordRendering() {
  // Watch for changes to the filteredWords container
  const resultsContainer = document.getElementById('filteredWords');
  if (!resultsContainer) {
    setTimeout(observeWordRendering, 100);
    return;
  }

  // Use MutationObserver to detect when words are re-rendered
  const observer = new MutationObserver(() => {
    // If highlighting is active, reapply it after words are rendered
    if (isWordleHighlightActive) {
      // Small delay to ensure DOM is fully updated
      setTimeout(() => {
        applyWordleHighlight();
      }, 10);
    } else {
      // Even if highlighting is off, we should add duplicate indicators
      // when words are re-rendered
      setTimeout(() => {
        addDuplicateIndicators();
      }, 10);
    }
  });

  // Observe changes to child elements
  observer.observe(resultsContainer, {
    childList: true,
    subtree: true
  });
}

function addDuplicateIndicators() {
  // Get all word chips
  const wordChips = document.querySelectorAll('.word-chip');
  
  wordChips.forEach(chip => {
    // Remove any existing duplicate indicator
    const existingIndicator = chip.querySelector('.duplicate-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    // Get word text without the duplicate indicator
    const word = getWordText(chip);
    const wordCount = wordleWordsCount.get(word) || 0;
    
    // Add appropriate emoji if word appears multiple times in wordleWords (even if highlighting is off)
    if (wordCount >= 2) {
      const emoji = getCountEmoji(wordCount);
      const indicator = document.createElement('span');
      indicator.className = 'duplicate-indicator';
      indicator.textContent = emoji;
      chip.appendChild(indicator);
    }
  });
}

function initWordleWordClickHandler() {
  // Wait for the results container to exist
  const resultsContainer = document.getElementById('filteredWords');
  if (!resultsContainer) {
    setTimeout(initWordleWordClickHandler, 100);
    return;
  }

  // Listen for clicks on word chips, specifically highlighted Wordle words
  // Use capture phase to intercept before other handlers
  resultsContainer.addEventListener('click', (e) => {
    // Check if clicking on duplicate indicator - ignore those clicks
    if (e.target.classList && e.target.classList.contains('duplicate-indicator')) {
      return;
    }
    
    // Don't do anything if clicking inside an active modal
    if (e.target.closest('.word-stats-modal.active')) {
      return;
    }
    
    const wordChip = e.target.closest('.word-chip');
    if (wordChip && wordChip.classList.contains('highlight-wordle')) {
      // Check if the modal for this word is already open
      const existingModal = document.getElementById('wordleWordDetailsModal');
      if (existingModal && existingModal.classList.contains('active')) {
        // Modal is already open, don't do anything
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      
      e.stopPropagation(); // Prevent event from reaching other handlers
      e.preventDefault(); // Prevent default behavior
      const word = getWordText(wordChip);
      showWordleWordDetailsModal(word);
      return false; // Additional prevention
    }
  }, true); // Use capture phase to run before other handlers
}

function showWordleWordDetailsModal(word) {
  // Close any existing modals first
  const existingModals = ['wordStatsModal', 'wordleWordDetailsModal', 'letterPositionStatsModal'];
  existingModals.forEach(modalId => {
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
      existingModal.classList.remove('active');
    }
  });

  // Get Wordle word details
  const wordDetails = wordleWordsDetails.get(word) || [];
  
  if (wordDetails.length === 0) {
    // Fallback to regular word stats if not found (shouldn't happen for highlighted words)
    return;
  }

  // Ensure we only analyze the first 5 characters (Wordle words are always 5 letters)
  const cleanWord = word.substring(0, 5).toUpperCase();

  // Get all current words from the DOM for letter analysis
  const wordChips = document.querySelectorAll('.word-chip');
  const allWords = Array.from(wordChips).map(chip => {
    const chipWord = getWordText(chip);
    // Also ensure we only use first 5 characters for comparison
    return chipWord.substring(0, 5).toUpperCase();
  });
  const totalWords = allWords.length;

  // Calculate statistics for each position (letter analysis)
  const stats = [];
  for (let pos = 0; pos < 5; pos++) {  // Fixed: always analyze exactly 5 positions
    const letter = cleanWord[pos];
    const wordsWithLetterAtPos = allWords.filter(w => w[pos] === letter);
    const count = wordsWithLetterAtPos.length;
    const percentage = totalWords > 0 ? ((count / totalWords) * 100).toFixed(2) : '0.00';

    stats.push({
      position: pos + 1,
      letter: letter,
      count: count,
      percentage: percentage
    });
  }

  // Create or update modal
  let modal = document.getElementById('wordleWordDetailsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'wordleWordDetailsModal';
    modal.className = 'word-stats-modal';
    document.body.appendChild(modal);
  }

  // Build Wordle details section
  const wordleDetailsRows = wordDetails.map((detail, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${detail.gameDate || 'N/A'}</td>
      <td>${detail.wordNumber !== undefined ? detail.wordNumber : 'N/A'}</td>
      <td>${detail.myScore !== undefined ? detail.myScore : 'N/A'}</td>
    </tr>
  `).join('');

  // Build letter analysis table rows
  const tableRows = stats.map(stat => `
    <tr>
      <td><span class="position-letter">${stat.position}</span></td>
      <td><span class="position-letter">${stat.letter}</span></td>
      <td><span class="stat-count">${stat.count}</span></td>
      <td><span class="stat-percentage">${stat.percentage}%</span></td>
    </tr>
  `).join('');

  modal.innerHTML = `
    <div class="word-stats-content">
      <div class="word-stats-header">
        <div class="word-stats-title">${cleanWord}</div>
        <button class="word-stats-close">&times;</button>
      </div>
      
      <div style="color: #fff; margin-bottom: 1.5rem;">
        <h3 style="color: #00ffff; margin-bottom: 0.5rem; font-size: 1.2rem;">Wordle Word Details</h3>
        <table class="word-stats-table" style="margin-bottom: 1.5rem;">
          <thead>
            <tr>
              <th>#</th>
              <th>Game Date</th>
              <th>Word #</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            ${wordleDetailsRows}
          </tbody>
        </table>
      </div>

      <div style="color: #fff; margin-bottom: 1rem;">
        <h3 style="color: #00ffff; margin-bottom: 0.5rem; font-size: 1.2rem;">Letter Analysis</h3>
        <div style="margin-bottom: 0.5rem;">
          Total words in filtered list: <strong style="color: #00ffff;">${totalWords}</strong>
        </div>
        <table class="word-stats-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Letter</th>
              <th>Count</th>
              <th>% of Remaining</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Show modal
  modal.classList.add('active');

  // Close button handler
  const closeBtn = modal.querySelector('.word-stats-close');
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modal.classList.remove('active');
  });

  // Close on Escape key
  const escapeHandler = (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

function addHighlightStyles() {
  // Check if styles already added
  if (document.getElementById('wordle-highlight-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'wordle-highlight-styles';
  style.textContent = `
    .word-chip {
      position: relative;
    }
    .word-chip.highlight-wordle {
      background: rgba(0, 255, 0, 0.3) !important;
      border-color: rgba(0, 255, 0, 0.9) !important;
      box-shadow: 0 0 12px rgba(0, 255, 0, 0.6) !important;
      color: #ffffff !important;
      font-weight: bold;
    }
    .word-chip .duplicate-indicator {
      position: absolute;
      top: -2px;
      right: -2px;
      font-size: 0.7em;
      line-height: 1;
      margin: 0;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}