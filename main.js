'use strict'
console.log('Hello, World!')
let canvas = document.querySelector('canvas')
canvas.width = innerWidth
canvas.height = innerHeight
let mouseDown = false
let circleCoords = []
function test(n) {
    yVelocity += n
}
let mouseCoords = [0, 0]
let movable = true
let playing = true
addEventListener('mousedown', ev => {
    mouseCoords = [ev.x, ev.y]
    if (mouseDown || !movable) return
    mouseDown = true
    circleCoords = [ev.x, ev.y]
})
addEventListener('mouseup', ev => {
    mouseDown = false
    if (circleCoords.length !== 2) return
    if (playing) movable = false
    xVelocity += ev.x - circleCoords[0]
    yVelocity += circleCoords[1] - ev.y
    circleCoords = []
})
addEventListener('mousemove', ev => {
    mouseCoords = [ev.x, ev.y]
})
let ctx = canvas.getContext('2d')
let x = canvas.width / 2
let y = canvas.height - 10
let friction = Math.E
let xVelocity = 0
let yVelocity = 0
let doMain = true
let prevXVel = 0
let prevYVel = 0
let points = 0
let lines = [
    [60, 40, 3],
    [160, 30, 5],
    [250, 35, 4],
    [345, 45, 2],
    [450, 50, 1]
]
let bounce = false
{
    function makeLine(y = 0, h = 0, pts = 3) {
        ctx.beginPath()
        ctx.rect(-1, y, canvas.width+2, h)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.beginPath()
        ctx.strokeText(`${pts} points`, 10, y + h / 2 + 5)
        ctx.closePath()
    }
    let _ms = 0
    function main(ms) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
        ctx.fillStyle = 'burlywood'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.closePath()
        if (!movable) circleCoords = []
        ctx.fillStyle = 'red'
        ctx.strokeStyle = 'blue'
        ctx.font = '20px Arial'
        lines.forEach(elem => makeLine(...elem))
        ctx.beginPath()
        ctx.fillStyle = 'gray'
        ctx.ellipse(x, y, 10, 10, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        if (circleCoords.length > 0 && mouseCoords.length > 0) {
            ctx.fillStyle = 'blue'
            ctx.beginPath()
            ctx.moveTo(...circleCoords)
            ctx.lineTo(...mouseCoords)
            ctx.stroke()
            ctx.closePath()
            ctx.beginPath()
            ctx.ellipse(circleCoords[0], circleCoords[1], 5, 5, 0, 0, 2 * Math.PI)
            ctx.fill()
            ctx.closePath()
        }
        ctx.fillStyle = 'black'
        ctx.font = '100px Arial'
        ctx.beginPath()
        ctx.fillText(points, canvas.width - 60 * points.toString().length, 80)
        ctx.closePath()
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.ellipse(mouseCoords[0], mouseCoords[1], 5, 5, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        let _xVel = (1 - friction / 1000 * (ms - _ms)) * xVelocity
        let _yVel = (1 - friction / 1000 * (ms - _ms)) * yVelocity
        if (-Math.sign(xVelocity) === Math.abs(_xVel)) xVelocity = 0
        else xVelocity = _xVel
        if (-Math.sign(yVelocity) === Math.abs(_yVel)) yVelocity = 0
        else yVelocity = _yVel
        x += xVelocity / 100  * (ms - _ms)
        y -= yVelocity / 100  * (ms - _ms)
        _ms = ms
        if (!movable && playing && (x < -10 || x > canvas.width + 10 || y < -10 || y > canvas.height + 10) && !bounce) {
            xVelocity = 0
            yVelocity = 0
            x = canvas.width / 2
            y = canvas.height - 10
            movable = true
        }
        if (!movable && playing && parseFloat(xVelocity.toFixed(2)) === 0 && parseFloat(yVelocity.toFixed(2)) === 0) {
            let upper = y - 10
            let lower = y + 10
            lines.forEach(([y, h, p]) => {
                if (upper < y) return
                if (lower > y + h) return
                points += p
            })
            xVelocity = 0
            yVelocity = 0
            x = canvas.width / 2
            y = canvas.height - 10
            movable = true
        }
        if (!movable && (x < 10 || x > canvas.width - 10) && bounce) {
            xVelocity *= -1
            x = Math.min(canvas.width - 10, Math.max(10, x))
        }
        if (!movable && (y < 10 || y > canvas.height - 10) && bounce) {
            yVelocity *= -1
            y = Math.min(canvas.height - 10, Math.max(10, y))
        }
        if (doMain) requestAnimationFrame(main)
    }
    if (doMain) requestAnimationFrame(main)
}
