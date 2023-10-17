
const socket = io.connect("http://localhost:3000");

const parser = new DOMParser()

const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    points: document.querySelector('.points'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win'),
    dimensions: document.querySelector('.dimensions')
}


const state = {
    gameStarted: false,
    flippedCards: 0,
    totalTime: 0,
    loop: null,
    points: 0,
    
}


socket.on("startGame", () => {
    startGame()
  });


socket.on("generated", (data) => {
selectors.board.replaceWith(parser.parseFromString(data, 'text/html').querySelector('.board'))
        
});

  
const startGame = () => {
    state.gameStarted = true
    state.loop = setInterval(() => {
        state.totalTime++
        selectors.points.innerText = `Pontuação : ${state.points}`
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

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
            state.points++
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    Você venceu!<br />
                    com <span class="highlight">${state.pontos}</span>pontos<br />
                    em apenas <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `

            clearInterval(state.loop)
        }, 1000)
    }
}





const attachEventListeners = () => {
    
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('readyButton') && !eventTarget.className.includes('disabled')) {
            socket.emit("ready", selectors.dimensions.value)
            selectors.start.classList.add('disabled')
            selectors.dimensions.classList.add('disabled')
        }
        
        else if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
         }	 
    })
}

attachEventListeners()