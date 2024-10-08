//! board
let board
let boardWidth = 500
let boardHeight = 500
let context

//! player
let playerWidth = 80
let playerHeight = 10
let playerVelocityX = 10

let player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
}

//! ball
let ballWidth = 10
let ballHeight = 10
let ballVelocityX = 3
let ballVelocityY = 2

let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
}

//! blocks
let blockArray = []
let blockWidth = 50
let blockHeight = 10
let blockColumns = 8
let blockRows = 3
let blockMaxRows = 10
let blockCount = 0

//! starting block corner top left
let blockX = 15
let blockY = 45

let score = 0
let gameOver = false

window.onload = function () {
    board = document.getElementById("board")
    board.height = boardHeight
    board.width = boardWidth
    context = board.getContext("2d")

    //! draw initial player
    context.fillStyle = "red"
    context.fillRect(player.x, player.y, player.width, player.height)

    document.addEventListener("keydown", movePlayer)

    // document.getElementById("left-button").addEventListener("click", function () {
    //     let nextPlayerX = player.x - player.velocityX
    //     if (!outOfBounds(nextPlayerX)) {
    //         player.x = nextPlayerX
    //     }
    // })
    // document.getElementById("right-button").addEventListener("click", function () {
    //     let nextPlayerX = player.x + player.velocityX
    //     if (!outOfBounds(nextPlayerX)) {
    //         player.x = nextPlayerX
    //     }
    // })
    // document.getElementById("left-button").addEventListener("mousedown", function () {
    //     player.velocityX = -playerVelocityX
    //     movePlayerInterval = setInterval(() => {
    //         let nextPlayerX = player.x + player.velocityX
    //         if (!outOfBounds(nextPlayerX)) {
    //             player.x = nextPlayerX
    //         }
    //     }, 100)
    // })
    // document.getElementById("left-button").addEventListener("mouseup", function () {
    //     clearInterval(movePlayerInterval)
    // })

    // document.getElementById("right-button").addEventListener("mousedown", function () {
    //     player.velocityX = playerVelocityX
    //     movePlayerInterval = setInterval(() => {
    //         let nextPlayerX = player.x + player.velocityX
    //         if (!outOfBounds(nextPlayerX)) {
    //             player.x = nextPlayerX
    //         }
    //     }, 100)
    // })
    // document.getElementById("right-button").addEventListener("mouseup", function () {
    //     clearInterval(movePlayerInterval)
    // })

    // Mobile controls
    document.getElementById("left-button").addEventListener("touchstart", function () {
        player.velocityX = -playerVelocityX;
        movePlayerInterval = setInterval(movePlayerOnTouch, 100);
    });
    document.getElementById("left-button").addEventListener("touchend", function () {
        clearInterval(movePlayerInterval);
        player.velocityX = 0;
    });

    document.getElementById("right-button").addEventListener("touchstart", function () {
        player.velocityX = playerVelocityX;
        movePlayerInterval = setInterval(movePlayerOnTouch, 100);
    });
    document.getElementById("right-button").addEventListener("touchend", function () {
        clearInterval(movePlayerInterval);
        player.velocityX = 0;
    });

    //! create blocks
    createBlocks()
}
function movePlayerOnTouch() {
    let nextPlayerX = player.x + player.velocityX;
    if (!outOfBounds(nextPlayerX)) {
        player.x = nextPlayerX;
    }
}

requestAnimationFrame(update)
function update() {
    requestAnimationFrame(update)
    if (gameOver) {
        return
    }
    context.clearRect(0, 0, board.width, board.height)

    //! player
    context.fillStyle = "red"
    context.fillRect(player.x, player.y, player.width, player.height)

    context.fillStyle = "white"
    ball.x += ball.velocityX
    ball.y += ball.velocityY
    context.fillRect(ball.x, ball.y, ball.width, ball.height)

    //bounce ball of walls
    if (ball.y <= 0) {
        ball.velocityY *= -1
    }
    else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
        ball.velocityX *= -1
    }
    else if (ball.y + ball.height >= boardHeight) {
        // if ball touches bottom of canvas
        //game over
        context.font = "20px sans-serif"
        context.fillText("Game Over: Press 'Space' to Restrat", 80, 400)
        gameOver = true
    }

    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1
    }

    //! blocks
    context.fillStyle = "darkblue"
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i]
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true
                ball.velocityY *= -1
                blockCount -= 1
                score += 100
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true
                ball.velocityX *= -1
                blockCount -= 1
                score += 100
            }
            context.fillRect(block.x, block.y, block.width, block.height)
        }
    }

    //! next level
    if (blockCount == 0) {
        score += 100 * blockRows * blockColumns
        blockRows = Math.min(blockRows + 1, blockMaxRows)
        createBlocks()
    }

    //!score
    context.font = "20px sans-serif"
    context.fillText(score, 10, 25)
}

function resize() {
    board.height = window.innerHeight;
    board.width = window.innerWidth;
    boardWidth = board.width;
    boardHeight = board.height;
}

window.addEventListener("resize", resize);

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth)
}

function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame()
        }
    }

    if (e.code == "ArrowLeft") {
        // player.x -= player.velocityX
        let nextPlayerX = player.x - player.velocityX
        if (!outOfBounds(nextPlayerX)) {
            player.x = nextPlayerX
        }
    }
    else if (e.code == "ArrowRight") {
        // player.x += player.velocityX
        let nextPlayerX = player.x + player.velocityX
        if (!outOfBounds(nextPlayerX)) {
            player.x = nextPlayerX
        }
    }
}

function detectCollision(h, z) {
    return h.x < z.x + z.width &&
        h.x + h.width > z.x &&
        h.y < z.y + z.height &&
        h.y + h.height > z.y
}

function topCollision(ball, block) {
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y
}

function bottomCollision(ball, block) {
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y
}

function leftCollision(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x
}

function rightCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x
}

function createBlocks() {
    blockArray = []
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x: blockX + c * blockWidth + c * 10,
                y: blockY + r * blockHeight + r * 10,
                width: blockWidth,
                height: blockHeight,
                break: false
            }
            blockArray.push(block)
        }
    }
    blockCount = blockArray.length
}

function resetGame() {
    gameOver = false
    player = {
        x: boardWidth / 2 - playerWidth / 2,
        y: boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX: playerVelocityX
    }
    ball = {
        x: boardWidth / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: ballVelocityX,
        velocityY: ballVelocityY
    }
    blockArray = []
    blockRows = 3
    score = 0
    createBlocks()

}