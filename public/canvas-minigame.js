const canvas = document.getElementById('mainCanvas')
const c = canvas.getContext('2d')

const canvasWidth = 1000
const canvasHeight = 750

const gridSize = 25

const circleGrowthAmount = 7.5
const maxCircleSize = 150
const circleShrinkageAmount = 15

let treatsCounter = 0
document.getElementById('points').innerHTML = treatsCounter
let lives = 3
document.getElementById('lives').innerHTML = lives



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

    checkOverlapWithMine(mine) {
        let legA = mine.center.x - this.center.x
        let legB = mine.center.y - this.center.y
        if (legA ** 2 + legB ** 2 <= (this.radius + mine.outerRadius) ** 2) {
            lives--
            document.getElementById('lives').innerHTML = lives
            // points-=2
            // document.getElementById('points').innerHTML = points
            return true
        }
        return false
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
    }

    get topLeft() {
        return {
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
    constructor(center, radius, outerRadius) {
        this.center = { ...center }
        this.radius = radius
        this.outerRadius = outerRadius
    }

    draw(c) {
        c.beginPath()
        c.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI)
        c.fillStyle = '#800020'
        c.fill()
        
        c.strokeStyle = '#800020'
        c.lineWidth = 2
        
        c.moveTo(this.center.x - this.outerRadius, this.center.y)
        c.lineTo(this.center.x + this.outerRadius, this.center.y)
        c.stroke()
        
        c.moveTo(this.center.x, this.center.y - this.outerRadius)
        c.lineTo(this.center.x, this.center.y + this.outerRadius)
        c.stroke()
        
        let obliqueX = Math.cos(degreesToRadians(45)) * this.outerRadius
        let obliqueY = Math.sin(degreesToRadians(45)) * this.outerRadius
        
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

let gameStateInst = new GameState(false, false)

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

function checkLossAndDisplayMessage() {
    if (mines.length <= 1) {
        gameStateInst.loss = true
        displayLossMessage()
    }
}

function handleTreatsCollision(circle, treats) {
    for (let i = 0; i < treats.length; i++) {
        if (circle.checkOverlapWithShapeCenter(treats[i])) {
            treats.splice(i, 1)
            treatsCounter++
            document.getElementById('points').innerHTML = treatsCounter
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

function handleMinesCollision(circle, mines) {
    for (let i = 0; i < mines.length; i++) {
        if (circle.checkOverlapWithMine(mines[i])) {
            mines.splice(i, 1)
            if (circle.radius - circleShrinkageAmount >= 10) { 
                circle.changeCircleSize(-circleShrinkageAmount)
            }
            redrawCanvas()
            for (let mine of mines) {
                mine.draw(c)
            }
        }
    }
}

function checkIfDrawStar(treats, star) {
    if (treats.length === 0) {
        star.draw(c) 
    }
}

let grid = new Map()
let circle = new Circle({x: canvasWidth / 2, y: canvasHeight / 2}, 50)

let mines = []

addCircleCoordinatesToGridMap(circle)

function generateMines() {
    for (let i = 0; i < 4; i++) {
        let mine = new Mine({x: getRandomInt(0, canvasWidth), y: getRandomInt(0, canvasHeight)}, 7.5, 12.5)
        ensureEntityIsInEmptyGridSquare(mine)
        mines.push(mine)
    }
}
generateMines()


let treats = []
function generateTreats() {
    for (let i = 0; i < 10; i++) {
        let treat = new Treat({x: getRandomInt(0, canvasWidth), y: getRandomInt(0, canvasHeight)})
        ensureEntityIsInEmptyGridSquare(treat)
        treats.push(treat)
    }
}
generateTreats()

let star = new Star({x: getRandomInt(20, canvasWidth - 20), y: getRandomInt(20, canvasHeight - 20)}, 5, 20, 10)
ensureEntityIsInEmptyGridSquare(star)




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


function addCircleCoordinatesToGridMap(circle) {
    for (let x = circle.center.x - circle.radius; x < circle.center.x + circle.radius; x += gridSize) {
        for (let y = circle.center.y - circle.radius; y < circle.center.y + circle.radius; y += gridSize) {
            const gridString = getGridString({ x, y })
            grid.set(gridString, 'Circle')
        }
    }
}

function ensureEntityIsInEmptyGridSquare(entity) {

    let entityType = null
    entityType = entity?.constructor.name

    let gridString = getGridString(entity.center)
    while (grid.has(gridString)) {
        entity.center.x = getRandomInt(0, canvasWidth - gridSize) + gridSize/2
        entity.center.y = getRandomInt(0, canvasHeight - gridSize) + gridSize/2
        gridString = getGridString(entity.center)
    }

    grid.set(gridString, entityType)
    entity.center.x = Math.floor(entity.center.x / gridSize) * gridSize + (gridSize / 2)
    entity.center.y = Math.floor(entity.center.y / gridSize) * gridSize + (gridSize / 2)
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
    tick()

    if (event.code == 'Enter') {
        if (gameStateInst.win || gameStateInst.loss) {
            resetGame(c)
        }
    }
})

function tick() {
    updateState()
    redrawCanvas()
}

tick()

function updateState() {   //to be called each time the circle moves 
    handleTreatsCollision(circle, treats)
    handleMinesCollision(circle, mines)
}

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
    if (treats.length === 0) {
        circle.checkOverlapWithShapeCenter(star)
    }
    checkWinAndDisplayMessage()
    checkLossAndDisplayMessage()
}

function resetGame(c) {
    treats = []
    mines = []
    circle = new Circle({x: canvasWidth / 2, y: canvasHeight / 2}, 50)
    grid = new Map()
    generateMines()
    generateTreats()
    tick()
    gameStateInst = new GameState(false, false)
    points = 0
    document.getElementById('points').innerHTML = points
    lives = 3
    document.getElementById('lives').innerHTML = lives
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