const canvas = document.getElementById('mainCanvas')
let c = canvas.getContext('2d')

let circlePosition = {
    x: 0,
    y: 0
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

function drawTreats() {
    c.fillStyle = 'orange'
    c.fillRect()
}

drawAxis()
drawCircle()

window.addEventListener('keydown', function(event) {
    if (event.code == 'KeyD') {
        circlePosition.x += 50
    } else if (event.code == 'KeyA') {
        circlePosition.x -= 50
    } else if (event.code === 'KeyS') {
        circlePosition.y += 50
    } else if (event.code === 'KeyW') {
        circlePosition.y -= 50
    }
    drawCircle()
})


