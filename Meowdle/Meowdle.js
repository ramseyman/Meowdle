// JavaScript source code
var height = 6; //Number of guesses
var width = 5; //Length of the name (Should later be variable)

var row = 0; //Current attempt
var col = 0; //Current letter for atttempt

var gameOver = false;
var name = "TESTY"; //Change later to automatically grab name from petfinder, placeholder

window.onload = function () {
    initialize();
}

function initialize() {
    //Create Board
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
        for (let colIndex = 0; colIndex < width; colIndex++) {
            let tile = document.createElement("span");
            tile.id = rowIndex.toString() + "-" + colIndex.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    //Create Keyboard
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    ]

    for (let index = 0; index < keyboard.length; index++) {
        let currentRow = keyboard[index];
        let keyboardRow = document.createElement("div");
        if (index == 1) {
            keyboardRow.classList.add("keyboard-middle-row");
        }
        else {
            keyboardRow.classList.add("keyboard-row");
        }

        for (let letterIndex = 0; letterIndex < currentRow.length; letterIndex++) {
            let keyTile = document.createElement("div");
            let key = currentRow[letterIndex];
            keyTile.innerText = key;
            if (key == "Enter") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace";
            }
            else {
                keyTile.id = "Key" + key;
            }

            keyTile.addEventListener("click", processKey);

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            }
            else {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }

    //Listen for Key Press
    document.addEventListener("keyup", (e) => {
        processInput(e);
    })
}

function processInput(e) {
    if (gameOver) return;

    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {
            let currentTile = document.getElementById(row.toString() + '-' + col.toString());
            if (currentTile.innerText == "") {
                currentTile.innerText = e.code[3];
                col += 1;
            }
        }
    }

    else if (e.code == "Backspace") {
        if (0 < col && col <= width) {
            col -= 1;
        }
        let currentTile = document.getElementById(row.toString() + '-' + col.toString());
        currentTile.innerText = "";
    }

    else if (e.code == "Enter" && col == 5) {
        update();
        row += 1; //Move to new attempt
        col = 0; //Start at beginning of new attempt
    }

    if (!gameOver && row == height) {
        gameOver = true;
        document.getElementById("answer").innerText = name;
    }
}

function processKey() {
    let e = { "code": this.id };
    processInput(e);
}

function update() {
    let correct = 0;
    let letterCount = {}; //Hashmap to keep count of each letter in the word
    for (let index = 0; index < name.length; index++) {
        letter = name[index];
        if (letterCount[letter]) {
            letterCount[letter] +=1;
        }
        else {
            letterCount[letter] = 1;
        }
    }
    for (let charIndex = 0; charIndex < width; charIndex++) {
        let currentTile = document.getElementById(row.toString() + '-' + charIndex.toString());
        let letter = currentTile.innerText;

        //Check if letter is in correct position
        if (name[charIndex] == letter) {
            currentTile.classList.add("correct");
            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");
            correct += 1;
            letterCount[letter] -= 1;
        }
        //Check if letter is in the word

        else if (name.includes(letter) && letterCount[letter] > 0) {
            currentTile.classList.add("present");
            let keyTile = document.getElementById("Key" + letter);
            if (!keyTile.classList.contains("correct")) {
                keyTile.classList.add("present");
            }
            letterCount[letter] -= 1;
        }
        //Letter isn't in the word

        else {
            currentTile.classList.add("absent");
            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.add("absent");
        }
        if (correct == width) {
            gameOver = true;
        }
    }
}
