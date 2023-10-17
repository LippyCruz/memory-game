
const socket = io.connect("http://localhost:3000");

const parser = new DOMParser()

const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    points1: document.querySelector('.points1'),
    points2: document.querySelector('.points2'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win'),
    msgstatus: document.querySelector('.status')
}


const state = {
    gameStarted: false,
    flippedCards: 0,
    totalTime: 0,
    loop: null,
    pointsP1: 0,
    pointsP2: 0
}

const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

socket.on("startGame", () => {
    startGame()
  });

  socket.on("Jogador 1 está pronto", () => {
    msgstatus.innerHTML = `Status: Jogador 1 está pronto`
  });

  socket.on("Jogador 2 está pronto", () => {
    msgstatus.innerHTML = `Status: Jogador 2 está pronto`
  });

  socket.on("CardsMatched", (card1, card2) => {
    card1.classList.add('matched')
    card2.classList.add('matched')
    
  
});


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

function getPoints(jogador) {
let pontuaçao;
if (jogador === 'p1') {
        socket.emit("pointsP1")
        socket.on("pointsP1", (data) => {
            pontuaçao = data;
        })
    } else if (jogador === 'p2') {
        socket.emit("pointsP2")
        socket.on("pointsP2", (data) => {
            pontuaçao = data;
        })
    }
return pontuaçao;

}


socket.on("flippedCard", (data) => {
    flipCard(data)    
    
});


const generateGame = () => {
    socket.emit("generate");

    socket.on("generated", (data) => {
        
        selectors.board.replaceWith(parser.parseFromString(data, 'text/html').querySelector('.board'))
    });


  

}



const startGame = () => {
    state.gameStarted = true
    state.loop = setInterval(() => {
        state.totalTime++
        state.pointsP1 = getPoints('p1')
        state.pointsP2 = getPoints('p2')
        selectors.points1.innerText = `Pontuação (Jogador 1): ${state.pointsP1}`
        selectors.points2.innerText = `Pontuação (Jogador 2): ${state.pointsP2}`
        selectors.timer.innerText = `Tempo: ${state.totalTime} seg`
    }, 1000)
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}



const flipCard = card => {
    socket.emit('flippedCards');
    
    socket.on("flipped_count", (data) => {
        state.flippedCards = data;
      
    });

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
       
        socket.emit("Cards", flippedCards[0], flippedCards[1])

        setTimeout(() => {
            flipBackCards()
        }, 1000)
        socket.emit("finishedTurn")
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        
        if (socket.emit("result") ==='draw') {

        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    Empate!<br />
                    with <span class="highlight">${state.pointsP1}</span> pontos<br />
                    under <span class="highlight">${state.totalTime}</span> segundos
                </span>
            `

            clearInterval(state.loop)
        }, 1000)

    } else if (socket.emit("result") ==='winP1'){
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                Vitória de ${player1.nome}<br />
                    with <span class="highlight">${state.pointsP1}</span> pontos<br />
                    under <span class="highlight">${state.totalTime}</span> segundos
                </span>
            `

            clearInterval(state.loop)
        }, 1000)


    } else {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                        Vitória de ${player2.nome}<br />
                    with <span class="highlight">${state.pointsP1}</span> pontos<br />
                    under <span class="highlight">${state.totalTime}</span> segundos
                </span>
            `

            clearInterval(state.loop)
        }, 1000)

    }

    
    }
}




const attachEventListeners = () => {
    
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('readyButton') && !eventTarget.className.includes('disabled')) {
            socket.emit("ready")
            selectors.start.classList.add('disabled')
         
        }

        
        else if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {

            socket.emit("checkTurn")
            
            socket.on("yes", () => {

                flipCard(eventParent)
                
            })

            socket.on("no", () => {

            console.log('Aguarde sua vez');
            selectors.msgstatus.innerHTML = `Status: Aguarde sua vez`

                
            })
           
            


        }	 
    })
}
generateGame()
attachEventListeners()