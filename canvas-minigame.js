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


let circlePosition = {
    x: 0,
    y: 0
}

function drawCircle() {
    c.reset()
    drawAxis()
    c.beginPath()
    c.translate(circlePosition.x, circlePosition.y)
    c.arc(500, 375, 50, 0, 2 * Math.PI)
    c.fillStyle = 'lightblue'
    c.fill()
    c.resetTransform()
}


let treats = []

function drawTreats() {
    let treatPosition = {
        x: 0,
        y: 0
    }
    for (let i = 0; i < 10; i++) {
        treatPosition.x = getRandomInt(986)
        treatPosition.y = getRandomInt(736)
        treats.push(treatPosition)
        c.fillStyle = 'orange'
        c.fillRect(treatPosition.x, treatPosition.y, 15, 15)
    }
}

drawAxis()
drawCircle()
drawTreats()

window.addEventListener('keydown', function(event) {
    if (event.code == 'KeyD') {
        circlePosition.x += 50
        drawCircle()
    } else if (event.code == 'KeyA') {
        circlePosition.x -= 50
        drawCircle()
    } else if (event.code === 'KeyS') {
        circlePosition.y += 50
        drawCircle()
    } else if (event.code === 'KeyW') {
        circlePosition.y -= 50
        drawCircle()
    }

})


