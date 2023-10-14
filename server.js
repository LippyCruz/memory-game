const express = require("express");
const socket = require("socket.io");
const http = require("http");

const app = express();
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);

// Set static folder
app.use(express.static("public"));

// Socket setup
const io = socket(server);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function generate (){
  const dimensions = selectors.board.getAttribute('data-dimension')

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
  
  const parser = new DOMParser().parseFromString(cards, 'text/html')
  return parser;
}

io.on("connection", (socket) => {
  
  

    console.log("Made socket connection", socket.id);
  });

  socket.on("join", () => {
    const p1 = {
      id: 1,
      nome: "Jogador 1",
      pontos: 0
    };

    const p2 = {
      id: 2,
      nome: "Jogador 2",
      pontos: 0
    };

    if(users.isEmpty()){
      users.push(p1);
      io.sockets.emit(p1);
    }
    else if(users.length === 1){
      users.push(p2);
      io.sockets.emit(p2);
    }
    else{
      io.sockets.emit("full");
    }
    
  });

socket.on("generate", () => {
  generate();

  io.sockets.emit(generate());
});

  socket.on("pointsP1", () => {
    socket.emit = (pontos in users.p1);

  });

  socket.on("pointsP2", () => {
    socket.emit = (pontos in users.p2);

  });

  socket.on("joined", () => {
    socket.emit("joined", users);
  });

  socket.on("flip", (data) => {
    users[data.id].pos = data.pos;
    
    io.sockets.emit("flip", data);
  });

  socket.on("check", () => {
    if(users.length === 2){
      io.sockets.emit("start");
    }
    else{
      io.sockets.emit("wait");
    }
    
  });

  socket.on("restart", () => {
    users = [];
    io.sockets.emit("restart");
  });

  