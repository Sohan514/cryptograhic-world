// Welcome Page & Game Page Controls
const welcomePage = document.getElementById('welcome-page');
const gamePage = document.getElementById('game-page');
const startButton = document.getElementById('start-game');
const playerNameInput = document.getElementById('player-name');
const usernameDisplay = document.getElementById('username-display');

// Initialize leaderboard from localStorage
let leaderboard = JSON.parse(localStorage.getItem('crosswordLeaderboard')) || [];

startButton.addEventListener('click', function() {
  const playerName = playerNameInput.value.trim();
  if (playerName) {
    welcomePage.style.display = 'none';
    gamePage.style.display = 'block';
    usernameDisplay.textContent = `AGENT: ${playerName}`;
    initializePuzzle();
    updateLeaderboardDisplay();
  } else {
    alert('Please enter your alias to continue');
  }
});

// Crossword puzzle data with adjusted positions to prevent overlapping
const puzzleData = {
  // Define the grid - empty cells are null, filled cells are objects
  grid: Array(11).fill().map(() => Array(11).fill(null)),
  // Define the words and their positions
  words: [
    {
      id: 1,
      word: "LUCA",
      direction: "across",
      row: 2,
      col: 3,
      clue: `Rishi, LUCA, and Ram are three friends. They have a chat daily. One day, a hacker intruded and started chatting by altering one of their messages. If you had to catch the friend whose messages were altered, what would you do? The cyber cell starts catching the hacker by knowing their private key and retrieving a common key from it. The common key is calculated using the formula: Common Key = q^{X_A} mod p. Given: p = 5, q = 2, X_A = 3, 7, 5 (Private keys of Rishi, Ram, and LUCA, respectively), Common Key = 3.`
    },
    {
      id: 2,
      word: "VICKY",
      direction: "down",
      row: 0,
      col: 5,
      clue: `Symonds, Ricky, and another friend have roll numbers 13, 23, and 29, respectively. They decided to generate a public key and private key using their roll numbers. However, only two of these roll numbers could successfully form a key. The public key was found to be 13, and the private key was 61. Can you determine whose roll number could not be used to form the key?`
    },
    {
      id: 3,
      word: "ROHIT",
      direction: "across",
      row: 5,
      col: 1,
      clue: `Mrs. Barbraine is a class teacher. She assigned a task to the entire class and decided to randomly call students based on their roll numbers. She used an LCG (Linear Congruential Generator) technique to generate random numbers. If she starts with Ayush, who will be called next? The LCG formula used is: LCG=(17xi+43)mod100. List of students with their roll numbers: Aman = 0, Radhe = 1, Rohit = 2, Sarga = 3, Richa = 24, Sandhya = 25, Poushka = 26, Ayush = 27.`
    },
    {
      id: 4,
      word: "TINA",
      direction: "down",
      row: 3,
      col: 8,
      clue: `Tina, Sharoni, and Chebda decided to encrypt their secret codes using different encryption techniques. The encrypted codes are: Tina→ BIEEFLV, Sharoni → EHOLHYH, Chebda → LEBVFIE. Which encrypted code is the easiest to decrypt? Hint: Key = width, Groups = 3.`
    },
    {
      id: 5,
      word: "CHARLIE",
      direction: "across",
      row: 9,
      col: 2,
      clue: `Alice, Bob, and Charlie each use digital signatures for document verification. Alice signs a document using her private key, and Bob successfully verifies it using Alice's public key. However, when Charlie tries to verify the document, the signature fails. Who might have tampered with the document?`
    },
    {
      id: 6,
      word: "DAVID",
      direction: "down",
      row: 5,
      col: 10,
      clue: `David, Emma, and Noah are discussing the security of digital signatures. One of them claims that a digital signature alone can confirm both the sender's identity and the message's integrity, but the others argue that it cannot prove when the document was signed. Who made this claim?`
    }
  ]
};

// Timer variables
let timerInterval;
let timerSeconds = 0;
let timerStarted = false;
let currentScore = 0;

