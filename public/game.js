
const socket = io.connect("http://localhost:3000");

const parser = new DOMParser()

const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    points: document.querySelector('.points'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win'),
    dimensions: document.querySelector('.dimensions'),
    nomeJogador: document.querySelector('.nomeJogador')
}

let nomeJogador;

const state = {
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
        socket.emit("winner", nomeJogador, state.points, state.totalTime);
        socket.emit("getRank");
        socket.on("rank", (arrayRank) => {
            
            setTimeout(() => {
                selectors.boardContainer.classList.add('flipped')
                selectors.win.innerHTML = `
                    <span class="win-text">
                        Você venceu!<br />
                        com <span class="highlight">${state.points}</span> pontos<br />
                        em apenas <span class="highlight">${state.totalTime}</span> segundos
                    </span>
                    <span class="rank">
                        <h3>Ranking</h3>
                        <table>
                        <tr>
                          <th>Posição</th>
                          <th>Nome</th>
                          <th>Pontos</th>
                          <th>Tempo</th>
                        </tr>
                        ${arrayRank.map((user, index) => `<tr>
                            <td>${index +1}º</td>
                            <td>${user.nome}</td>
                            <td>${user.pontos} pontos</td>
                            <td>${user.tempo}</td>
                          </tr>
                          `).join('')}
                        </table>
                    </span>
    
                `
            
                clearInterval(state.loop)
            }, 1000)
        });
        selectors.start.classList.remove('disabled')
    }
}





const attachEventListeners = () => {
    
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('readyButton') && !eventTarget.className.includes('disabled')) {
            nomeJogador = selectors.nomeJogador.value;
            socket.emit("ready", selectors.dimensions.value)
            selectors.start.classList.add('disabled')
            selectors.dimensions.classList.add('disabled')
            selectors.nomeJogador.classList.add('disabled')
        }
        
        else if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
         }	 
    })
}

attachEventListeners()