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
      id: socket.id,
      nome: `Jogador ${userCount}`,
      pontos: 0,
      turnos: 0
    }};
    

  connections++;
  } else{
    console.log("Too many connections");
    socket.disconnect();
    
  }

  
   function currentPlayer(socket) {
    return p.find(player => player.id === socket.id)
  }

  function playerOne(socket) {
    return p.find(player => player.nome === 'Jogador 1')
  }

  function playerTwo(socket) {
    return p.find(player => player.nome === 'Jogador 2')
  }


  socket.on("join", () => {
    
    console.log(`${currentPlayer.nome} joined`);
    
    });
    
    
    socket.on("changeTurn", () => {
    if (currentPlayer(socket).turnos === 1){
     playerOne.turnos = 0;
    } else if(currentPlayer(socket).turnos === 0){
      playerTwo.turnos = 1;
    }
    
    
    
    });
    
    socket.on("checkTurn", (player) => {
    if (currentPlayer().turnos === 1){
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