// Initialize the puzzle
function initializePuzzle() {
  const grid = document.getElementById('crossword-grid');
  const acrossQuestions = document.getElementById('across-questions');
  const downQuestions = document.getElementById('down-questions');
  
  // Clear existing content
  grid.innerHTML = '';
  acrossQuestions.innerHTML = '';
  downQuestions.innerHTML = '';
  
  // Reset timer for new game
  resetTimer();
  updateScoreDisplay();
  
  // Create grid cells
  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 11; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      
      // Check if the cell is part of a word
      let isActive = false;
      let cellNumber = null;
      
      puzzleData.words.forEach(word => {
        // Check if this cell is the starting point of a word
        if (word.row === row && word.col === col) {
          cellNumber = word.id;
        }
        
        // Check if this cell is part of a word
        if (word.direction === 'across' && word.row === row && 
            col >= word.col && col < word.col + word.word.length) {
          isActive = true;
          let letterIndex = col - word.col;
          puzzleData.grid[row][col] = {
            letter: word.word[letterIndex],
            wordIds: puzzleData.grid[row][col] && puzzleData.grid[row][col].wordIds ? 
              [...puzzleData.grid[row][col].wordIds, word.id] : [word.id]
          };
        } else if (word.direction === 'down' && word.col === col && 
                  row >= word.row && row < word.row + word.word.length) {
          isActive = true;
          let letterIndex = row - word.row;
          puzzleData.grid[row][col] = {
            letter: word.word[letterIndex],
            wordIds: puzzleData.grid[row][col] && puzzleData.grid[row][col].wordIds ? 
              [...puzzleData.grid[row][col].wordIds, word.id] : [word.id]
          };
        }
      });
      
      if (isActive) {
        cell.classList.add('active');
        
        const input = document.createElement('input');
        input.maxLength = 1;
        input.dataset.row = row;
        input.dataset.col = col;
        input.addEventListener('input', handleInput);
        input.addEventListener('keydown', handleKeyDown);
        input.addEventListener('focus', function() {
          if (!timerStarted) {
            startTimer();
            timerStarted = true;
          }
        });
        
        cell.appendChild(input);
        
        if (cellNumber !== null) {
          const numberSpan = document.createElement('span');
          numberSpan.className = 'cell-number';
          numberSpan.textContent = cellNumber;
          cell.appendChild(numberSpan);
        }
      }
      
      grid.appendChild(cell);
    }
  }
  
  // Add questions to question list
  const acrossWords = puzzleData.words.filter(word => word.direction === 'across');
  const downWords = puzzleData.words.filter(word => word.direction === 'down');
  
  acrossWords.forEach(word => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.innerHTML = `<strong>${word.id}.</strong> ${word.clue}`;
    acrossQuestions.appendChild(questionDiv);
  });
  
  downWords.forEach(word => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.innerHTML = `<strong>${word.id}.</strong> ${word.clue}`;
    downQuestions.appendChild(questionDiv);
  });
}

