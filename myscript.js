// Images
let hangmanImg;

// Texts
let totalPointsTxt;
let levelTxt;
let questionTxt;
let incorrectGuessesTxt;
let availableCluesTxt;
let difficultyTxt;

// Containers
let wordDisplayContainer;

// Buttons
let clueBtn;
let nextQuestionBtn;
let vowelBtn;
let consonantBtn;

let answerBtnList = []

// Popups
let correctPopup;
let losePopup;
let cluePopup;

// Letters
let vowelsList = [];
let consonantsList = [];
let lettersList = [];

// Variables
let totalPoints = 0;

let maxClues = 3;
let currentClues = 3;

let maxGuesses = 3;
let currentGuesses = 0;

let currentQuestion = "";

let currentAnswer = [];
let currentAnswerPoints = 0;

let currentDifficulty = 0;
let currentLevel = 0;
let maxLevel = 10;

let hasWon = false;
let hasLost = false;
let hasCompletedGame = false;

let whitespacesList = [];

const VOWELS_LIST = 
[
    'A', 'E', 'I', 'O', 'U'
]

const CONSONANTS_LIST = 
[
    'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 
    'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'
];

// Questions
const EASY_QUESTIONS_LIST =
[
    { question: "Cell phone brand with bite?", answer: "APPLE" },
    { question: "Three line brand of shoes?", answer: "ADIDAS" },
    { question: "What DC superhero has a belt on her head?", answer: "WONDER|WOMAN" },
    { question: "What DC superhero has his underwear out?", answer: "SUPERMAN" },
    { question: "What shoes with the checked logo?", answer: "NIKE" },
    { question: "Movie with the biggest spaceship?", answer: "STAR|WARS" },
    { question: "Black Mamba of the Lakers?", answer: "KOBE" },
    { question: "Which Marvel superhero wears socks on his head?", answer: "SPIDERMAN" },
    { question: "What is the dog's name in the series 'Tom and Jerry'?", answer: "SPIKE" },
    { question: "Who is the fastest character on the DC universe?", answer: "FLASH" },
    { question: "Which dinosaur has many spines on its back?", answer: "GODZILLA" },
    { question: "What famous fast food brand has an M on its logo?", answer: "MCDONALDS" },
    { question: "What app has a bird in the logo?", answer: "TWITTER" },
    { question: "What DC superhero has characteristics of a bat?", answer: "BATMAN" },
    { question: "Who is Mickey Mouse's girlfriend?", answer: "MINNIE|MOUSE" },
    { question: "What Marvel superhero is wearing a suit of steel?", answer: "IRON|MAN" }
];

const MODERATE_QUESTIONS_LIST = 
[
    { question: "It is an interpreted, object-oriented, high-level programming language with dynamic semantics developed by Guido van Rossum", answer: "PYTHON" },
    { question: "It is known as a collection of similar data elements stored at contiguous memory locations. It consists of data items of the same type.", answer: "ARRAY" },
    { question: "It is a set of sequential instructions used \n to solve a specific problem. We can think of an \n algorithm as a step-by-step guide to accomplish a particular task.", answer: "ALGORITHM" },
    { question: "It is a data type that represents alphanumeric characters.", answer: "STRING" },
    { question: "It is a variable defined during the declaration of a function", answer: "PARAMETERS" },
    { question: "It is used to execute repetitive set of instructions that will only stop until the set conditions are met.", answer: "LOOP" },
    { question: "It is a standard character set for computers and electronic devices.", answer: "ASCII" },
    { question: "It is a name that we assign, and serves to store data values within a program.", answer: "VARIABLE" },
    { question: "These are symbols used in programming that instructs a compiler/interpreter to \n perform arithmetic, logical, and relational operations to produce a specific result.", answer: "OPERATORS" },
    { question: "These are pre-defined or reserved words that have special meanings to a compiler.\n They are part of the syntax, and we cannot use keywords as variable names.", answer: "KEYWORDS" },
    { question: "The process of developing or writing an executable computer program using programming \n languages that instruct computers how to behave or work.", answer: "CODING" }
];

