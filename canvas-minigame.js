const canvas = document.getElementById('mainCanvas')
let c = canvas.getContext('2d')

// class Entity {
//     constructor() {

//     }
// }

class Circle {
    constructor(position, radius) {
        this.position = { ...position }
        this.radius = radius
        // console.log(JSON.stringify(ob))
    }

    drawCircle() {
        c.beginPath()
        c.arc(0, 0, this.radius, 0, 2 * Math.PI)
        c.closePath()
        c.fillStyle = 'lightblue'
        c.fill()
    }

    checkOverlap(shapes) {
        for (let i = 0; i < shapes.length; i++) {
            if (c.isPointInPath(shapes[i].center.x, shapes[i].center.y)) {
                shapes.splice(i, 1)
                this.changeCircleSize(7.5)
            }
        }
    }

    changeCircleSize(delta) {
        this.radius += delta
    }
}

class Treat {
    constructor(position) {
        this.position = { ...position }
        this.size = {
            width: 15,
            height: 15
        }
        this.center =  {
            x: Math.ceil(this.position.x + this.size.width / 2),
            y: Math.ceil(this.position.y + this.size.height / 2)
        }
    }

    drawTreat() {
        c.fillStyle = 'orange'
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }

}

let treats = []

function generateTreats() {
    for (let i = 0; i < 10; i++) {
        let treat = new Treat({x: getRandomInt(986), y: getRandomInt(736)})
        treats.push(treat)
    }
}

generateTreats()

let circle = new Circle({x: 500, y: 375}, 50)
preDrawingCircle(circle)
circle.drawCircle()
postDrawingCircle()

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

function preDrawingCircle() {
    c.reset()
    drawAxis()
    for (let treat of treats) {
        treat.drawTreat()
    }
    c.translate(circle.position.x, circle.position.y)
}

function postDrawingCircle() {
    circle.checkOverlap(treats)
    c.resetTransform()
}

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

// function drawCircle() {
//     c.reset()
//     drawAxis()
//     drawTreats()
//     c.translate(circle.position.x, circle.position.y)
//     c.beginPath()
//     circle.arc()
//     c.closePath()
//     circle.fillStyle()
//     c.fill()
//     checkOverlap()
//     c.resetTransform()
// }

window.addEventListener('keydown', function(event) {
    if (event.code == 'KeyD' || event.code == 'ArrowRight') {
        circle.position.x += 50
    } else if (event.code == 'KeyA' || event.code == 'ArrowLeft') {
        circle.position.x -= 50
    } else if (event.code === 'KeyS' || event.code == 'ArrowDown') {
        circle.position.y += 50
    } else if (event.code === 'KeyW' || event.code == 'ArrowUp') {
        circle.position.y -= 50
    }
    preDrawingCircle(circle)
    circle.drawCircle()
    postDrawingCircle()
})


