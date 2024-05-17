const canvas = document.getElementById('mainCanvas')
let c = canvas.getContext('2d')

// c.fillStyle = 'lightblue'
// c.fillRect(200, 200, 100, 100)

// c.moveTo(0, 0)
// c.lineTo(1000, 750)
// c.stroke()

// c.beginPath()
// c.arc(500, 375, 50, 0, 2 * Math.PI)
// c.fillStyle = 'pink'
// c.fill()

// c.beginPath()
// c.moveTo(500, 375)
// c.lineTo(750, 562.5)
// c.lineTo(250, 562.5)
// c.strokeStyle = 'purple'
// c.lineWidth = 5
// c.closePath()
// console.log(c.isPointInPath(500, 750))
// console.log(c.isPointInPath(500, 375))
// c.stroke()

// c.fillStyle = 'lightgreen'
// for(let i = 0; i < 4; i++) {
//     c.translate(100, 0)
//     c.fillRect(100, 100, 50, 200)
// }

// c.strokeStyle = 'crimson'
// c.lineWidth = 3
// c.translate(-200, 500)
// let rads = 200 * 2 * Math.PI / 360
// c.rotate(rads)
// c.strokeRect(0, 0, 150, 150)


// Mine prototype below :)
function getRadians(degrees) {
    return degrees * Math.PI / 180
}


// let x = 500
// let y = 375
// let r = 15
// let arm = r + 7.5

// function drawMine(x, y, r, arm) {
//     c.beginPath()
//     c.arc(x, y, r, 0, 2 * Math.PI)
//     c.fillStyle = 'salmon'
//     c.fill()
    
//     c.strokeStyle = 'salmon'
//     c.lineWidth = 2
    
//     c.moveTo(x - arm, y)
//     c.lineTo(x + arm, y)
//     c.stroke()
    
//     c.moveTo(x, y - arm)
//     c.lineTo(x, y + arm)
//     c.stroke()
    
//     let obliqueX = Math.cos(getRadians(45)) * arm
//     let obliqueY = Math.sin(getRadians(45)) * arm
    
//     console.log(obliqueX)
//     console.log(obliqueY)
    
//     c.moveTo(x + obliqueX, y - obliqueY)
//     c.lineTo(x - obliqueX, y + obliqueY)
//     c.stroke()
    
//     c.moveTo(x - obliqueX, y - obliqueY)
//     c.lineTo(x + obliqueX, y + obliqueY)
//     c.stroke()
//     c.closePath()    
// }


// drawMine(500, 375, 15, 22.5)
// drawMine(400, 300, 15, 22.5)
// drawMine(900, 300, 15, 22.5)
// drawMine(900, 700, 15, 22.5)

// function getRandomInt(max) {
//     return Math.floor(Math.random() * max)
// }

// class Treat {
//     constructor(position) {
//         this.position = { ...position }
//         this.size = {
//             width: 15,
//             height: 15
//         }
//         this.center =  {
//             x: Math.ceil(this.position.x + this.size.width / 2),
//             y: Math.ceil(this.position.y + this.size.height / 2)
//         }
//     }

//     drawTreat() {
//         c.fillStyle = 'orange'
//         c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
//     }

// }

// let treats = []

// function generateTreats() {
//     for (let i = 0; i < 10; i++) {
//         let treat = new Treat({x: getRandomInt(986), y: getRandomInt(736)})
//         treats.push(treat)
//     }
// }

// generateTreats()

// console.log(treats)

// for (let treat of treats) {
//     treat.drawTreat()
// }

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

drawAxis()

c.font = '50px calibri'
c.fillStyle = '#E52B50'
c.fillText('Game over', 385, 388)    



// function to draw a star

function drawStar(cx,cy,spikes,outerRadius,innerRadius){
    var rot=Math.PI/2*3;
    var x=cx;
    var y=cy;
    var step=Math.PI/spikes;

    c.beginPath();
    c.moveTo(cx,cy-outerRadius)
    for(i=0;i<spikes;i++){
      x=cx+Math.cos(rot)*outerRadius;
      y=cy+Math.sin(rot)*outerRadius;
      c.lineTo(x,y)
      rot+=step

      x=cx+Math.cos(rot)*innerRadius;
      y=cy+Math.sin(rot)*innerRadius;
      c.lineTo(x,y)
      rot+=step
    }
    c.lineTo(cx,cy-outerRadius);
    c.closePath();
    c.lineWidth=5;
    c.strokeStyle='#FAFA33';
    c.stroke();
    c.fillStyle='#FAFA33';
    c.fill();
  }

  drawStar(100,100,5,20,10);