const DIFFICULT_QUESTIONS_LIST = 
[
    { question: "Which of these is a free operating system?", answer: "LINUX" },
    { question: "Its part of the computer system that one can physically touch?", answer: "HARDWARE" },
    { question: "A computer uses which type of number system?", answer: "BINARY" },
    { question: "The basic units of an Excel spreadsheet where we enter data is called", answer: "CELL" },
    { question: "A common boundary between two computer systems is known as?", answer: "INTERFACE" },
    { question: "A company bought the popular video teleconferencing software Skype?", answer: "MICROSOFT" },
    { question: "The main page of a website is known as", answer: "HOME|PAGE" },
    { question: "What is a collection of data or information called, that is stored in a logical and structured way?", answer: "DATABASE" },
    { question: "Queries are special views of data in", answer: "REPORT" },
];

let easyQuestionsRandomized = [];
let moderateQuestionsRandomized = [];
let difficultQuestionsRandomized = [];

function InitializeElements()
{
    hangmanImg = document.getElementById("hangman-img");

    totalPointsTxt = document.getElementById("total-points-txt");
    levelTxt = document.getElementById("level-txt");
    questionTxt = document.getElementById("question-txt");
    incorrectGuessesTxt = document.getElementById("incorrect-guesses-txt");
    availableCluesTxt = document.getElementById("available-clues-txt");
    difficultyTxt = document.getElementById("difficulty-txt");

    wordDisplayContainer = document.getElementById("word-display-container");

    clueBtn = document.getElementById("clue-btn");
    nextQuestionBtn = document.getElementById("next-question-btn");
    vowelBtn = document.getElementById("vowel-btn");
    consonantBtn = document.getElementById("consonant-btn");

    answerBtnList = document.querySelectorAll(".keyboard button");

    correctPopup = document.getElementById("correct-popup");
    losePopup = document.getElementById("lose-popup");
    cluePopup = document.getElementById("clue-popup");
}

function NewGame()
{
    // Disable popups.
    TogglePopup('winner-popup', false);
    TogglePopup('correct-popup', false);
    TogglePopup('lose-popup', false);
    TogglePopup('clue-popup', false);
    TogglePopup('debug-popup', false);

    // Delete all whitespace elements.
    if (whitespacesList.length > 0)
    {
        for (let i = 0; i < whitespacesList.length; i++)
        {
            console.log(whitespacesList[i]);
            whitespacesList[i].remove();
        }
    }

    whitespacesList = [];

    // Reset all answer button states.
    for (let i = 0; i < answerBtnList.length; i++)
    {
        answerBtnList[i].setAttribute("class", "enabled");
    }

    // Remove all whitespaces
    for (let i = 0; i < currentAnswer.length; i++)
    {
        if (currentAnswer[i] == "|")
        {
            currentAnswer.removeAt(i);
        }
        else
        {
            continue;
        }
    }

    // Reset letters.
    if (lettersList.length > 0)
    {
        for (let i = 0; i < lettersList.length; i++)
        {
            lettersList[i].remove();
        }
    }

    // Reset variables.
    totalPoints = 0;

    currentClues = maxClues;

    currentGuesses = 0;

    currentQuestion = "";

    currentAnswer = [];
    currentAnswerPoints = 0;

    vowelsList = [];
    consonantsList = [];
    lettersList = [];

    currentDifficulty = 0;
    currentLevel = 1;
    
    hasWon = false;
    hasLost = false;

    // Questions
    easyQuestionsRandomized = RandomQuestions(EASY_QUESTIONS_LIST, 10);
    moderateQuestionsRandomized = RandomQuestions(MODERATE_QUESTIONS_LIST, 10);
    difficultQuestionsRandomized = RandomQuestions(DIFFICULT_QUESTIONS_LIST, 10);

    console.log(easyQuestionsRandomized);
    console.log(moderateQuestionsRandomized);
    console.log(difficultQuestionsRandomized);

    // Set HTML element states.
    totalPointsTxt.textContent = totalPoints + " pt/s.";
    levelTxt.textContent = "[" + currentLevel + "/" + 10 + "] ";
    hangmanImg.src = "pictures/hangman_state_00.png";
    incorrectGuessesTxt.textContent = currentGuesses + "/" + maxGuesses;
    availableCluesTxt.textContent = currentClues + "/" + maxClues;

    InitializeQNA(currentDifficulty);
}