// Update leaderboard display
function updateLeaderboardDisplay() {
  const leaderboardBody = document.getElementById('leaderboard-body');
  leaderboardBody.innerHTML = '';
  
  // Sort leaderboard by score*timer value (ascending)
  leaderboard.sort((a, b) => a.scoreTimerValue - b.scoreTimerValue);
  
  // Display all entries
  leaderboard.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.score}/6</td>
      <td>${formatTime(entry.timeSeconds)}</td>
      <td>${entry.scoreTimerValue}</td>
    `;
    leaderboardBody.appendChild(row);
  });
}

// Handle input in a cell
function handleInput(e) {
  if (e.target.value) {
    e.target.value = e.target.value.toUpperCase();
    const currentRow = parseInt(e.target.dataset.row);
    const currentCol = parseInt(e.target.dataset.col);
    
    // Find the next cell
    const nextInput = findNextInput(currentRow, currentCol);
    if (nextInput) {
      nextInput.focus();
    }
  }
}

// Handle key navigation
function handleKeyDown(e) {
  const currentRow = parseInt(e.target.dataset.row);
  const currentCol = parseInt(e.target.dataset.col);
  
  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault();
      const rightInput = findInput(currentRow, currentCol + 1);
      if (rightInput) rightInput.focus();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      const leftInput = findInput(currentRow, currentCol - 1);
      if (leftInput) leftInput.focus();
      break;
    case 'ArrowUp':
      e.preventDefault();
      const upInput = findInput(currentRow - 1, currentCol);
      if (upInput) upInput.focus();
      break;
    case 'ArrowDown':
      e.preventDefault();
      const downInput = findInput(currentRow + 1, currentCol);
      if (downInput) downInput.focus();
      break;
    case 'Backspace':
      if (e.target.value === '') {
        e.preventDefault();
        const prevInput = findPrevInput(currentRow, currentCol);
        if (prevInput) {
          prevInput.focus();
          prevInput.value = '';
        }
      }
      break;
  }
}

// Find input at specific row, col
function findInput(row, col) {
  return document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
}

// Find next input after current position
function findNextInput(row, col) {
  // First try to find an input to the right
  let nextInput = findInput(row, col + 1);
  if (nextInput) return nextInput;
  
  // Then try to find an input on the next row
  for (let r = row + 1; r < 11; r++) {
    for (let c = 0; c < 11; c++) {
      nextInput = findInput(r, c);
      if (nextInput) return nextInput;
    }
  }
  
  return null;
}

// Find previous input before current position
function findPrevInput(row, col) {
  // First try to find an input to the left
  let prevInput = findInput(row, col - 1);
  if (prevInput) return prevInput;
  
  // Then try to find an input on the previous row
  for (let r = row - 1; r >= 0; r--) {
    for (let c = 10; c >= 0; c--) {
      prevInput = findInput(r, c);
      if (prevInput) return prevInput;
    }
  }
  
  return null;
}

// Check answers
function checkAnswers() {
  stopTimer();
  let correctWords = 0;
  const wordStatus = {};
  
  // Initialize word status
  puzzleData.words.forEach(word => {
    wordStatus[word.id] = true;
  });
  
  const inputs = document.querySelectorAll('.cell.active input');
  inputs.forEach(input => {
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    const correctLetter = puzzleData.grid[row][col].letter;
    const wordIds = puzzleData.grid[row][col].wordIds;
    
    input.parentElement.classList.remove('correct', 'incorrect');
    
    if (input.value.toUpperCase() === correctLetter) {
      input.parentElement.classList.add('correct');
    } else {
      input.parentElement.classList.add('incorrect');
      // Mark all words containing this cell as incorrect
      wordIds.forEach(id => {
        wordStatus[id] = false;
      });
    }
  });
  
  // Count correct words
  for (const id in wordStatus) {
    if (wordStatus[id]) {
      correctWords++;
    }
  }
  
  // Update score
  currentScore = correctWords;
  updateScoreDisplay();
  
  // Add to leaderboard
  const playerName = playerNameInput.value.trim();
  const scoreTimerValue = currentScore * timerSeconds;

  // Add to leaderboard
  leaderboard.push({
    name: playerName,
    timeSeconds: timerSeconds,
    score: currentScore,
    scoreTimerValue: scoreTimerValue
  });

  // Save to localStorage
  localStorage.setItem('crosswordLeaderboard', JSON.stringify(leaderboard));

  // Update display
  updateLeaderboardDisplay();

  if (currentScore === 6) {
    // Show congrats message
    alert(`Congratulations! All answers are correct! Your time: ${formatTime(timerSeconds)}`);
  }
}

// Reveal answers
function revealAnswers() {
  const inputs = document.querySelectorAll('.cell.active input');
  inputs.forEach(input => {
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    const correctLetter = puzzleData.grid[row][col].letter;
    
    input.value = correctLetter;
    input.parentElement.classList.remove('incorrect');
    input.parentElement.classList.add('correct');
  });
}

// Reset puzzle
function resetPuzzle() {
  // Go back to welcome page
  welcomePage.style.display = 'flex';
  gamePage.style.display = 'none';
  
  // Clear the form
  playerNameInput.value = '';
  playerNameInput.focus();
  
  // Reset timer but keep leaderboard data
  resetTimer();
}

// Clear leaderboard
function clearLeaderboard() {
  if (confirm('Are you sure you want to clear the leaderboard? This action cannot be undone.')) {
    leaderboard = [];
    localStorage.removeItem('crosswordLeaderboard');
    updateLeaderboardDisplay();
  }
}

// Timer functions
function startTimer() {
  timerSeconds = 0;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  timerSeconds = 0;
  timerStarted = false;
  currentScore = 0;
  updateTimerDisplay();
  updateScoreDisplay();
}

function updateTimerDisplay() {
  document.getElementById('timer').textContent = formatTime(timerSeconds);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateScoreDisplay() {
  document.getElementById('score-display').textContent = `Score: ${currentScore}/6`;
}

// Add event listeners for buttons
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('check-btn').addEventListener('click', checkAnswers);
  document.getElementById('reveal-btn').addEventListener('click', revealAnswers);
  document.getElementById('reset-btn').addEventListener('click', resetPuzzle);
  document.getElementById('clear-leaderboard-btn').addEventListener('click', clearLeaderboard);
});