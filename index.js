const express = require('express');
const socketio = require('socket.io');
const spawn = require('child_process').spawn;

const env = process.env;
const services = env.SERVICES.split(/[\s\t]/);
const COMMAND = env.COMMAND.split(/[\s\t]/);

const colors = ['red', 'blue', 'green', 'pink'];
var cc = 0;
const serviceColors = {};
const listeners = services.map((servicename) => {
	serviceColors[servicename] = serviceColors[servicename] || colors[cc++];
	return {
		name: servicename,
		spawned: spawn(COMMAND[0], COMMAND.slice(1).concat([servicename]))
	}
});

console.log(serviceColors);

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const body = require('fs').readFileSync('./index.html', 'utf8');


//forces client to connect as websockets. If client tries xhr polling, it won't connect.

/**
 * Booting express app
 */

app.use(express.static('./static'));

app.get('/', function (req, res, next) {
  res.status(200).send(body);
});


io.set('transports', ['websocket']); 

io.on('connection', function(socket) {
	console.log('websocket connected');
	listeners.forEach((listener) => {
		listener.spawned.stdout.on('data', (data) => {
			socket.emit('stdout', {
			  servicename: listener.name,
			  color: serviceColors[listener.name],
			  data: data.toString()
			});
		});

		listener.spawned.stderr.on('data', (data) => {
			socket.emit('stderr', {
			  servicename: listener.name,
			  color: serviceColors[listener.name],
			  data: data.toString()
			});
		});
	})
});


server.listen(3000, () => console.log('server listening'));
