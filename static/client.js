var $main = $('#main');

var socket = io({ transports: ['websocket'], upgrade: false });

/* Put this inside something more accute */
const header = $('.header'),
	  main   = $('#main'),
	  fixup  = 50;

const headerHeight = header.height();
main.height(window.innerHeight - (headerHeight + fixup));
/* ##### */

socket.on('params', function (serviceId){
	console.log('[CLIENT] params triggered');
	const pr_name = window.location.hostname.split('.')
	const service = window.location.pathname.split('/')

	document.getElementById('srv_name').innerHTML = service[service.length - 1];
	document.getElementById('pr_name').innerHTML = pr_name[0];

	console.log('[CLIENT] PR name is ' + pr_name[0]);
	console.log('[CLIENT] service name is ' + service[service.length - 1]);

	socket.emit('params', pr_name[0].toString() + '_' + service[service.length - 1]);
});

socket.on('stdout', function (logText) {
  console.log('[CLIENT STDOUT] Appending to viewport: ' + logText)

  $main.append(logText);

});

socket.on('stderr', function (logText) {
  console.log('[CLIENT STDERR] Appending to viewport: ' + logText)

  $main.append(logText);

});
