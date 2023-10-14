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

selectors.start.classList.add('disabled');





const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
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
    if (currentplayerid === player1.id) {
        state.pointsP1++
    } else {
        state.pointsP2++
    }
}

const generateGame = () => {
    const parser = socket.emit("generate")

    selectors.board.replaceWith(parser.querySelector('.board'))
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

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
            currentplayerid = socket.emit("pointsP1")

        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        
        if (selectors.points1 === selectors.points2) {

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

    } else if (selectors.points1 > selectors.points2){
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

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.className.includes('startButton') && !eventTarget.className.includes('disabled')) {
            if (socket.emit("join")=== 'full') {
                alert('Sala cheia');
                selectors.start.classList.add('disabled')
            } else if (socket.emit("check") ==='start') {
                startGame()
            } else if (socket.emit("check") ==='wait'){

                alert('Aguardando outro jogador');
                selectors.status.innerHTML = `Status: Aguardando outro jogador...`
            } else {
                currentplayer = socket.emit("join")
            }

            
            
        }
    })
}

generateGame()
attachEventListeners()