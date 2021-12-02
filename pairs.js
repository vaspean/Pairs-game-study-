(() => {
    const DELAY_AFTER_WIN = 200, DELAY_SHOW_WRONG_PAIR = 500, INPUT_START_VALUE = 4, INPUT_MIN_START_VALUE = 0, INPUT_MAX_START_VALUE = 99, INPUT_MIN_VALUE = 2, INPUT_MAX_VALUE = 10, GAME_TIMER = 60, TIMER_COUNTER_DELAY = 1000;
    function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function sortNumbers(a, b) {
        return a - b;
    }

    let arrOfNumbers = [];
    let arrOfCardMatch = [];
    let cardCount;
    function createStartArray(numberOfRows, numberOfCols) {
        let maxNumber = (numberOfCols * numberOfRows) / 2;
        let maxNumberIndex = maxNumber;
        for (let k = 0; k < maxNumber; k = k + 1) {
            arrOfNumbers[k] = k + 1;
            arrOfNumbers[maxNumberIndex] = k + 1;
            maxNumberIndex++;
        }
        return arrOfNumbers;
    }

    function closeCards(card1, card2) {
        document.querySelectorAll('.cardContainer')[card1].classList.add('cardClosed');
        document.querySelectorAll('.cardContainer')[card1].classList.remove('cardOpened');
        document.querySelectorAll('.cardContainer')[card2].classList.add('cardClosed');
        document.querySelectorAll('.cardContainer')[card2].classList.remove('cardOpened');
        document.querySelectorAll('p')[card1].classList.add('hidden');
        document.querySelectorAll('p')[card2].classList.add('hidden');
    }

    function winning() {
        document.getElementsByClassName('containerWin')[0].classList.remove('hidden');
        document.querySelector('.pWin').scrollIntoView();
    }

    let timerId1;
    let timerId2;
    let arrCurrentCards = [];
    let matches = [];
    function cardMatch(currentCardValue, currentCard) {
        // let 
        if (matches.includes(currentCard)) return
        arrCurrentCards.push(currentCard);
        arrOfCardMatch.push(currentCardValue);
        if (arrOfCardMatch[1] !== undefined) {
            if (arrOfCardMatch[0] === arrOfCardMatch[1] && arrCurrentCards[0] !== arrCurrentCards[1]) {
                matches.push(arrCurrentCards[0]);
                matches.push(arrCurrentCards[1]);
                matches = matches.sort(sortNumbers);
            } else {
                setTimeout(closeCards, DELAY_SHOW_WRONG_PAIR, arrCurrentCards[0], arrCurrentCards[1]);
            }
            arrOfCardMatch = [];
            arrCurrentCards = [];
        }
        if (matches.length === cardCount) {
            setTimeout(winning, DELAY_AFTER_WIN);
            clearInterval(timerId1);
            clearTimeout(timerId2);
        }
    }


    function createCard(cardCount, cardText, currentCard) {
        let cardContainer = document.createElement('div');
        let cardValue = document.createElement('p');
        let colClass;
        if (cardCount > 6) {
            colClass = Math.floor(12 / cardCount);
        } else if (cardCount === 6) {
            colClass = 1;
        } else if (cardCount === 4) {
            colClass = 2;
        } else if (cardCount === 2) {
            colClass = 5;
        }
        cardValue.textContent = cardText;
        cardContainer.append(cardValue);
        cardValue.classList.add('cardValue', 'hidden')
        cardContainer.classList.add(`cardContainer`, `col-${colClass}`, `mb-4`, 'cardClosed');

        cardContainer.addEventListener('click', () => {
            cardContainer.classList.remove('cardClosed');
            cardContainer.classList.add('cardOpened');
            cardValue.classList.add('cardValue');
            cardValue.classList.remove('hidden');
            cardMatch(cardValue.textContent, currentCard);
        })

        return {
            cardContainer
        };
    }

    function createGame(pairsRows, pairsCols) {
        cardCount = pairsCols * pairsRows;
        let shuffledPairs = shuffle(createStartArray(pairsRows, pairsCols));
        let shuffledIndex = 0;
        for (let i = 0; i < pairsRows; i++) {
            let gameContainer = document.getElementById(`pairs-game`);
            let containerRow = document.createElement('div');
            gameContainer.append(containerRow);
            containerRow.classList.add(`row`);
            for (let i = 0; i < pairsCols; i++) {
                let card = createCard(pairsCols, shuffledPairs[shuffledIndex], shuffledIndex);
                containerRow.append(card.cardContainer)
                shuffledIndex++;
            }
        }
        let cardContainer = document.getElementById('pairs-game');
        let containerDiv = document.createElement('div');
        let pWin = document.createElement('p');
        let btnWin = document.createElement('button');
        cardContainer.append(containerDiv);
        containerDiv.append(pWin);
        containerDiv.append(btnWin);
        pWin.innerText = 'Ты победил';
        btnWin.innerText = 'Сыграть заново';
        containerDiv.classList.add('containerWin', 'hidden');
        pWin.classList.add('pWin');
        btnWin.classList.add('btnWin');

        btnWin.addEventListener('click', () => {
            arrOfNumbers = [];
            arrOfCardMatch = [];
            arrCurrentCards = [];
            matches = [];
            let getGameContainer = document.getElementById('pairs-game');
            while (getGameContainer.hasChildNodes()) {
                getGameContainer.removeChild(getGameContainer.lastChild);
            }
            startGame();
        })
    }

    function controlInput(input) {
        input.value = INPUT_START_VALUE;
        input.addEventListener('input', () => {
            if (input.value < INPUT_MIN_START_VALUE) {
                input.value = INPUT_MIN_START_VALUE;
            }
            if (input.value > INPUT_MAX_START_VALUE) {
                input.value = INPUT_MAX_START_VALUE;
            }
        })
    }


    function startGame() {
        let timerValue = document.getElementsByClassName('h2')[0];
        timerValue.innerText = 'Игра в пары';
        let gameContainer = document.getElementById('pairs-game');
        let containerStart = document.createElement('div');
        let h2Start = document.createElement('h2');
        let h2_2Start = document.createElement('h2');
        let input1Start = document.createElement('input');
        let input2Start = document.createElement('input');
        let btnStart = document.createElement('button');
        h2Start.innerText = 'Введи кол-во строк по горизонтали (четное число от 2 до 10)';
        h2_2Start.innerText = 'Введи кол-во строк по вертикали (четное число от 2 до 10)';
        containerStart.classList.add('containerStart');
        h2Start.classList.add('pairs-game__h2');
        h2_2Start.classList.add('pairs-game__h2');
        input1Start.classList.add('inputStart');
        input2Start.classList.add('inputStart');
        input1Start.setAttribute('type', 'number')
        input2Start.setAttribute('type', 'number')
        btnStart.classList.add('btnStart');
        btnStart.innerText = 'Начать';
        gameContainer.append(containerStart);
        containerStart.append(h2Start);
        containerStart.append(input1Start);
        containerStart.append(h2_2Start);
        containerStart.append(input2Start);
        input1Start.setAttribute('id', `1`)
        input2Start.setAttribute('id', `2`)
        containerStart.append(btnStart);
        controlInput(input1Start);
        controlInput(input2Start);

        btnStart.addEventListener('click', () => {
            if (input1Start.value % 2 !== 0 || input1Start.value > INPUT_MAX_VALUE || input1Start.value < INPUT_MIN_VALUE || input2Start.value % 2 !== 0 || input2Start.value > INPUT_MAX_VALUE || input2Start.value < INPUT_MIN_VALUE) {
                input1Start.value = INPUT_START_VALUE;
                input2Start.value = INPUT_START_VALUE;
                alert('Пожалуйста, введите корректные значения (четное число от 2 до 10)')
            } else {
                let varInput1 = Number(input1Start.value);
                let varInput2 = Number(input2Start.value);
                let getGameContainer = document.getElementById('pairs-game');
                let timerValue = document.getElementsByClassName('h2')[0];
                timerValue.innerText = `${GAME_TIMER}`;
                while (getGameContainer.hasChildNodes()) {
                    getGameContainer.removeChild(getGameContainer.lastChild);
                }
                createGame(varInput1, varInput2);
                let secondsGame = GAME_TIMER;
                function everySecond() {
                    if (secondsGame < 0) {
                        timerValue.innerText = 0;
                    }
                    secondsGame--;
                    if (secondsGame >= 0) {
                        timerValue.innerText = secondsGame;
                    }
                }
                timerId1 = setInterval(everySecond, TIMER_COUNTER_DELAY)
                let closed = document.getElementsByClassName('cardContainer');
                function minute() {
                    clearInterval(timerId1);
                    winning();
                    document.getElementsByClassName('pWin')[0].innerText = 'Время закончилось';
                    document.querySelector('.pWin').scrollIntoView();


                    let closedParagraph = document.getElementsByClassName('cardValue');
                    for (let i = 0; i < closed.length; ++i) {
                        closedParagraph[i].classList.remove('hidden')
                        closed[i].classList.add('cardOpened');
                        closed[i].classList.remove('cardClosed');
                        closed[i].style.pointerEvents = 'none';
                    }
                }

                function endCards() {
                    for (let i = 0; i < closed.length; ++i) {
                        closed[i].style.pointerEvents = 'none';
                    }
                }
                timerId3 = setTimeout(endCards, GAME_TIMER*1000);
                timerId2 = setTimeout(minute, (GAME_TIMER*1000)+500);
            }
        })
    }
    window.startGame = startGame;
})();