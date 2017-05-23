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

/**
 * Booting express app
 */

app.use(express.static('./static'));


app.get('/logs', function (req, res, next) {
  const msg = 'Error: no serviceId specified. Expecting "/logs/serviceId"';

  console.log('[SERVER] ' + msg);
  res.status(200).send(msg);
});

app.get('/logs/:serviceId', function (req, res, next) {
	var subDomain = req.headers.host.split('.');
	if (subDomain.length <= 1)
	{
	    const msg = 'Unexpected input. No subdomain here';
		console.log('[SERVER] ' + msg);
		res.status(200).send(msg);
	}else{
		console.log('[SERVER] Endpoint "/logs" hit. Our serviceId is "' + req.params.serviceId + '"');
		console.log('[SERVER] Our PR service name is "' + subDomain[0].toString() + '"');
		console.log('[SERVER] Our swarm service name is ' + subDomain[0].toString() + '_' + req.params.serviceId + '"');
		res.status(200).send(body);
	}
});


// We force our server to use ws only.
io.set('transports', ['websocket']);

io.on('connection', function(socket) {
	console.log('[SERVER] websocket connected');

	socket.emit('params');

	socket.on('disconnect', function () {

		//cleanup
		socket.logprocess.kill();

	});

	socket.on('params', function (value) {
		console.log('[SERVER] Executing command with swarm service name ' + value);
		 var child = spawn('docker', ['service', 'logs', '-f', '-t', value]);

		 socket.logprocess = child;

		 child.stdout.on('data', (e) => {
		 	socket.emit('stdout', e.toString());
		 });

		 child.stdout.on('end', (a) => {
		 	console.log('end', a)
		 });

		 child.stdout.on('error', (e) => console.log('error', e));
		 child.on('error', (e) => console.log('error', e));
		 child.on('exit', (e) => console.log('exit', e));
		 child.on('end', (e) => console.log('end', e));

		});
});

server.listen(3000, () => console.log('[SERVER] listening'));
