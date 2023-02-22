const print = document.getElementById('print')

const road = document.getElementById('road')
const cars = document.getElementById('cars')

const roadLength = document.getElementById('length')
const roadWidth = document.getElementById('width')
const laneCount = document.getElementById('count')
const submit = document.getElementById('submit')

const connect = document.getElementById('connect')
const disconnect = document.getElementById('disconnect')

class Car {
	constructor(id, x, y, width, length, color, ctx) {
		this.id = id
		this.x = x
		this.y = y
		this.width = width
		this.length = length
		this.color = color
		this.ctx = ctx
	}
	draw(x, y) {
		this.ctx.clearRect(this.x, this.y, this.width, this.length)
		this.ctx.fillStyle = this.color
		this.ctx.fillRect(x, y, this.width, this.length)
		this.x = x
		this.y = y
	}
}

submit.onclick = () => {
	connect.disabled = false
	if (roadLength.value && roadWidth.value && laneCount.value) {
		print.style.width = road.width = cars.width = roadWidth.value
		print.style.height = road.height = cars.height = roadLength.value
		const ctx = road.getContext('2d')
		ctx.setLineDash([10, 5])
		for (let i = 1; i < +laneCount.value; i++) {
			ctx.lineWidth = '2'
			ctx.beginPath()
			ctx.moveTo(i * (road.width / +laneCount.value), 0)
			ctx.lineTo(i * (road.width / +laneCount.value), road.height)
			ctx.stroke()
			ctx.fill()
		}
		road.style.border = '3px solid #000'
	}
}

connect.onclick = () => {
	connect.disabled = true
	disconnect.disabled = false
	const ws = new WebSocket('ws://localhost:8080')

	ws.addEventListener('open', () => {
		console.log('we are connected')
		ws.send('client has been connected')
	})

	let objs = []

	ws.addEventListener('message', (event) => {
		const { id, x, y, length, width } = JSON.parse(event.data)
		if (!objs.find((obj) => obj.id === id)) {
			const newCtx = cars.getContext('2d')
			const newColor = `rgb(${random(255)}, ${random(255)}, ${random(255)})`
			const car = new Car(id, x, y, width, length, newColor, newCtx)
			newCtx.fillStyle = newColor
			newCtx.fillRect(x, y, width, length)
			objs.push(car)
			console.log(car)
		} else {
			let obj = objs.find((obj) => obj.id === id)
			obj.draw(x, y)
		}
	})

	disconnect.onclick = () => {
		ws.close()
		connect.disabled = false
		disconnect.disabled = true
	}
}

function random(maxLimit = 100) {
	let rand = Math.random() * maxLimit
	return Math.floor(rand)
}
