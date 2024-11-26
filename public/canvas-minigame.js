const canvas = document.getElementById('mainCanvas')
const c = canvas.getContext('2d')

const canvasSizeFactor = 0.9
const canvasWidth = 1000 
const canvasHeight = 750 

const gridSize = 25

const circleGrowthAmount = 7.5
const maxCircleSize = 150
const circleShrinkageAmount = 15
const minCircleSize = 10

let numAttempts = 0

const modal = document.getElementById('statsModal')
const closeModalBtn = document.getElementById('close')
closeModalBtn.onclick = function() {
    modal.style.display = 'none'
}

let startingNumTreats = 10
let startingNumBigTreats = 2
let startingNumMines = 4

// For calculating points multiplier
const firstCutoffTime = 5
const secondCutoffTime = 10

let x3MultiplierTreatsCounter = 0
let x3MultiplierBigTreatsCounter = 0
let x2MultiplierTreatsCounter = 0
let x2MultiplierBigTreatsCounter = 0
let noMultiplierTreatsCounter = 0
let noMultiplierBigTreatsCounter = 0
let minesCounter = 0

const startBtn = document.getElementById('startBtn')
startBtn.addEventListener('click', function() {
    clearTimer()
    startTimer()
    resetGameFully()
    numAttempts++
    modal.style.display = 'none'
    redrawCanvas()
    totalPoints = 0
})

// Setting up points and lives counters
let totalPoints = 0
let points = 0
document.getElementById('points').innerHTML = points
let lives = 3
document.getElementById('lives').innerHTML = lives


// Setting up time counter
// let overallMinutes = ''
// let overallSeconds = ''
let pauseMinutes = ''
let pauseSeconds = ''
const minutesEl = document.getElementById('minutes')
const secondsEl = document.getElementById('seconds')
minutesEl.innerHTML = '00'
secondsEl.innerHTML = '00'
let totalSeconds = 0
let intervalId

function startTimer() {
    minutesEl.innerHTML = '00'
    secondsEl.innerHTML = '00'
    totalSeconds = 0
    intervalId = setInterval(setTime, 1000)
}

function clearTimer() {
    clearInterval(intervalId)
    intervalId = null
}

function setTime() {
    ++totalSeconds
    secondsEl.innerHTML = pad(totalSeconds % 60)
    minutesEl.innerHTML = pad(parseInt(totalSeconds / 60))
}

function pad(val) {
    const valString = val + ""
    if (valString.length < 2) {
        return "0" + valString
    }
    return valString
}

// function getTotalTime() {
//     overallSeconds = (Number(pauseSeconds) + Number(overallSeconds)) % 60
//     overallMinutes = parseInt((Number(pauseSeconds) + Number(overallSeconds)) / 60) + Number(pauseMinutes) + Number(overallMinutes)
//     if (overallMinutes < 10) {
//         overallMinutes = '0' + overallMinutes
//     }
//     if (overallSeconds < 10) {
//         overallSeconds = '0' + overallSeconds
//     }
//     return overallMinutes + ':' + overallSeconds
// }


// Below are utility functions
function getRandomInt(min, max) {
    // min is inclusive, max is exclusive
    return Math.floor(Math.random() * (max - min)) + min
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180
}

// These are the entities featured in the game: circle, treat, mine, star and game state
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

class BigTreat {
    constructor(center) {
        this.center = { ...center }
        this.size = {
            width: 20,
            height: 20
        }
    }

    get topLeft() {
        return {
            x: this.center.x - (this.size.width / 2),
            y: this.center.y - (this.size.height / 2)
        }
    }

