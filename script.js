const output = document.getElementById("word-display")
const input = document.querySelector(".wordinput")
const resultele = document.querySelector(".result")

// Declaring interval globally
let interval = undefined

//Initialize display variables
let words = []
let elements = []
let sentence = ""
let number_of_words = 15

//initialize timer variables
let time_count = 0
let count = 0
let invoke = 0

//initialize result variables 
let result = 0
let correct = 0
let wrong = 0


function setText() {
    //Empty the output element
    output.innerHTML = ""
    //set random words to output element
    for(let i = 0 ; i < number_of_words ; i++ ) {                       //  let ele = document.createElement("span")
        let span = `<span>${words[randomNumber()]}</span>` + " "        //  ele.innerText = word + " "
        output.innerHTML += span                                        //  output.appendChild(ele)
    }   
}

function pageLoad() {
    //set the cursor to the input field when the page loads / when the user hits the redo button
    input.focus()

    //set output to invisible
    resultele.classList.add("ouput-invisible")
}


//Return a random number in the same range as the length of the wordslist
function randomNumber() {
    return (Math.random() * (words.length-1)).toFixed(0)
}

//Used to keep time
function startwatch() {
    if(count === 0) {
        interval = setInterval(() => {
            if(time_count < 59) {
                time_count++
                //console.log(time_count)
            }else{
                //console.log("about to stop")
                clearInterval(interval)
            }
        }, 1000)
    }
}

//Checks for key presses and the correctness of the words typed in the input field. *need split this logic
input.addEventListener("keydown", (e) => {
    
    //starts the stopwatch as soon as the first letter is typed.
    if(count === 0 && invoke === 0) {
        //console.log(words.length)
        startwatch()
        invoke += 1
    }
    
    //On space get the complete word and checks if correct or not.
    if(e.code == "Space") {

        let word = output.children[count].innerText
        if(input.value.trim() === word.trim()) 
        {
            output.children[count].classList.add("correct")
            correct++
        }
        else if(input.value.trim() != word)
        {
            output.children[count].classList.add("wrong")
            wrong++
        }

        //on the completition of the last word, calculate the wpm.
        if(count === (number_of_words - 1)) {
            resultele.classList.remove("ouput-invisible")
            result = calculateTypingSpeed()
            resultele.innerText += " " + result.toFixed(0)
            resultele.classList.add("result")
            clearInterval(interval)   
        }

        // console.log("correct ", correct)
        // console.log("wrong ", wrong)
        // console.log("timecount", time_count)

        input.value = ""
        count++
    }   
})

//Calculate typings speed
function calculateTypingSpeed() {
    return ((60 * correct) / time_count)
}

//Reset the whole output element. *need to check for timer reset and change accordingly.
function redo() {
    //re-initialize global variables
    count = 0
    invoke = 0
    time_count = 0
    result = 0 
    correct = 0
    wrong = 0
    
    //on redo set text afresh again.
    setText()
    //Set the timer to its initial state.
    clearInterval(interval)
    //set the cursor.
    pageLoad()

    //set the output element text
    resultele.innerText = "WPM :"
}


//fetches the wordslist from the random.json file / local file
fetch("/random.json")
    .then(data => data.json())
    .then(json => 
    { 
        words = json.words
        setText()
    })
