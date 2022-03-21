const output = document.getElementById("word-display");
// const outputcontainer = document.querySelector(".output-container");
const input = document.querySelector(".wordinput");
const resultElement = document.querySelector(".result");

let interval = undefined;                               // Declaring interval globally
let words = [];                                         // Initialize display variables
let elements = [];
let sentence = "";
let inputfieldvalue = "";
let number_of_words = 15;
let word = "";
let time_count = 0;                                     // Initialize timer variables
let letter_count = 0;
let count = 0;
let invoked = false;
let result = 0;                                         // Initialize result variables
let correct = 0;
let wrong = 0;

function setText() {
    output.innerHTML = "";
    for (let i = 0; i < number_of_words; i++) {
        let span = `<span>${words[randomNumber()]}</span>` + " ";
        output.innerHTML += span;
    }
}

function pageLoad() {
    input.focus();                                      // Set the cursor to the input field when the page loads / when the user hits the redo button
    resultElement.classList.add("ouput-invisible");     // Set output to invisible
}

/**
 * Return a random number in the same range as the length of the wordslist.
 */
function randomNumber() {
    return (Math.random() * (words.length - 1)).toFixed(0);
}

/**
 * Stop watch.
 */
function startwatch() {
    if (count === 0) {
        interval = setInterval(() => {
            if (time_count < 59) {
                time_count++;
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }
}

/**
 * Checks for key presses and the correctness of the words typed in the input field.
 */
input.addEventListener("keydown", (e) => {
    word = output.children[count].innerText;

    // Starts the stopwatch as soon as the first letter is typed.
    if (count === 0 && invoked === false) {
        startwatch();
        invoked = true;
    }

    // We check at each keypress if the right keys are pressed or not. This is used to provide a visual cue to the typist.
    if (e.code !== "Backspace" && e.code !== "Space") {
        inputfieldvalue += e.key;
    } else {
        if (inputfieldvalue.length > 0) {
            inputfieldvalue = inputfieldvalue.slice(0, input.value.length - 1);
        }
    }

    if (e.code !== "Space" && 
        e.code != "Tab" && 
        e.code != "Shift" &&
        e.code != "Ctrl" &&
        e.code != "Esc" &&
        e.code != "Alt") {
        check();
    }

    /**
     * @change Removed the border visual cue and add the previous border animation to the output container.
     */
    function check() {
        if (word.slice(0, inputfieldvalue.length) === inputfieldvalue) {
            input.classList.remove("input-color-change");
        } else {
            input.classList.add("input-color-change");
        }
    }

    /**
     * On space get the complete word and checks if correct or not.
     */
    if (e.code === "Space") {
        e.preventDefault();

        if (input.classList.contains("input-color-change")) {
            input.classList.remove("input-color-change");
        }

        // On the completition of the last word, calculate the wpm.
        if (count === number_of_words - 1) {
            resultElement.classList.remove("ouput-invisible");
            result = calculateTypingSpeed();
            resultElement.innerText += " " + result.toFixed(0);
            resultElement.classList.add("result");
            clearInterval(interval);
        }

        if (input.value === word) {
            output.children[count].classList.add("correct");
            correct++;
        } else if (input.value != word) {
            output.children[count].classList.add("wrong");
            wrong++;
        }

        inputfieldvalue = "";
        input.value = "";
        count++;
    }
});

/**
 * Calculate typings speed.
 */
function calculateTypingSpeed() {
    return (60 * correct) / time_count;
}

/**
 * Reset everything to default value.
 */
function redo() {
    // Re-initialize global variables
    count = 0;
    invoked = false;
    time_count = 0;
    result = 0;
    correct = 0;
    wrong = 0;
    input.value = "";
    input.classList.remove("input-color-change");

    setText();                          // On redo set text afresh again.
    clearInterval(interval);            // Set the timer to its initial state.
    pageLoad();                         // Set the cursor.
    resultElement.innerText = "WPM :";  // Set the result element text
}

/**
 * Fetches the wordslist from the random.json file / local file.
 */
fetch("/random.json")
    .then((data) => data.json())
    .then((json) => {
        words = json.words;
        setText();
    });
