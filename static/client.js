var $main = $('#main');

var socket = io({ transports: ['websocket'], upgrade: false });

// Whenever the server emits 'data', update the logs
socket.on('stdout', function (logObject) {
  $main.append('<code style="color:' + logObject.color + '">[' + logObject.servicename + '] ' + logObject.data + '</code>');
});

socket.on('stderr', function (logObject) {
  $main.append('<code style="color:' + logObject.color + '">[' + logObject.servicename + '] ' + logObject.data + '</code>');
});
