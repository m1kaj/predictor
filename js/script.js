var playerScore = 0;
var aiScore = 0;
var memIndex = 0;
var gameOver = false;
var mem = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var d0;


function initialize() {
    for (var j = 0; j < 15; j = j + 2) {
        mem[j] = 0x7f;
        mem[j+1] = 0x80;
    }
    playerScore = 0;
    aiScore = 0;
    memIndex = 0;
    gameOver = false;

    document.getElementById("game-result").innerHTML = " ";
    document.getElementById("player-left").addEventListener("touchstart", preventZoom);
    document.getElementById("player-right").addEventListener("touchstart", preventZoom);
    document.getElementById("reset-game").addEventListener("click", handleClickNewGame);
    document.getElementById("player-left").addEventListener("click", handleClickLeft);
    document.getElementById("player-right").addEventListener("click", handleClickRight);
}

function addLeft(i) {
    mem[i] = mem[i] - 1;

    if (mem[i] < 0) {
        mem[i] = 255;
    }

    return (i << 1) & 0xf;
}

function addRight(i) {
    mem[i] = mem[i] + 1;

    if (mem[i] > 255) {
        mem[i] = 0;
    }

    return ((i << 1) & 0xf) ^ 0x1;
}

function playPoint(direction) {
    var prediction;

    if (gameOver === false) {
        
        if ((mem[memIndex] & 0x80) > 0) {
            prediction = 'Right';
            document.getElementById("computer-right").style.backgroundColor = "#ff0000";
            setTimeout(returnColorRed, 200);

        } else {
            prediction = 'Left';
            document.getElementById("computer-left").style.backgroundColor = "#0000ff";
            setTimeout(returnColorBlue, 200);
        }

        if (direction === 'Left') {
            memIndex = addLeft(memIndex);
        } else {
            memIndex = addRight(memIndex);
        }

        if (prediction === direction) {
            aiScore = aiScore + 1;
        } else {
            playerScore = playerScore + 1;
        }

        if (aiScore > 99) {
            gameOver = true;
            displayWinner('CPU wins in ');
            removeClickHandlers();
        }

        if (playerScore > 99) {
            gameOver = true;
            displayWinner('You win in ');
            removeClickHandlers();
        }
    }

    updateScore();
}

function updateScore() {
    document.getElementById("player-score").innerHTML = playerScore;
    document.getElementById("computer-score").innerHTML = aiScore;

    if (playerScore < aiScore) {
        document.getElementById("player-score").style.color = "#ff0000";
    } else {
        document.getElementById("player-score").style.color = "#008000";
    }

    if (aiScore < playerScore) {
        document.getElementById("computer-score").style.color = "#ff0000";
    } else {
        document.getElementById("computer-score").style.color = "#008000";
    }
}

function handleClickNewGame() {
    initialize();
    updateScore();
    d0 = new Date();
}

function handleClickLeft() {
    playPoint('Left');
}

function handleClickRight() {
    playPoint('Right');
}

function handleKey(event) {
    var key;
    event = event || window.event;
    key = event.which || event.keyCode;

    if (key == 82) {
        document.getElementById("reset-game").style.backgroundColor = "#049372";
        document.getElementById("reset-game").style.boxShadow = "0 1px #082213";
        setTimeout(returnColorShadowGreen, 200);
        handleClickNewGame();

    } else if (key == 37) {
        document.getElementById("player-left").style.backgroundColor = "#3477db";
        document.getElementById("player-left").style.boxShadow = "0 1px #1f3a93";
        setTimeout(returnColorShadowBlue, 200);
        handleClickLeft();

    } else if (key == 39) {
        document.getElementById("player-right").style.backgroundColor = "#f22613";
        document.getElementById("player-right").style.boxShadow = "0 1px #96281b";
        setTimeout(returnColorShadowRed, 200);
        handleClickRight();
    }
}

function returnColorShadowBlue() {
        document.getElementById("player-left").style.backgroundColor = "#3a539b";
        document.getElementById("player-left").style.boxShadow = "0px 3px #1f3a93";
}

function returnColorShadowRed() {
        document.getElementById("player-right").style.backgroundColor = "#d4533b";
        document.getElementById("player-right").style.boxShadow = "0px 3px #96281b";
}

function returnColorShadowGreen() {
        document.getElementById("reset-game").style.backgroundColor = "#008040";
        document.getElementById("reset-game").style.boxShadow = "0px 3px #082213";
}

function returnColorRed() {
    document.getElementById("computer-right").style.backgroundColor = "#d4533b";
}

function returnColorBlue() {
    document.getElementById("computer-left").style.backgroundColor = "#3a539b";
}

function displayWinner(winner) {
    var d1 = new Date();
    var t1 = d1.getTime();
    var endNote = winner + ((t1 - d0.getTime()) / 1000) + ' s';
    document.getElementById("game-result").innerHTML = endNote;
}

// Finally. I get to copy-paste code from Stack Overflow without
// understanding the details. This seems to help prevent Zoom
// function in Android when double tapping the play buttons.

function preventZoom(e) {
  var t2 = e.timeStamp;
  var t1 = e.currentTarget.dataset.lastTouch || t2;
  var dt = t2 - t1;
  var fingers = e.touches.length;
  e.currentTarget.dataset.lastTouch = t2;

  if (!dt || dt > 500 || fingers > 1) return; // not double-tap

  e.preventDefault();
  e.target.click();
}