function InitializeQNA(difficulty)
{
    switch (difficulty)
    {
        case 0:
            currentQuestion = easyQuestionsRandomized[currentLevel - 1].question;

            for (let i = 0; i < easyQuestionsRandomized[currentLevel - 1].answer.length; i++)
            {
                currentAnswer.push(easyQuestionsRandomized[currentLevel - 1].answer[i]);
            }

            questionTxt.textContent = currentQuestion;
            difficultyTxt.textContent = "Easy";
            difficultyTxt.style.color = "green";

            for (let i = 0; i < currentAnswer.length; i++)
            {
                CreateLetter(currentAnswer[i]);
            }

            // Remove all whitespaces
            for (let i = 0; i < currentAnswer.length; i++)
            {
                if (currentAnswer[i] == "|")
                {
                    currentAnswer.removeAt(i);
                }
                else
                {
                    continue;
                }
            }

            break;
        case 1:
            currentQuestion = moderateQuestionsRandomized[currentLevel - 1].question;

            for (let i = 0; i < moderateQuestionsRandomized[currentLevel - 1].answer.length; i++)
            {
                currentAnswer.push(moderateQuestionsRandomized[currentLevel - 1].answer[i]);
            }

            questionTxt.textContent = currentQuestion;
            difficultyTxt.textContent = "Moderate";
            difficultyTxt.style.color = "orange";

            for (let i = 0; i < currentAnswer.length; i++)
            {
                CreateLetter(currentAnswer[i]);
            }

            // Remove all whitespaces
            for (let i = 0; i < currentAnswer.length; i++)
            {
                if (currentAnswer[i] == "|")
                {
                    currentAnswer.removeAt(i);
                }
                else
                {
                    continue;
                }
            }

            break;
        case 2:
            currentQuestion = difficultQuestionsRandomized[currentLevel - 1].question;

            for (let i = 0; i < difficultQuestionsRandomized[currentLevel - 1].answer.length; i++)
            {
                currentAnswer.push(difficultQuestionsRandomized[currentLevel - 1].answer[i]);
            }

            questionTxt.textContent = currentQuestion;
            difficultyTxt.textContent = "Difficult";
            difficultyTxt.style.color = "red";

            for (let i = 0; i < currentAnswer.length; i++)
            {
                CreateLetter(currentAnswer[i]);
            }

            // Remove all whitespaces
            for (let i = 0; i < currentAnswer.length; i++)
            {
                if (currentAnswer[i] == "|")
                {
                    currentAnswer.removeAt(i);
                }
                else
                {
                    continue;
                }
            }

            break;
        default:
            console.log("Invalid difficulty value!");
            break;
    }

    GatherClueFromAnswer();
    console.log(currentAnswer);
}

