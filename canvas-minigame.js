const canvas = document.getElementById('mainCanvas')
let c = canvas.getContext('2d')

const canvasX = 1000
const canvasY = 750

const gridSize = 25

let gameWon = false

// min is inclusive, max is exclusive
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function getRadians(degrees) {
    return degrees * Math.PI / 180
}

// class Entity {
//     constructor() {

//     }
// }

class Circle {
    constructor(center, radius) {
        this.center = { ...center }
        this.radius = radius
        // console.log(JSON.stringify(ob))
    }

    drawCircle() {
        c.beginPath()
        c.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI)
        c.closePath()
        c.fillStyle = 'lightblue'
        c.fill()
    }

    checkOverlapWithObjCenter(shapes) {
        for (let i = 0; i < shapes.length; i++) {
            let legA = shapes[i].center.x - this.center.x
            let legB = shapes[i].center.y - this.center.y
            if (legA ** 2 + legB ** 2 <= this.radius ** 2) {
                shapes.splice(i, 1)
                if (this.radius + 7.5 <= 150) {
                    this.changeCircleSize(7.5)
                }
                redrawCanvas()
                for (let shape of shapes) {
                    shape.drawTreat()
                }
            }
        }
        if (shapes.length === 0) {
            star.draw() 
        }
    }

    checkOverlapWithStar() {
        let legA = star.center.x - this.center.x
        let legB = star.center.y - this.center.y
        if (legA ** 2 + legB ** 2 <= this.radius ** 2) {
            gameWon = true
        }
        if (gameWon) {
            displayWinMessage()
        }
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
                    circle.drawMine()
                }
            }
        }
        checkLossCondition(circles)
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

    drawTreat() {
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

    drawMine() {
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
        
        let obliqueX = Math.cos(getRadians(45)) * this.arm
        let obliqueY = Math.sin(getRadians(45)) * this.arm
        
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

    draw(){
        drawStar(this.center, this.numSpikes, this.outerRadius, this.innerRadius)
    }
}




let grid = new Map
let circle = new Circle({x: canvasX / 2, y: canvasY / 2}, 50)

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
        let mine = new Mine({x: randomiseCanvasHalf(17.5, canvasX, circle.radius), y: randomiseCanvasHalf(50, canvasY, circle.radius)}, 7.5, 12.5)
        updateGridCoordinates(mine)
        console.log(mine.center)
        mines.push(mine)
    }
}
generateMines()


let treats = []
function generateTreats() {
    for (let i = 0; i < 10; i++) {
        let treat = new Treat({x: randomiseGridCanvasHalf(canvasX, gridSize, circle.radius), y: randomiseGridCanvasHalf(canvasY, gridSize, circle.radius)})
        updateGridCoordinates(treat)
        console.log(treat.center)
        treats.push(treat)
    }
}
generateTreats()

preDrawingCircle(treats, mines)
circle.drawCircle()
postDrawingCircle(treats, mines)

let star = new Star({x: getRandomInt(20, canvasX - 20), y: getRandomInt(20, canvasY - 20)}, 5, 20, 10)




function redrawCanvas() {
    c.reset()
    drawAxis()
    for (let mine of mines) {
        mine.drawMine()
    }
    for (let treat of treats) {
        treat.drawTreat()
    }
    circle.drawCircle()
    if (treats.length === 0 ) {
        star.draw()
    }
}

function displayWinMessage() {
    c.reset()
    c.font = '50px calibri'
    c.fillStyle = '#ADFF2F'
    c.fillText('You won :D', 385, 388)
}

function checkLossCondition(mines) {
    if (mines.length <= 1) {
        c.reset()
        c.font = '50px calibri'
        c.fillStyle = '#E52B50'
        c.fillText('Game over :(', 385, 388)       
    }
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
            entity.center.x = getRandomInt(0, canvasX - gridSize) + gridSize/2
            entity.center.y = getRandomInt(0, canvasY - gridSize) + gridSize/2
        } else if (entity instanceof Mine) {
            entity.center.x = getRandomInt(entity.arm, canvasX - entity.arm)
            entity.center.y = getRandomInt(entity.arm, canvasY - entity.arm)
        } else if (entity instanceof Star) {
            entity.center.x = getRandomInt(entity.outerRadius, canvasX - entity.outerRadius)
            entity.center.y = getRandomInt(entity.outerRadius, canvasY - entity.outerRadius)
        } else {
            entity.center.x = getRandomInt(entity.radius, canvasX - entity.radius)
            entity.center.y = getRandomInt(entity.radius, canvasY - entity.radius)
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
    for (let treat of treats) {
        treat.drawTreat()
    }
    // c.fillStyle = 'green'
    // let testTreat = new Treat({x: 12.5, y: 12.5})
    // let testTreat2 = new Treat({x: 12.5, y: 37.5})
    // let testTreat3 = new Treat({x: 37.5, y: 12.5})
    // let testTreat4 = new Treat({x: 12.5, y: 625})
    // testTreat.drawTreat()
    // testTreat2.drawTreat()
    // testTreat3.drawTreat()
    // testTreat4.drawTreat()

    for (let mine of mines) {
        mine.drawMine()
    }
}

function postDrawingCircle(treats, mines) {
    circle.checkOverlapWithObjCenter(treats)
    circle.checkOverlapWithCircle(mines)
    if (treats.length === 0) {
        circle.checkOverlapWithStar()
    }
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
    circle.drawCircle()
    postDrawingCircle(treats, mines)
})


function drawAxis() {
    c.beginPath()
    c.moveTo(500, 0)
    c.lineTo(500, 750)
    c.stroke()

    c.beginPath()
    c.moveTo(0, 375)
    c.lineTo(1000, 375)
    c.stroke()
}

// below is an adaptation of a utility function for drawing starts
function drawStar(center, spikes, outerRadius, innerRadius) {
    var rot=Math.PI/2*3;
    var x= center.x;
    var y= center.y;
    var step=Math.PI/  spikes;

    c.beginPath();
    c.moveTo( center.x, center.y- outerRadius)
    for(let i=0;i< spikes;i++){
      x= center.x+Math.cos(rot) * outerRadius;
      y= center.y+Math.sin(rot) * outerRadius;
      c.lineTo(x,y)
      rot+=step

      x= center.x+Math.cos(rot) * innerRadius;
      y= center.y+Math.sin(rot) * innerRadius;
      c.lineTo(x,y)
      rot+=step
    }
    c.lineTo( center.x, center.y- outerRadius);
    c.closePath();
    c.lineWidth=5;
    c.strokeStyle='#FFD700';
    c.stroke();
    c.fillStyle='#FFD700';
    c.fill();
}