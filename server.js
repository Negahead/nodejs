var http = require('http');
//fs module provides fileSystem-related functionality
var fs = require('fs');
//path module provides filesystem path-related functionality
var path = require('path');
//provides ability to derive a mime type based on a filename extension
var mime = require('mime');
//cache object is where the contents of cached files are stored
var cache = {};

//helper function to handle the 404 errors
function send404(response) {
    response.writeHead(404,{'Content-type':'text/plain'});
    response.write('Error 404: resource not found');
    response.end();
}

//helper function to serve the file data
function sendFile(response,filePath,fileContents) {
    response.writeHead(200,{'content-type':mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

//serve static files
function serveStatic(response,cache,absPath) {
    // if is cached
    if(cache[absPath]) {
        sendFile(response,absPath,cache[absPath]);
    } else {
        fs.exists(absPath,function(exists) { // check file existence
            if(exists) {
                fs.readFile(absPath,function(err,data) { // file exists,read file
                    if(err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response,absPath,data);
                    }
                });
            } else {
                send404(response); // file not exist,send 404
            }
        });
    }
}

//create the http server
var server = http.createServer(function(request,response) {
    var filePath = false;

    if(request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    serveStatic(response,cache,absPath);
});

server.listen(3000,function() {
    console.log("server listening on port 3000");
});


//loads functionality from a custom Node module that supplies logic to handle Socket.IO
//based server-side chat functionality
var chatServer = require('./lib/chat_server');
chatServer.listen(server);