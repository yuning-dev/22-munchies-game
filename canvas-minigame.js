const canvas = document.getElementById('mainCanvas')
let c = canvas.getContext('2d')

// class Entity {
//     constructor() {

//     }
// }

class Circle {
    constructor(position) {
        this.position = { ...position }
        // console.log(JSON.stringify(ob))
    }

    // checkOverlap() {
    //     for (let i = 0; i < treats.length; i++) {
    //         if (c.isPointInPath(treats[i].center.x, treats[i].center.y)) {
    //             treats.splice(i, 1)
    //         }
    //     }
    // }

    drawCircle() {
        c.beginPath()
        c.arc(0, 0, 50, 0, 2 * Math.PI)
        c.closePath()
        c.fillStyle = 'lightblue'
        c.fill()
    }
}

let treats = []
generateTreats()

let circle = new Circle({x: 500, y: 375})
preDrawingCircle(circle)
circle.drawCircle()
postDrawingCircle()

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

function preDrawingCircle() {
    c.reset()
    drawAxis()
    drawTreats()
    c.translate(circle.position.x, circle.position.y)
}

function postDrawingCircle() {
    checkOverlap()
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

// let circle = {
//     position: {
//         x: 500,
//         y: 375
//     },
//     arc() {
//         return c.arc(0, 0, 50, 0, 2 * Math.PI)
//     },
//     fillStyle() {
//         return c.fillStyle = 'lightblue'
//     },
// }

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

// function drawCircle() {
//     preDrawingCircle()
//     c.beginPath()
//     c.arc(0, 0, 50, 0, 2 * Math.PI)
//     c.closePath()
//     c.fillStyle = 'lightblue'
//     c.fill()
//     postDrawingCircle()
// }


function generateTreats() {
    for (let i = 0; i < 10; i++) {
        let x = getRandomInt(986)
        let y = getRandomInt(736)
        let width = 15
        let height = 15
        let treat = {
            position: {
                x: x,
                y: y
            },
            fillStyle: function () {
                return c.fillStyle = 'orange'
            },
            size: {
                width: 15,
                height: 15
            },
            center: {
                x: Math.ceil(x + width / 2),
                y: Math.ceil(y + height / 2)
            }
        }
        treats.push(treat)
    }
}

function drawTreats() {
    for (let treat of treats) {
        treat.fillStyle()
        c.fillRect(treat.position.x, treat.position.y, treat.size.width, treat.size.height)
    }
}

function checkOverlap() {
    for (let i = 0; i < treats.length; i++) {
        if (c.isPointInPath(treats[i].center.x, treats[i].center.y)) {
            treats.splice(i, 1)
        }
    }
}

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


