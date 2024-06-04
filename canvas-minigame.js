const canvas = document.getElementById('mainCanvas')
const c = canvas.getContext('2d')

const canvasWidth = 1000
const canvasHeight = 750

const gridSize = 25

const circleGrowthAmount = 7.5
const maxCircleSize = 150

// min is inclusive, max is exclusive
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180
}

class Circle {
    constructor(center, radius) {
        this.center = { ...center }
        this.radius = radius
    }

    draw(c) {
        c.beginPath()
        c.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI)
        c.closePath()
        c.fillStyle = 'lightblue'
        c.fill()
    }

    checkOverlapWithShapeCenter(shape) {
        let legA = shape.center.x - this.center.x
        let legB = shape.center.y - this.center.y
        if (legA ** 2 + legB ** 2 <= this.radius ** 2) {
            return true
        }
        return false
    }

    checkOverlapWithCircle(circles) {
        for (let i = 0; i < circles.length; i++) {
            let legA = circles[i].center.x - this.center.x
            let legB = circles[i].center.y - this.center.y
            if (legA ** 2 + legB ** 2 <= (this.radius + circles[i].arm) ** 2) {
                circles.splice(i, 1)
                if (this.radius -20 >= 10) { 
                    this.changeCircleSize(-15)
                }
                redrawCanvas()
                for (let circle of circles) {
                    circle.draw(c)
                }
            }
        }
        if (circles.length <= 1) {
            gameStateInst.loss = true
            displayLossMessage()
        }
    }

    changeCircleSize(delta) {
        this.radius += delta
    }
}

class Treat {
    constructor(center) {
        this.center = { ...center }
        this.size = {
            width: 15,
            height: 15
        }
        this.topLeft =  {
            x: this.center.x - (this.size.width / 2),
            y: this.center.y - (this.size.height / 2)
        }
    }

    draw(c) {
        c.fillStyle = 'orange'
        c.fillRect(this.topLeft.x, this.topLeft.y, this.size.width, this.size.height)
    }

}


class Mine {
    constructor(center, radius, arm) {
        this.center = { ...center }
        this.radius = radius
        this.arm = arm
    }

    draw(c) {
        c.beginPath()
        c.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI)
        c.fillStyle = '#800020'
        c.fill()
        
        c.strokeStyle = '#800020'
        c.lineWidth = 2
        
        c.moveTo(this.center.x - this.arm, this.center.y)
        c.lineTo(this.center.x + this.arm, this.center.y)
        c.stroke()
        
        c.moveTo(this.center.x, this.center.y - this.arm)
        c.lineTo(this.center.x, this.center.y + this.arm)
        c.stroke()
        
        let obliqueX = Math.cos(degreesToRadians(45)) * this.arm
        let obliqueY = Math.sin(degreesToRadians(45)) * this.arm
        
        c.moveTo(this.center.x + obliqueX, this.center.y - obliqueY)
        c.lineTo(this.center.x - obliqueX, this.center.y + obliqueY)
        c.stroke()
        
        c.moveTo(this.center.x - obliqueX, this.center.y - obliqueY)
        c.lineTo(this.center.x + obliqueX, this.center.y + obliqueY)
        c.stroke()
        c.closePath()    
    }
}

class Star {
    constructor(center, numSpikes, outerRadius, innerRadius) {
        this.center = { ...center}
        this.numSpikes = numSpikes 
        this.outerRadius = outerRadius
        this.innerRadius = innerRadius
    }

    draw(c){
        drawStar(this.center, this.numSpikes, this.outerRadius, this.innerRadius, c)
    }
}

class GameState {
    constructor(win, loss) {
        this.win = win
        this.loss = loss
    }
}

const gameStateInst = new GameState(false, false)

function checkWinAndDisplayMessage() {
    if (treats.length === 0) {
        if (circle.checkOverlapWithShapeCenter(star)) {
            gameStateInst.win = true
        }
        if (gameStateInst.win) {
            displayWinMessage()
        }
    }
}

