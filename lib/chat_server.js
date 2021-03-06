var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var nameUsed = [];
var currentRoom = {};

//define the chat server function 'listen'
exports.listen = function(server) {
    //start Socket.IO server,allowing it to piggyback on existing HTTP server
    io = socketio.listen(server);
    io.set('log level',1);

    io.sockets.on('connection',function(socket) {

    })
};

function assignGuestName(socket,guestNumber,nickNames,nameUsed) {
    var name = 'Guest ' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult',{
        success : true,
        name : name
    });
    nameUsed.push(name);
    return guestNumber+1;
}
