// declarations
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  maxHttpBufferSize: 1e7 // permite enviar dados de até 10mb
});

app.use(express.static("public"));

server.listen(3000, () => {
  console.log('listening on *:3000');
});

let count = 0;

const users = [];


// game logic functions

const shuffle = array => { // embaralha as cartas
  const clonedArray = [...array]

  for (let index = clonedArray.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
      const original = clonedArray[index]

      clonedArray[index] = clonedArray[randomIndex]
      clonedArray[randomIndex] = original
  }

  return clonedArray
}

const pickRandom = (array, items) => { // pega as cartas aleatoriamente
  const clonedArray = [...array]
  const randomPicks = []

  for (let index = 0; index < items; index++) {
      const randomIndex = Math.floor(Math.random() * clonedArray.length)
      
      randomPicks.push(clonedArray[randomIndex])
      clonedArray.splice(randomIndex, 1)
  }

  return randomPicks
}

const generateGame = (dimensions) => { // gera o novo tabuleiro do jogo
    
  if (dimensions % 2 !== 0) {
      throw new Error("The dimension of the board must be an even number.")
  }

  const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍','🍩','🌶','🍓','🍧','🍙','🥩','🍰','🍭','🍺','☕','🥥','🍔','🌭','🥓','🍕']
  const picks = pickRandom(emojis, (dimensions * dimensions) / 2) 
  const items = shuffle([...picks, ...picks])
  const cards = `
      <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
          ${items.map(item => `
              <div class="card">
                  <div class="card-front"></div>
                  <div class="card-back">${item}</div>
              </div>
          `).join('')}
     </div>
  `
return cards.toString();

}



// connections


io.on("connection", (socket) => {// quando o socket se conectar...
count++;

if (count <= 1){ 

console.log("Made socket connection", socket.id);

socket.data.id = socket.id;
socket.data.nome = `Jogador ${count}`;
socket.data.pontos = 0;
socket.data.turnos = 0;
users.push(socket);
   
  } else{
    console.log("Too many connections");
    socket.disconnect();
    
  }


  socket.on("ready", (dimensions) => {
    const cards = generateGame(dimensions);
    socket.emit("generated",cards);
    io.sockets.emit("startGame");
       
    });


    
    
    socket.on("givePoints", () => {
      socket.data.pontos++;
      io.sockets.emit = (`Pontos para: ${socket.data.nome}`);
    
    });
    
  
    
   
    socket.on("disconnect", () => {
      count--;
      console.log("Usuário se desconectou");
    });

});

