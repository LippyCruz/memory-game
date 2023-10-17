// declarations
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  maxHttpBufferSize: 1e7
});

app.use(express.static("public"));

server.listen(3000, () => {
  console.log('listening on *:3000');
});

let count = 0;
let ready = 0;
let flippedCards = 0;
const users = [];


// game logic functions

const shuffle = array => {
  const clonedArray = [...array]

  for (let index = clonedArray.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
      const original = clonedArray[index]

      clonedArray[index] = clonedArray[randomIndex]
      clonedArray[randomIndex] = original
  }

  return clonedArray
}

const pickRandom = (array, items) => {
  const clonedArray = [...array]
  const randomPicks = []

  for (let index = 0; index < items; index++) {
      const randomIndex = Math.floor(Math.random() * clonedArray.length)
      
      randomPicks.push(clonedArray[randomIndex])
      clonedArray.splice(randomIndex, 1)
  }

  return randomPicks
}

function changeTurn() {

  let ganhaVez = users.find(player => player.data.turnos === 0);
  let passaVez = users.find(player => player.data.turnos === 1);

 ganhaVez.turnos++;
 passaVez.turnos--;   

 io.sockets.emit("changeTurn", );
 console.log(`turno de ${ganhaVez.data.nome}`);
}


const generateGame = () => {
    
  const dimensions = "4" // must be an even number

  if (dimensions % 2 !== 0) {
      throw new Error("The dimension of the board must be an even number.")
  }

  const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍']
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


io.on("connection", (socket) => {
count++;

if (count <= 2){ 

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
  
   /*
   function currentPlayer(socket) {
    return socket.data;
  }

  function playerOne() {
    return  users.find(player => player.data.nome === 'Jogador 1');
    console.log (users.find(player => player.data.nome === 'Jogador 1'));
  }

  function playerTwo() {
    return  users.find(player => player.data.nome === 'Jogador 2');
    console.log (users.find(player => player.data.nome === 'Jogador 2'));
  }
*/

  socket.on("ready", () => {
    console.log(`${socket.data.nome} esta pronto`);
    io.sockets.emit(`${socket.data.nome} esta pronto`);

    if (ready < 1){
      ready++;
    } else {
      io.sockets.emit("startGame");
    }
    
    
    });
    
    
    socket.on("finishedTurn", () => {
      changeTurn();
      });
      
    
    
    socket.on("checkTurn", () => {
    if ((users.find(player => player.data.turnos === 0)).id === socket.id){
    socket.emit("no");
    }else{
    socket.emit("yes");
    }
    });
    
    
    socket.on("generate", () => {
    const cards = generateGame()
    socket.emit("generated",cards);
    });
    
    
    socket.on("result", () => {
      if (users.find(player => player.data.nome === "Jogador 1") > users.find(player => player.data.nome === "Jogador 2")){
        io.sockets.emit("winP1");
      
      } else if (users.find(player => player.data.nome === "Jogador 1") < users.find(player => player.data.nome === "Jogador 2")){
        io.sockets.emit("winP2");
      
      } else{
        io.sockets.emit("draw");
      
      }

    });
    
    
    
    socket.on("givePoints", () => {
      socket.data.pontos++;
      io.sockets.emit = (`Pontos para: ${socket.data.nome}`);
    
    });
    
    socket.on("pointsP1", () => {
      let jogador1 = users.find(player => player.data.nome === "Jogador 1");
      socket.emit("pontosP1", jogador1.pontos);
    });
    
    socket.on("pointsP2", () => {
      let jogador2 = users.find(player => player.data.nome === "Jogador 2");
      socket.emit("pontosP2", jogador2.pontos);
    
    });
    
   
    socket.on("flipCard", (data) => {
      io.sockets.emit("flippedCard", data);
      flippedCards++;
  });
  
   
  socket.on("flippedCards", () => {
    socket.emit("flipped_count",flippedCards);
  
});

socket.on("Cards", (card1, card2) => {
  if(card1.innerText === card2.innerText){
    io.sockets.emit("CardsMatched", card1, card2);
    jogador = users.find(player => player.data.id === socket.id)
    jogador.pontos++;
  } else {
    io.sockets.emit("CardsNotMatched", card1, card2);
  }

});



});

