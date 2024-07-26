var board = []; 
var rows = 8; //number of rows
var columns =8; //number of columns

var minesCount = 15;
var minesLocation = []; // ids where the mines are "2-2", "3-4", "2-3"

var tilesClicked = 0; // goal is to click all tiles that arent mines
var flagEnabled = false;

var gameOver = false; //prevents player from clicking on any other tile when game ends

window.onload = function() {
    startGame();
}

function setMines() {
    /*minesLocation.push("2-2");
    minesLocation.push("2-3");
    minesLocation.push("5-6");
    minesLocation.push("3-4");
    minesLocation.push("1-1");*/

    // making mines randomized rather than set
    // putting a while loop, just incase if we generate same id/layout

    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click",setFlag);
    setMines();
    
    //populate the board
    for (let r =0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString(); //row and column coordinates 
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return; 
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") { // set empty, meaning it hasnt been clicked yet
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = ""; // if it is the flag, should remove flag
        }
        return; // so we dont accidentally put flag on mine and trigger it
    }

    if (minesLocation.includes(tile.id)) {
        // alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    }


    let coords = tile.id.split("-"); // if id was (0-0) turns into array ["0-0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board [r] [c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}


function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return; 

    }
    if (board[r][c].classList.contains("tile-clicked")) { // should prevent errors, and tiles clicked are skipped due to excessive recursion
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0; 

    //top 3, also checks all close tiles for mines
    minesFound += checkTile(r-1, c-1); // top left
    minesFound += checkTile(r-1, c); // top
    minesFound += checkTile(r-1, c+1); // top right

    //left and right
    minesFound += checkTile(r, c-1); //left
    minesFound += checkTile(r, c+1); //right

    //bottom 3
    minesFound += checkTile(r+1, c-1); // bottom left
    minesFound += checkTile(r+1, c); // bottom
    minesFound += checkTile(r+1, c+1); // bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        // added when mines found, if > 0, neighbors will make check (top 3)
        checkMine(r-1, c-1); //top left
        checkMine(r-1, c); //top
        checkMine(r-1, c+1); //top right 

        //left and right?
        checkMine(r, c-1); //left
        checkMine(r, c+1); //right

        //bottom 3
        checkMine(r+1, c-1); //bottom left
        checkMine(r+1, c); //bottom
        checkMine(r+1, c+1); //bottom right

    }
// checks if all the tiles without mines have been clicked
    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }


}


function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0; // if out of bounds, we set it to 0

    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}