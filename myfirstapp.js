    var http = require("http");
    var url = require('url');
    var fs = require('fs');
    var io = require('socket.io');
    var os = require("os");
    var hostname = os.hostname();

    var server = http.createServer(function(request, response){
        var path = url.parse(request.url).pathname;

        switch(path){
            case '/':
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write('<p>Hello World ! I\'m container '+hostname+' and ready to serve you. :)</p><p>Test this link: <a href="socket.html">Socket.IO</a></p>');
                response.end();
                break;
            case '/socket.html':
                fs.readFile(__dirname + path, function(error, data){
                    if (error){
                        response.writeHead(404);
                        response.write("opps this doesn't exist - 404");
                        response.end();
                    }
                    else{
                        response.writeHead(200, {"Content-Type": "text/html"});
                        response.write(data, "utf8");
                        response.end();
                    }
                });
                break;
            default:
                response.writeHead(404);
                response.write("opps this doesn't exist - 404");
                response.end();
                break;
        }
    });

    server.listen(8001);

    var listener = io.listen(server);
    listener.sockets.on('connection', function(socket){
      socket.emit('date', {'date': new Date()});
      socket.emit('hostname', {'hostname': os.hostname()});
      var loadaverage = os.loadavg();
      socket.emit('resources', {'resources': 'Arch: '+os.arch()+', Release: '+os.release()+' Uptime: '+os.uptime()+' Load Average: '+loadaverage[0]+','+ loadaverage[1]+','+loadaverage[2]+' FreeMEM: '+os.freemem()+''});
      setInterval(function(){
      socket.emit('date', {'date': new Date()});}, 1000);
      setInterval(function(){
      socket.emit('hostname', {'hostname': os.hostname()});}, 60000);
      setInterval(function(){
      var loadaverage = os.loadavg();
      socket.emit('resources', {'resources': 'Arch: '+os.arch()+', Release: '+os.release()+' Uptime: '+os.uptime()+' Load Average: '+loadaverage[0]+','+ loadaverage[1]+','+loadaverage[2]+' FreeMEM: '+os.freemem()+''});}, 1000);
      socket.on('client_data', function(data){
        process.stdout.write(data.letter);
      });
    });
