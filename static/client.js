var $main = $('#main');
var $pr_name = $('#pr_name');

var socket = io({ transports: ['websocket'], upgrade: false });

// Whenever the server emits 'data', update the logs

// document.getElementById('pr_name').innerHTML = unValor;

socket.on('params', function (serviceId){
	console.log('[CLIENT] params triggered');
	const pr_name = window.location.hostname.split('.')
	const service = window.location.pathname.split('/')

	console.log('[CLIENT] PR name is ' + pr_name[0]);
	console.log('[CLIENT] service name is ' + service[service.length - 1].toString());

	socket.emit('params', pr_name[0].toString() + '_' + service[service.length - 1].toString());
});

socket.on('stdout', function (logText) {
  console.log('[CLIENT STDOUT] Appending to viewport: ' + logText)
  $main.append(logText);
});

socket.on('stderr', function (logText) {
  console.log('[CLIENT STDERR] Appending to viewport: ' + logText)
  $main.append(logText);
});



//window.location.hostname
//window.location.pathname