    draw(c) {
        c.fillStyle = '#F88379'
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

function initialState() {
    c.reset()
    c.font = '35px calibri'
    c.fillStyle = 'lightblue'
    c.fillText('Click the Start game button above to begin!', 205, 335)
}

function checkWinAndDisplayMessage() {
    if (treats.length === 0 && bigTreats.length === 0) {
        if (circle.checkOverlapWithShapeCenter(star)) {
            // getTotalTime()
            gameStateInst.win = true
        }
        if (gameStateInst.win) {
            displayStats('win')
            clearTimer()
        }
    }
}

function checkLossAndDisplayMessage() {
    if (lives === 0) {
        // getTotalTime()
        gameStateInst.loss = true
        displayStats('loss')
        clearTimer()
    }
}

function pointsMultiplier(treatType) {
    if (treatType === Treat) {
        if (minutesEl.innerHTML === '00' & Number(secondsEl.innerHTML) < firstCutoffTime) {
            x3MultiplierTreatsCounter++
            return 3
        } else if (minutesEl.innerHTML === '00' & Number(secondsEl.innerHTML) < secondCutoffTime) {
            x2MultiplierTreatsCounter++
            return 2
        } else {
            noMultiplierTreatsCounter++
            return 1
        }
    } 
    if (treatType === BigTreat) {
        if (minutesEl.innerHTML === '00' & Number(secondsEl.innerHTML) < firstCutoffTime) {
            x3MultiplierBigTreatsCounter++
            return 3
        } else if (minutesEl.innerHTML === '00' & Number(secondsEl.innerHTML) < secondCutoffTime) {
            x2MultiplierBigTreatsCounter++
            return 2
        } else {
            noMultiplierBigTreatsCounter++
            return 1
        }
    } 
}

function handleTreatsCollision(circle, treats) {
    for (let i = 0; i < treats.length; i++) {
        if (circle.checkOverlapWithShapeCenter(treats[i])) {
            treats.splice(i, 1)
            const treatInstancePoints = pointsMultiplier(Treat) * 1
            points += treatInstancePoints
            totalPoints += treatInstancePoints
            document.getElementById('points').innerHTML = points
            if (circle.radius + circleGrowthAmount <= maxCircleSize) {
                circle.changeCircleSize(circleGrowthAmount)
            }
            redrawCanvas()
        }
    }
}

function handleBigTreatsCollision(circle, bigTreats) {
    for (let i = 0; i < bigTreats.length; i++) {
        if (circle.checkOverlapWithShapeCenter(bigTreats[i])) {
            bigTreats.splice(i, 1)
            const bigTreatInstancePoints = pointsMultiplier(BigTreat) * 3
            points += bigTreatInstancePoints
            totalPoints += bigTreatInstancePoints
            document.getElementById('points').innerHTML = points
            if (circle.radius + circleGrowthAmount <= maxCircleSize) {
                circle.changeCircleSize(circleGrowthAmount)
            }
            redrawCanvas()
        }
    }

}

function handleMinesCollision(circle, mines) {
    for (let i = 0; i < mines.length; i++) {
        if (circle.checkOverlapWithMine(mines[i])) {
            mines.splice(i, 1)
            minesCounter++
            lives--
            document.getElementById('lives').innerHTML = lives
            points -= 2
            totalPoints -= 2
            document.getElementById('points').innerHTML = points
            if (circle.radius - circleShrinkageAmount >= 10) { 
                circle.changeCircleSize(-circleShrinkageAmount)
            }
            redrawCanvas()
        }
    }
}

function checkIfDrawStar(treats, bigTreats, star) {
    if (treats.length === 0 && bigTreats.length === 0) {
        star.draw(c) 
    }
}

let grid = new Map()
let circle = new Circle({x: canvasWidth / 2, y: canvasHeight / 2}, 50)

let mines = []

addCircleCoordinatesToGridMap(circle)

function generateMines() {
    for (let i = 0; i < startingNumMines; i++) {
        let mine = new Mine({x: getRandomInt(0, canvasWidth), y: getRandomInt(0, canvasHeight)}, 7.5, 12.5)
        ensureEntityIsInEmptyGridSquare(mine)
        mines.push(mine)
    }
}
generateMines()


let treats = []
function generateTreats() {
    for (let i = 0; i < startingNumTreats; i++) {
        let treat = new Treat({x: getRandomInt(0, canvasWidth), y: getRandomInt(0, canvasHeight)})
        ensureEntityIsInEmptyGridSquare(treat)
        treats.push(treat)
    }
}
generateTreats()

let bigTreats = []
function generateBigTreats() {
    for (let i = 0; i < startingNumBigTreats; i++) {
        let bigTreat = new BigTreat({x: getRandomInt(0, canvasWidth), y: getRandomInt(0, canvasHeight)})
        ensureEntityIsInEmptyGridSquare(bigTreat)
        bigTreats.push(bigTreat)
    }
}
generateBigTreats()

let star = new Star({x: getRandomInt(20, canvasWidth - 20), y: getRandomInt(20, canvasHeight - 20)}, 5, 20, 10)
ensureEntityIsInEmptyGridSquare(star)

function displayStats(winOrLoss) {
    c.reset()
    // can't rely on this function to calculate totals as displayStats() seems to be called multiple times
    modal.style.display = 'block'
    let message
    const nextLevelBtn = document.getElementById('nextLevelBtn')
    const retryLevelBtn = document.getElementById('retryBtn')
    const restartBtn = document.getElementById('restartBtn')
    pauseMinutes = minutesEl.innerHTML
    pauseSeconds = secondsEl.innerHTML
    if (winOrLoss === 'win') {
        message = 'Level completed!'
        nextLevelBtn.style.display = 'block'
        retryLevelBtn.style.display = 'none'
        restartBtn.style.display = 'none'
    } else {
        message = 'Game over... better luck next time'
        retryLevelBtn.style.display = 'block'
        restartBtn.style.display = 'block'
        nextLevelBtn.style.display = 'none'        
    }
    document.getElementById('message').innerHTML = message
    // document.getElementById('totalTime').innerHTML = 'Total time: ' + overallMinutes + ':' + overallSeconds
    document.getElementById('completionTime').innerHTML = 'Time: ' + minutesEl.innerHTML + ':' + secondsEl.innerHTML
    document.getElementById('completionLives').innerHTML = 'Lives: ' + lives
    // document.getElementById('total').innerHTML = 'Total: ' + totalPoints + ' points'
    document.getElementById('thisLevelPoints').innerHTML = 'This level: ' + points + ' points'
    const x3MultTreats = document.getElementById('x3MultiplierTreats')
    x3MultTreats.innerHTML = x3MultiplierTreatsCounter + ' treats: ' + x3MultiplierTreatsCounter*3 + ' points'
    const x3MultBigTreats = document.getElementById('x3MultiplierBigTreats')
    x3MultBigTreats.innerHTML = x3MultiplierBigTreatsCounter + ' big treats: ' + x3MultiplierBigTreatsCounter*3*3 + ' points'
    const x2MultTreats = document.getElementById('x2MultiplierTreats')
    x2MultTreats.innerHTML = x2MultiplierTreatsCounter + ' treats: ' + x2MultiplierTreatsCounter*2 + ' points'
    const x2MultBigTreats = document.getElementById('x2MultiplierBigTreats')
    x2MultBigTreats.innerHTML = x2MultiplierBigTreatsCounter + ' big treats: ' + x2MultiplierBigTreatsCounter*3*2 + ' points'
    const noMultTreats = document.getElementById('noMultiplierTreats')
    noMultTreats.innerHTML = noMultiplierTreatsCounter + ' treats: ' + noMultiplierTreatsCounter + ' points'
    const noMultBigTreats = document.getElementById('noMultiplierBigTreats')
    noMultBigTreats.innerHTML = noMultiplierBigTreatsCounter + ' big treats: ' + noMultiplierBigTreatsCounter*3 + ' points'
    const mines = document.getElementById('minesStatsWrapper')
    mines.innerHTML = minesCounter + ' mines triggered: ' + minesCounter*-2 + ' points'
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
})


function tick() {
    updateState()
    redrawCanvas()
    // checkWinOrLoss()
}

tick()

function updateState() {   //to be called each time the circle moves 
    handleTreatsCollision(circle, treats)
    handleBigTreatsCollision(circle, bigTreats)
    handleMinesCollision(circle, mines)
}

function redrawCanvas() {
    c.reset()
    // drawAxis()
    for (let mine of mines) {
        mine.draw(c)
    }
    for (let treat of treats) {
        treat.draw(c)
    }
    for (let bigTreat of bigTreats) {
        bigTreat.draw(c)
    }
    circle.draw(c)
    if (circle.radius > maxCircleSize) {
        circle.radius = maxCircleSize
    }
    if (circle.radius < minCircleSize) {
        circle.radius = minCircleSize
    }
    checkIfDrawStar(treats, bigTreats, star)
    checkWinAndDisplayMessage()
    checkLossAndDisplayMessage()
}

// function checkWinOrLoss() {
//     checkWinAndDisplayMessage()
//     checkLossAndDisplayMessage()
// }

function resetGameExceptCounters() {
    modal.style.display = 'none'
    treats = []
    mines = []
    bigTreats = []
    circle = new Circle({x: canvasWidth / 2, y: canvasHeight / 2}, 50)
    grid = new Map()
    generateMines()
    generateTreats()
    generateBigTreats()
    tick()
    gameStateInst = new GameState(false, false)
}

function resetCountersForLevel() {
    // overallMinutes = ''
    // overallSeconds = ''
    points = 0
    document.getElementById('points').innerHTML = points
    lives = 3
    document.getElementById('lives').innerHTML = lives

    x3MultiplierTreatsCounter = 0
    x3MultiplierBigTreatsCounter = 0
    x2MultiplierTreatsCounter = 0
    x2MultiplierBigTreatsCounter = 0
    noMultiplierTreatsCounter = 0
    noMultiplierBigTreatsCounter = 0
    minesCounter = 0
}

function resetAllCounters() {
    resetCountersForLevel()
    totalPoints = 0
    startingNumTreats = 10
    startingNumBigTreats = 2
    startingNumMines = 4
}

function resetGameForLevel() {
    resetCountersForLevel()
    resetGameExceptCounters()
}

function resetGameFully() {
    resetAllCounters()
    resetGameExceptCounters()
}

function createNextLevel() {
    modal.style.display = 'none'
    // minutesEl.innerHTML = pauseMinutes
    // secondsEl.innerHTML = pauseSeconds
    startTimer()
    startingNumTreats += 2
    startingNumBigTreats += 1
    startingNumMines += 2
    resetGameForLevel()
    lives = 3
}



// function drawAxis() {
//     c.beginPath()
//     c.moveTo(canvasWidth/2, 0)
//     c.lineTo(canvasWidth/2, canvasHeight)
//     c.stroke()

//     c.beginPath()
//     c.moveTo(0, canvasHeight/2)
//     c.lineTo(canvasWidth, canvasHeight/2)
//     c.stroke()
// }

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

const nextLevelBtn = document.getElementById('nextLevelBtn')
nextLevelBtn.addEventListener('click', function() {
    createNextLevel()
})

const retryLevelBtn = document.getElementById('retryBtn')
retryLevelBtn.addEventListener('click', function() {
    resetGameForLevel()
    redrawCanvas()
    startTimer()
    modal.style.display = 'none'
    totalPoints = 0
})

const restartBtn = document.getElementById('restartBtn')
restartBtn.addEventListener('click', function() {
    resetGameFully()
    redrawCanvas()
    startTimer()
    modal.style.display = 'none'
})

initialState()