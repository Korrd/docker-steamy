/**
 * Init and stuff
 */

const express = require('express');
const socketio = require('socket.io');
const spawn = require('child_process').spawn;

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const body = require('fs').readFileSync('./index.html', 'utf8');

var serviceName;
/**
 * Booting express app
 */

app.use(express.static('./static'));


app.get('/logs', function (req, res, next) {
  res.status(200).send('Error: no serviceId specified. Expecting "/logs/serviceId"');
});



app.get('/logs/:serviceId', function (req, res, next) {
	console.log('Endpoint "/logs" hit. Our serviceId is "' + req.params.serviceId + '"');

	var subDomain = req.headers.host.split('.');

	/**
	 * Validation of our address
	 */

	if (subDomain[1].toLowerCase().trim() != 'int')
	{
		console.log('unexpected input');
		console.log('subDomain[0]: ' + subDomain[0].toLowerCase().trim());
		console.log('subDomain[1]: ' + subDomain[1].toLowerCase().trim());

		//We are not on the testing rig, abort.
	}else{
		//internal, so our first word on the array must be the PR name.
		console.log('our service name is ' + req.params.serviceId)

		serviceName = subDomain[0].toString() + '_' + req.params.serviceId;
		console.log('Our docker service is ' + serviceName);
	}

  res.status(200).send(body);
});

console.log('Our service name is ' + serviceName);

const child = spawn('docker',['service', 'logs', '-f', '-t', serviceName]);

// We force our server to use ws only.
io.set('transports', ['websocket']);

io.on('connection', function(socket) {
	console.log('websocket connected');

	socket.emit('stdout', child.data.toString());
	socket.emit('stderr', child.data.toString());

});


server.listen(3000, () => console.log('server listening'));