function NextQuestion()
{
    CheckGameState();

    // Disable popups.
    TogglePopup('winner-popup', false);
    TogglePopup('correct-popup', false);
    TogglePopup('lose-popup', false);
    TogglePopup('clue-popup', false);

    // Delete all whitespace elements.
    if (whitespacesList.length > 0)
    {
        for (let i = 0; i < whitespacesList.length; i++)
        {
            console.log(whitespacesList[i]);
            whitespacesList[i].remove();
        }
    }

    whitespacesList = [];

    // Reset all answer button states.
    for (let i = 0; i < answerBtnList.length; i++)
    {
        answerBtnList[i].setAttribute("class", "enabled");
    }

    // Reset letters.
    if (lettersList.length > 0)
    {
        for (let i = 0; i < lettersList.length; i++)
        {
            lettersList[i].remove();
        }
    }

    // Reset variables.
    currentQuestion = "";

    currentAnswer = [];
    currentAnswerPoints = 0;

    vowelsList = [];
    consonantsList = [];
    lettersList = [];
    
    hasWon = false;
    hasLost = false;

    // Increase level and points.
    currentLevel++;
    levelTxt.textContent = "[" + currentLevel + "/" + 10 + "] ";
    
    totalPoints += 10;
    totalPointsTxt.textContent = totalPoints + " pt/s."

    // Set HTML element states.
    InitializeQNA(currentDifficulty);

    console.log("Current Difficulty: " + currentDifficulty);
    console.log("Current Level: " + currentLevel);
}

function CreateLetter(letter)
{
    let newLetter = document.createElement("li");

    if (letter != "|")
    {
        newLetter.setAttribute("id", letter);
        newLetter.setAttribute("class", "letter");

        wordDisplayContainer.appendChild(newLetter);

        lettersList.push(newLetter);
    }
    else
    {
        newLetter.setAttribute("class", "whitespace");

        wordDisplayContainer.appendChild(newLetter);

        whitespacesList.push(newLetter);
    }
}

function EnterLetter(letter)
{
    if (hasWon || hasLost) return;

    for (let i = 0; i < currentAnswer.length; i++)
    {
        // Correct answer
        if (currentAnswer.includes(letter))
        {
            if (letter == lettersList[i].getAttribute("id"))
            {
                lettersList[i].textContent = letter;
                lettersList[i].setAttribute("id", "");
                lettersList[i].setAttribute("class", "letter guessed");

                currentAnswerPoints++;

                CheckGameState();

                // Disable button clicked.
                for (let j = 0; j < answerBtnList.length; j++)
                {
                    if (letter == answerBtnList[j].getAttribute("id"))
                    {
                        answerBtnList[j].setAttribute("class", "correct");
                    }
                }

                // Remove vowel.
                for (let k = 0; k < vowelsList.length; k++)
                {
                    if (letter == vowelsList[k])
                    {
                        vowelsList.removeAt(k);
                    }
                }
                
                // Remove consonant.
                for (let k = 0; k < consonantsList.length; k++)
                {
                    if (letter == consonantsList[k])
                    {
                        consonantsList.removeAt(k);
                    }
                }
            }
        }
        // Incorrect answer
        else
        {
            // Disable button clicked.
            for (let j = 0; j < answerBtnList.length; j++)
            {
                if (letter == answerBtnList[j].getAttribute("id"))
                {
                    if (answerBtnList[j].getAttribute("class") == "disabled") return;

                    answerBtnList[j].setAttribute("class", "disabled");

                    currentGuesses++;
                    incorrectGuessesTxt.textContent = currentGuesses + "/" + maxGuesses;

                    CheckGameState();
                }
            }
        }
    }
}

function CheckGameState()
{
    // Check if user has won.
    if (currentAnswerPoints >= currentAnswer.length)
    {
        hasWon = true;

        if (currentDifficulty > 2)
        {
            TogglePopup('winner-popup', true);
        }
        else
        {
            TogglePopup('correct-popup', true);
        }
    }

    // Check if user has lost.
    if (currentGuesses >= maxGuesses)
    {
        hasLost = true;

        TogglePopup('lose-popup', true);
    }

    // Check difficulty state.
    if (currentLevel >= maxLevel)
    {
        currentDifficulty++;
        currentLevel = 0;
    }

    // Update hangaroo image based on incorrect guesses.
    if (currentGuesses >= 3) return;
    
    hangmanImg.src = "pictures/hangman_state_0" + currentGuesses + ".png";
}