function handleTreatsCollision(circle, treats) {
    for (let i = 0; i < treats.length; i++) {
        if (circle.checkOverlapWithShapeCenter(treats[i])) {
            treats.splice(i, 1)
            if (circle.radius + circleGrowthAmount <= maxCircleSize) {
                circle.changeCircleSize(circleGrowthAmount)
            }
            redrawCanvas()
            for (let treat of treats) {
                treat.draw(c)
            }
            checkIfDrawStar(treats, star)
        }
    }
}

function checkIfDrawStar(treats, star) {
    if (treats.length === 0) {
        star.draw(c) 
    }
}

let grid = new Map
let circle = new Circle({x: canvasWidth / 2, y: canvasHeight / 2}, 50)

let mines = []

function randomiseCanvasHalf(margin, canvasXY, circleRadius) {
    if (getRandomInt(0, 2) === 0) {
        return getRandomInt(margin, canvasXY/2 - circleRadius)
    } else {
        return getRandomInt(canvasXY/2 + circleRadius, canvasXY - margin)
    }
}

function randomiseGridCanvasHalf(canvasXY, gridSize, circleRadius) {
    if (getRandomInt(0, 2) === 0) {
        return getRandomInt(0, canvasXY/gridSize/2 - circleRadius/gridSize) * gridSize + gridSize/2
    } else {
        return getRandomInt(canvasXY/gridSize/2 + circleRadius/gridSize, canvasXY/gridSize) * gridSize + gridSize/2
    }
}

function generateMines() {
    for (let i = 0; i < 4; i++) {
        let mine = new Mine({x: randomiseCanvasHalf(17.5, canvasWidth, circle.radius), y: randomiseCanvasHalf(17.5, canvasHeight, circle.radius)}, 7.5, 12.5)
        updateGridCoordinates(mine)
        mines.push(mine)
    }
}
generateMines()


let treats = []
function generateTreats() {
    for (let i = 0; i < 10; i++) {
        let treat = new Treat({x: randomiseGridCanvasHalf(canvasWidth, gridSize, circle.radius), y: randomiseGridCanvasHalf(canvasHeight, gridSize, circle.radius)})
        updateGridCoordinates(treat)
        treats.push(treat)
    }
}
generateTreats()

let star = new Star({x: getRandomInt(20, canvasWidth - 20), y: getRandomInt(20, canvasHeight - 20)}, 5, 20, 10)

preDrawingCircle(treats, mines)
circle.draw(c)
postDrawingCircle(treats, mines)



function redrawCanvas() {
    c.reset()
    drawAxis()
    for (let mine of mines) {
        mine.draw(c)
    }
    for (let treat of treats) {
        treat.draw(c)
    }
    circle.draw(c)
    checkIfDrawStar(treats, star)
}

function displayWinMessage() {
    c.reset()
    c.font = '50px calibri'
    c.fillStyle = '#20B2AA'
    c.fillText('You won :D', 380, 335)
    c.font = '30px calibri'
    c.fillStyle = 'orange'
    c.fillText('Press Enter to play again', 340, 405)
}

function displayLossMessage() {
    c.reset()
    c.font = '50px calibri'
    c.fillStyle = '#E52B50'
    c.fillText('Game over :(', 385, 335)
    c.font = '35px calibri'
    c.fillStyle = 'orange'
    c.fillText('Press Enter to play again', 340, 405)       
}

function getGridString(pxCoordinates) {
    let gridX = Math.floor(pxCoordinates.x / gridSize)
    let gridY = Math.floor(pxCoordinates.y / gridSize)
    return `${ gridX }, ${ gridY}`
}

