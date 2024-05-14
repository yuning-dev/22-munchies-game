const canvas = document.getElementById('mainCanvas')
let c = canvas.getContext('2d')

c.fillStyle = 'lightblue'
c.fillRect(200, 200, 100, 100)

c.moveTo(0, 0)
c.lineTo(1000, 750)
c.stroke()

c.beginPath()
c.arc(500, 375, 50, 0, 2 * Math.PI)
c.fillStyle = 'pink'
c.fill()

c.beginPath()
c.moveTo(500, 375)
c.lineTo(750, 562.5)
c.lineTo(250, 562.5)
c.strokeStyle = 'purple'
c.lineWidth = 5
c.closePath()
console.log(c.isPointInPath(500, 750))
console.log(c.isPointInPath(500, 375))
c.stroke()

c.fillStyle = 'lightgreen'
for(let i = 0; i < 4; i++) {
    c.translate(100, 0)
    c.fillRect(100, 100, 50, 200)
}

c.strokeStyle = 'crimson'
c.lineWidth = 3
c.translate(-200, 500)
let rads = 200 * 2 * Math.PI / 360
c.rotate(rads)
c.strokeRect(0, 0, 150, 150)

