const canvas = document.getElementById('mainCanvas')
let c = canvas.getContext('2d')

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

function drawAxis() {
    c.beginPath()
    c.moveTo(500, 0)
    c.lineTo(500, 750)
    c.stroke()

    c.beginPath()
    c.moveTo(0, 375)
    c.lineTo(5000, 375)
    c.stroke()
}

let circle = {
    position: {
        x: 0,
        y: 0
    },
    arc: function() {
        return c.arc(500, 375, 50, 0, 2 * Math.PI)
    },
    fillStyle: function () {
        return c.fillStyle = 'lightblue'
    }
}

let circleTranslate = function () {
    return c.translate(circle.position.x, circle.position.y)
}

function drawCircle() {
    c.reset()
    drawAxis()
    drawTreats()
    c.beginPath()
    circleTranslate()
    circle.arc()
    c.closePath()
    checkOverlap()
    circle.fillStyle()
    c.fill()
    c.resetTransform()
}


let treats = []

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

drawAxis()
generateTreats()
drawCircle()

window.addEventListener('keydown', function(event) {
    if (event.code == 'KeyD') {
        circle.position.x += 50
    } else if (event.code == 'KeyA') {
        circle.position.x -= 50
    } else if (event.code === 'KeyS') {
        circle.position.y += 50
    } else if (event.code === 'KeyW') {
        circle.position.y -= 50
    }
    drawCircle()
})


