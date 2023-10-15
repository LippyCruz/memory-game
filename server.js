const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

let connections = 0;

server.listen(3000, () => {
  console.log('listening on *:3000');
});



io.on("connection", (socket) => {


  if (connections < 2){ 

  console.log("Made socket connection", socket.id);

  for(let userCount =1; userCount < 2; userCount++){
    let p = {
      id: userCount,
      nome: `Jogador ${userCount}`,
      pontos: 0,
      turnos: 0
    }};
    

  connections++;
  } else{
    console.log("Too many connections");
    socket.disconnect();
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/public/404.html');
    });
  }

  



  socket.on("join", () => {
    
    
    if(users.isEmpty()){
      users.push(p);
      io.sockets.emit(p);
    }
    else if(users.length === 1){
      users.push(p);
      io.sockets.emit(p);
    }
    else{
      io.sockets.emit("full");
    }
    
    });
    
    
    socket.on("changeTurn", (player) => {
    if (user.map(jogador => jogador.id !== player.id)){
     jogador.turnos = 1;
    } else{
    user.map(jogador2 => jogador2.id === player.id)
    jogador2.turnos = 0;
    }
    
    });
    
    socket.on("checkTurn", (player) => {
    if (player.turnos === 1){
    io.sockets.emit("yes");
    }else{
    io.sockets.emit("no");
    }
    });
    
    
    socket.on("generate", (value) => {
    const parser = value
    io.sockets.emit(parser);
    });
    
    
    socket.on("result", () => {
    if(users.p1.pontos === users.p2.pontos){
    io.sockets.emit("draw");
    } else if(users.p1.pontos > users.p2.pontos){
    io.sockets.emit("winP1");
    }
    else{
    io.sockets.emit("winP2");
    }
    });
    
    
    
    socket.on("givePoints", (currentplayer) => {
    socket.broadcast.emit = (`Pontos para: ${currentplayer.nome}`);
    currentplayer.pontos++;
    });
    
    socket.on("pointsP1", () => {
      io.sockets.emit = (pontos in users(users.indexOf('Jogador 1')));
    
    });
    
    socket.on("pointsP2", () => {
    io.sockets.emit = (pontos in users(users.indexOf('Jogador 2')));
    
    });
    
   
    
    socket.on("flip", (data) => {
    users[data.id].pos = data.pos;
    
    io.sockets.emit("flip", data);
    });
    
    socket.on("check", () => {
    if(users.length === 2){
      io.sockets.emit("start");
      users(users.indexOf('Jogador 1')).turnos++;
    }
    else{
      io.sockets.emit("wait");
    }
    
    });
    
    socket.on("restart", () => {
    users = [];
    io.sockets.emit("restart");
    });
    
    












  
});