function RandomQuestions(array, count) 
{
    const shuffledArray = array.slice().sort(() => Math.random() - 0.5);

    const resultArray = [];

    for (let i = 0; i < count; i++) 
    {
        if (i < shuffledArray.length) 
        {
            resultArray.push(shuffledArray[i]);
        } 
        else 
        {
            shuffledArray.sort(() => Math.random() - 0.5);
            resultArray.push(shuffledArray[0]);
        }
    }

    return resultArray;
}

function GatherClueFromAnswer()
{
    vowelsList = [];
    consonantsList = [];

    // Check for vowels.
    for (let i = 0; i < VOWELS_LIST.length; i++)
    {
        if (currentAnswer.includes(VOWELS_LIST[i]))
        {
            vowelsList.push(VOWELS_LIST[i]);
        }
    }

    // Check for consonants.
    for (let i = 0; i < CONSONANTS_LIST.length; i++)
    {
        if (currentAnswer.includes(CONSONANTS_LIST[i]))
        {
            consonantsList.push(CONSONANTS_LIST[i]);
        }
    }

    console.log("Vowels: " + vowelsList);
    console.log("Consonants: " + consonantsList);
}

function OpenClue()
{
    if (currentClues > 0)
    {
        TogglePopup('clue-popup', true);

        // Check for vowels.
        if (vowelsList.length > 0)
        {
            vowelBtn.style.display = "inline";
        }
        else if (vowelsList.length <= 0)
        {
            vowelBtn.style.display = "none";
        }

        // Check for consonants.
        if (consonantsList.length > 0)
        {
            consonantBtn.style.display = "inline";
        }
        else if (consonantsList.length <= 0)
        {
            consonantBtn.style.display = "none";
        }
    }
    else
    {
        TogglePopup('noclue-prompt-popup', true);
    }
}

function GetClue(type)
{
    if (totalPoints < 25)
    {
        TogglePopup('clue-prompt-popup', true);

        return;
    }
    
    let randomVowel = Math.floor(Math.random() * vowelsList.length);
    let randomConsonant = Math.floor(Math.random() * consonantsList.length);

    switch (type)
    {
        // Vowel
        case 0:
            
            console.log("Chosen clue:" + vowelsList[randomVowel]);
            
            EnterLetter(vowelsList[randomVowel]);

            totalPoints -= 25;
            totalPointsTxt.textContent = totalPoints + " pt/s.";

            currentClues--;
            availableCluesTxt.textContent = currentClues + "/" + maxClues;
            break;
        // Consonant
        case 1:
            
            console.log("Chosen clue:" + consonantsList[randomConsonant]);

            EnterLetter(consonantsList[randomConsonant]);

            totalPoints -= 25;
            totalPointsTxt.textContent = totalPoints + " pt/s.";

            currentClues--;
            availableCluesTxt.textContent = currentClues + "/" + maxClues;
            break;
        default:
            break;
    }
}

function TogglePopup(popupID, state)
{
    if (state == true)
    {
        document.getElementById(popupID).style.display = 'flex';
    }
    else
    {
        document.getElementById(popupID).style.display = 'none';
    }
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.removeAt = function(from, to)
{
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// Debug functions
function IncreaseTotalPoints()
{
    totalPoints += 25;
    totalPointsTxt.textContent = totalPoints + " pt/s."
}

function DecreaseTotalPoints()
{
    if (totalPoints <= 0) return;

    totalPoints -= 25;
    totalPointsTxt.textContent = totalPoints + " pt/s."
}

function IncreaseClue()
{
    currentClues ++;
    availableCluesTxt.textContent = currentClues + "/" + maxClues;
}

function DecreaseClue()
{
    if (currentClues <= 0) return;
    
    currentClues --;
    availableCluesTxt.textContent = currentClues + "/" + maxClues;
}

// Execute functions upon loading website.
InitializeElements();
NewGame();