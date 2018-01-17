var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 5;
var ballSpeedY = 2;

var player1Score= 0;
var computerScore = 0;
const WINNING_SCORE = 5;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

function calculateMousePos (evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX -rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

function handleMouseClick(evt) {
    if (showingWinScreen){
        player1Score = 0;
        computerScore = 0;
        showingWinScreen =false;
    }
}

window.onload = function(){
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    var framesPerSecond = 50;
    setInterval(function(){
        moveEverything();
        drawEverything();
    }, 1000/50);

    canvas.addEventListener("mousedown", handleMouseClick);

    canvas.addEventListener("mousemove", function(evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    })
}

function ballReset() {
    if (player1Score >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
        showingWinScreen = true;
    }
    ballSpeedX = -ballSpeedX
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
    if (paddle2YCenter < ballY - 30 && paddle2Y + PADDLE_HEIGHT < canvas.height) {
        paddle2Y += 6;
    } else if (paddle2YCenter > ballY - 30 && paddle2Y > 0) {
        paddle2Y -= 6;
    }
}

function moveEverything(){
    if (showingWinScreen) {
        return;
    }
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX-1;
            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
            ballSpeedY =deltaY * 0.25;
        } else {
            computerScore ++;
            ballReset();
        }
    }
    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX-1;
            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.25;
        } else {
            player1Score ++;
            ballReset();
        }
    }
    if (ballY > canvas.height || ballY < 0) {
        ballSpeedY= -ballSpeedY;
    }
}

function drawNet() {
    for (var i = 10; i < canvas.height; i+=40) {
        colorRect(canvas.width/2-1,i,2,20,"white");
    }
}

function drawEverything() {
    //black screen
    colorRect(0, 0, canvas.width, canvas.height, "black");

    if (showingWinScreen) {
        canvasContext.fillStyle = "white";
        canvasContext.font="20px arial";
        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText("You Won!!!", 350, 200);
        } else {
            canvasContext.fillText("You Lose", 350, 200);
        }

        
        canvasContext.fillText("click to continue", 350, 500);
        return;
    }

    drawNet();

    canvasContext.font = "15px arial";
    //left paddle
    colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
    //right paddle
    colorRect(canvas.width - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
    //ball
    colorCircle(ballX, ballY, 10, "white");

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(computerScore, canvas.width - 100, 100);
}

function colorRect (leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = "drawColor";
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}