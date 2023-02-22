const ws = require('ws')

const wsServer = new ws.Server({ port: 8080 })

wsServer.on('connection', (socket) => {
	console.log('new connection')
	for (let i = 1; i > 0; i++) {
		if (i === 31) {
			i = 1
		}
		socket.send(
			JSON.stringify({
				id: 1,
				x: 30,
				y: i * 10,
				width: 10,
				length: 20,
			})
		)
		socket.send(
			JSON.stringify({
				id: 2,
				x: 140,
				y: 5 * i,
				width: 30,
				length: 50,
			})
		)
		// socket.send(i * 10)
		sleepFor(50)
	}

	socket.on('message', (data) => console.log(`data: ${data}`))

	socket.on('close', () => console.log('client disconnected'))

	socket.on('error', () => console.log('some error'))
})

function sleepFor(sleepDuration) {
	var now = new Date().getTime()
	while (new Date().getTime() < now + sleepDuration) {
		/* Do nothing */
	}
}