function updateGridCoordinates(entity) {
    let gridString = getGridString(entity.center)
    while (grid.has(gridString)) {
        if (entity instanceof Treat) {
            entity.center.x = getRandomInt(0, canvasWidth - gridSize) + gridSize/2
            entity.center.y = getRandomInt(0, canvasHeight - gridSize) + gridSize/2
        } else if (entity instanceof Mine) {
            entity.center.x = getRandomInt(entity.arm, canvasWidth - entity.arm)
            entity.center.y = getRandomInt(entity.arm, canvasHeight - entity.arm)
        } else if (entity instanceof Star) {
            entity.center.x = getRandomInt(entity.outerRadius, canvasWidth - entity.outerRadius)
            entity.center.y = getRandomInt(entity.outerRadius, canvasHeight - entity.outerRadius)
        } else {
            entity.center.x = getRandomInt(entity.radius, canvasWidth - entity.radius)
            entity.center.y = getRandomInt(entity.radius, canvasHeight - entity.radius)
        }
        gridString = getGridString(entity.center)
    }
    
    let entityType = null
    if (entity instanceof Treat) {
        entityType = 'Treat'
    } else if (entity instanceof Mine) {
        entityType = 'Mine'
    } else if (entity instanceof Star) {
        entityType = 'Star'
    } else {
        entityType = 'Circle'
    }

    if (!grid.has(gridString)) {
        // if (!(entity instanceof Treat)) {
            grid.set(gridString, entityType)
            entity.center.x = Math.floor(entity.center.x / gridSize) * gridSize + (gridSize / 2)
            entity.center.y = Math.floor(entity.center.y / gridSize) * gridSize + (gridSize / 2)
        // }
    }
}


function preDrawingCircle(treats, mines) {
    c.reset()
    drawAxis()
    handleTreatsCollision(circle, treats)
    for (let treat of treats) {
        treat.draw(c)
    }
    for (let mine of mines) {
        mine.draw(c)
    }
}

function postDrawingCircle(treats, mines) {
    circle.checkOverlapWithCircle(mines)
    checkIfDrawStar(treats, star)
    if (treats.length === 0) {
        circle.checkOverlapWithShapeCenter(star)
    }
    checkWinAndDisplayMessage()
}


window.addEventListener('keydown', function(event) {
    let stepDistance = gridSize
    if (event.code == 'KeyD' || event.code == 'ArrowRight') {
        if (circle.center.x + stepDistance <= 1000) {
            circle.center.x += stepDistance
        }    
    } else if (event.code == 'KeyA' || event.code == 'ArrowLeft') {
        if (circle.center.x - stepDistance >= 0) {
            circle.center.x -= stepDistance
        } 
    } else if (event.code === 'KeyS' || event.code == 'ArrowDown') {
        if (circle.center.y + stepDistance <= 750) {
            circle.center.y += stepDistance
        }  
    } else if (event.code === 'KeyW' || event.code == 'ArrowUp') {
        if (circle.center.y - stepDistance >= 0) {
            circle.center.y -= stepDistance
        }
    }
    preDrawingCircle(treats, mines)
    circle.draw(c)
    postDrawingCircle(treats, mines)

    if (event.code == 'Enter') {
        if (gameStateInst.win || gameStateInst.loss) {
            resetGame(c)
        }
    }
})

function resetGame(c) {
    treats.length = 0
    mines.length = 0
    circle.center.x = canvasWidth/2
    circle.center.y = canvasHeight/2
    circle.radius = 50
    generateMines()
    generateTreats()
    redrawCanvas()
    preDrawingCircle(treats, mines)
    circle.draw(c)
    postDrawingCircle(treats, mines)
    gameStateInst.win = false
    gameStateInst.loss = false
}


function drawAxis() {
    c.beginPath()
    c.moveTo(canvasWidth/2, 0)
    c.lineTo(canvasWidth/2, canvasHeight)
    c.stroke()

    c.beginPath()
    c.moveTo(0, canvasHeight/2)
    c.lineTo(canvasWidth, canvasHeight/2)
    c.stroke()
}

// below is an adaptation of a utility function for drawing starts
function drawStar(center, spikes, outerRadius, innerRadius, c) {
    let rot = Math.PI/2 * 3
    let x = center.x
    let y = center.y
    const step = Math.PI / spikes

    c.beginPath()
    c.moveTo(center.x, center.y - outerRadius)
    for (let i = 0; i < spikes; i++){
      x = center.x + Math.cos(rot) * outerRadius
      y = center.y + Math.sin(rot) * outerRadius
      c.lineTo(x, y)
      rot += step

      x = center.x + Math.cos(rot) * innerRadius
      y = center.y + Math.sin(rot) * innerRadius
      c.lineTo(x, y)
      rot += step
    }

    c.lineTo(center.x, center.y - outerRadius)
    c.closePath()
    c.lineWidth = 5
    c.strokeStyle = '#FFD700'
    c.stroke()
    c.fillStyle = '#FFD700'
    c.fill()
}