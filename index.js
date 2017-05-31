
var http = require("http");
var fs = require("fs");
var users = [];

// Include socket.io which was installed via npm. It is NOT part pf core
var socketio = require("socket.io");

var server = http.createServer((req,res)=>{
	console.log("someone connected via HTTP.");
	if (req.url == '/'){
		fs.readFile('index.html', 'utf-8', (error,data)=>{
			var cssFile = '';
			// console.log(error);
			// console.log(data);
			if (error){
				res.writeHead(500, {'content-type':'text/html'});
				res.end('Internal Server Error');
			}else{
				res.writeHead(200,{'content-type':'text/html'});
				res.end(data);
			}
		});	
	}else if (req.url == '/styles.css'){
		fs.readFile('styles.css', 'utf-8', (error,data)=>{
			var cssFile = '';
			// console.log(error);
			// console.log(data);
			if (error){
				res.writeHead(500, {'content-type':'text/html'});
				res.end('Internal Server Error');
			}else{
				res.writeHead(200,{'content-type':'text/css'});
				res.end(data);
			}
		});	
	}else if(req.url == '/config.js'){
		fs.readFile('config.js', 'utf-8', (error,data)=>{
			// console.log(error);
			// console.log(data);
			if (error){
				res.writeHead(500, {'content-type':'text/html'});
				res.end('Internal Server Error');
			}else{
				res.writeHead(200,{'content-type':'application/javascript'});
				res.end(data);
			}
		});
	}
});

var io = socketio.listen(server);
var users = [];
// Handle socket connection
io.sockets.on('connect',(socket)=>{
	console.log("Someone connected via socket");

	socket.on('newClientInfo',(data)=>{
		var clientInfo = new Object();
		clientInfo.name = data;
		clientInfo.clientId = socket.id;
		console.log(clientInfo);
		users.push(clientInfo);
		// console.log(`${name} just jonied`);
		io.sockets.emit('newUser',users);
	});

	socket.on('sendMessage',()=>{
		console.log('someone clicked the button')
	})

	socket.on('messageToServer',(messageObj)=>{
		io.sockets.emit('messageToClient', messageObj);
	});

	socket.on('disconnect',(data)=>{
		console.log('someone logged off');
		console.log(users);
		for (let i = 0; i < users.length; i++){
			var currentUser = users[i];
			console.log(currentUser.clientId);
			console.log(socket.id);
			if (currentUser.clientId == socket.id){
				users.splice(i,1);
				break;
			}
		}
		io.sockets.emit('userDisconnect',users);
	});
});






server.listen(8080);
console.log('Listening on port 8080');

