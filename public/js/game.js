
const socket = io.connect("http://localhost:3000");
 socket.emit("joined");
 

const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    points1: document.querySelector('.points1'),
    points2: document.querySelector('.points2'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win'),
    status: document.querySelector('.status')
}


const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    pointsP1: socket.emit("pointsP1"),
    pointsP2: socket.emit("pointsP2")
}

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

const givePoints= (currentplayerid) => {
   socket.emit("givePoints", currentplayerid)
}

const generateGame = () => {
    
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
    socket.emit("generate", parser)
    selectors.board.replaceWith(socket.emit("generate", parser).querySelector('.board'))

}

const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++

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
    state.flippedCards++
    state.totalFlips++

    
    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')
        socket.emit("changeTurn", currentplayer)
        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
            socket.emit("givePoints", currentplayer)

        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        
        if (socket.emit("result") ==='draw') {

        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    Empate!<br />
                    with <span class="highlight">${state.points1}</span> pontos<br />
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
                    with <span class="highlight">${state.points1}</span> pontos<br />
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
                    with <span class="highlight">${state.points1}</span> pontos<br />
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

        if (socket.emit("checkTurn", currentplayer) ==='yes') {


        }

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            if (socket.emit("checkTurn", currentplayer) ==='yes') {
                flipCard(eventParent)
           
            } else {
                console.log('Aguarde sua vez');
                selectors.status.innerHTML = `Status: Aguarde sua vez`
            }
           
        } else if (eventTarget.className.includes('startButton') && !eventTarget.className.includes('disabled')) {
            if (socket.emit("join")=== 'full') {
                alert('Sala cheia');
                selectors.start.classList.add('disabled')
            } else if (socket.emit("check") ==='start') {
                generateGame()
                startGame()
            } else if (socket.emit("check") ==='wait'){

                alert('Aguardando outro jogador');
                selectors.status.innerHTML = `Status: Aguardando outro jogador...`
            } else {
                const currentplayer = socket.emit("join")
            }

            
            
        }
    })
}

attachEventListeners()