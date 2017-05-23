var $main = $('#main');

var socket = io({ transports: ['websocket'], upgrade: false });

// Whenever the server emits 'data', update the logs
socket.on('stdout', function (logText) {
  $main.append(logText);
});

socket.on('stderr', function (logText) {
  $main.append(logText);
});
