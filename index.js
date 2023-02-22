const ws = new WebSocket('ws://localhost:8080')

ws.addEventListener('open', () => {
	console.log('we are connected')
	ws.send('client has been connected')
})

const road = document.getElementById('road')
const ctx = road.getContext('2d')

const w = '500'
const h = '500'

road.width = w
road.height = h

let objs = []

ws.addEventListener('message', (event) => {
	console.log(JSON.parse(event.data))
	const { id, x, y, length, width } = JSON.parse(event.data)
	if (!objs.find((obj) => obj.id === id)) {
		const obj = { id, x, y, length, width, ctx }
		obj.ctx = road.getContext('2d')
		obj.ctx.fillStyle = `rgb(${random(255)}, ${random(255)}, ${random(255)})`
		obj.ctx.fillRect(x, y, width, length)
		objs.push(obj)
	} else {
		const obj = objs.find((obj) => obj.id === id)
		obj.ctx.clearRect(obj.x, obj.y, obj.width, obj.length)
		obj.x = x
		obj.y = y
		obj.width = width
		obj.length = length
		ctx.fillRect(x, y, width, length)
	}
})

function random(maxLimit = 100) {
	let rand = Math.random() * maxLimit
	return Math.floor(rand)
}
