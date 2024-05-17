const canvas = document.getElementById('mainCanvas')
let c = canvas.getContext('2d')

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
        c.arc(0, 0, this.radius, 0, 2 * Math.PI)
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
            }
        }
    }

    checkOverlapWithCircle(circles) {
        for (let i = 0; i < circles.length; i++) {
            let legA = circles[i].center.x - this.center.x
            let legB = circles[i].center.y - this.center.y
            if (legA ** 2 + legB ** 2 <= (this.radius + circles[i].arm) ** 2) {
                circles.splice(i, 1)
                if (this.radius -20 >= 10) { 
                    this.changeCircleSize(-20)
                }
            }
        }
        if (circles.length <= 1) {
            c.reset()
            c.font = '50px calibri'
            c.fillStyle = '#E52B50'
            c.fillText('Game over :(', 385, 388)       
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



let mines = []

function generateMines() {
    for (let i = 0; i < 4; i++) {
        let mine = new Mine({x: getRandomInt(30, 970), y: getRandomInt(30, 720)}, 10, 15)
        mines.push(mine)
    }
}

generateMines()
console.log(mines)


let treats = []

function generateTreats() {
    for (let i = 0; i < 10; i++) {
        let treat = new Treat({x: getRandomInt(0, 1000 - 15), y: getRandomInt(0, 750 - 15)})
        treats.push(treat)
    }
}

generateTreats()
console.log(treats)

let circle = new Circle({x: 500, y: 375}, 50)
preDrawingCircle(circle)
circle.drawCircle()
postDrawingCircle()

function preDrawingCircle() {
    c.reset()
    drawAxis()
    for (let treat of treats) {
        treat.drawTreat()
    }
    for (let mine of mines) {
        mine.drawMine()
    }
    c.translate(circle.center.x, circle.center.y)
}

function postDrawingCircle() {
    circle.checkOverlapWithObjCenter(treats)
    circle.checkOverlapWithCircle(mines)

    // circle.checkOverlap(mines)
    // c.resetTransform()
    // console.log(treats)
    // for (let treat of treats) {
    //     treat.drawTreat()
    // }
    // console.log(treats)
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

function redrawCanvas() {
    c.reset()

}

// function drawCircle() {
//     c.reset()
//     drawAxis()
//     drawTreats()
//     c.translate(circle.center.x, circle.center.y)
//     c.beginPath()
//     circle.arc()
//     c.closePath()
//     circle.fillStyle()
//     c.fill()
//     checkOverlap()
//     c.resetTransform()
// }

window.addEventListener('keydown', function(event) {
    let stepDistance = 25
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
    preDrawingCircle(circle)
    circle.drawCircle()
    postDrawingCircle()
})

// function drawStar(cx,cy,spikes,outerRadius,innerRadius){
//     var rot=Math.PI/2*3;
//     var x=cx;
//     var y=cy;
//     var step=Math.PI/spikes;

//     c.beginPath();
//     c.moveTo(cx,cy-outerRadius)
//     for(i=0;i<spikes;i++){
//       x=cx+Math.cos(rot)*outerRadius;
//       y=cy+Math.sin(rot)*outerRadius;
//       c.lineTo(x,y)
//       rot+=step

//       x=cx+Math.cos(rot)*innerRadius;
//       y=cy+Math.sin(rot)*innerRadius;
//       c.lineTo(x,y)
//       rot+=step
//     }
//     c.lineTo(cx,cy-outerRadius);
//     c.closePath();
//     c.lineWidth=5;
//     c.strokeStyle='#FAFA33';
//     c.stroke();
//     c.fillStyle='#FAFA33';
//     c.fill();
//   }

//   drawStar(500,375,5,20,10);

