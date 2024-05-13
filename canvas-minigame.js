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
    circle.fillStyle()
    c.fill()
    c.resetTransform()
}


let treats = []

function generateTreats() {
    for (let i = 0; i < 10; i++) {
        let treat = {
            position: {
                x: 0,
                y: 0
            },
            fillStyle: function () {
                return c.fillStyle = 'orange'
            }
        }
        treat.position.x = getRandomInt(986)
        treat.position.y = getRandomInt(736)
        treats.push(treat)
    }
}

function drawTreats() {
    for (let treat of treats) {
        treat.fillStyle()
        c.fillRect(treat.position.x, treat.position.y, 15, 15)
    }
}

drawAxis()
generateTreats()
drawCircle()
drawTreats()

window.addEventListener('keydown', function(event) {
    if (event.code == 'KeyD') {
        circle.position.x += 50
        drawCircle()
    } else if (event.code == 'KeyA') {
        circle.position.x -= 50
        drawCircle()
    } else if (event.code === 'KeyS') {
        circle.position.y += 50
        drawCircle()
    } else if (event.code === 'KeyW') {
        circle.position.y -= 50
        drawCircle()
    }

})


