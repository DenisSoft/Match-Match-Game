(function ($) {

    let settings = document.getElementById('memory--settings-icon');
    let modal = document.getElementById('memory--settings-modal');
    var handleOpenSettings = function (event) {
        event.preventDefault();
        modal.classList.toggle('show');
        if (stopwatch) {
            stopwatch.pause();
        }
    };
    settings.addEventListener('click', handleOpenSettings);

    let reset = document.getElementById('memory--settings-reset');
    var handleSettingsSubmission = function (event) {
        event.preventDefault();

        let cover = document.querySelector('input[type="radio"][name="select-cover"]:checked').value;
        let grid = document.querySelector('input[type="radio"][name="select-label"]:checked').value;
        let gridValues = grid.split('x');
        let cards = $.initialize(Number(gridValues[0]), Number(gridValues[1]));

        if (cards) {
            document.getElementById('memory--settings-modal').classList.remove('show');
            document.getElementById('memory--end-game-modal').classList.remove('show');
            document.getElementById('memory--end-game-message').innerText = "";
            document.getElementById('memory--end-game-score').innerText = "";
            buildLayout($.cards, $.settings.rows, $.settings.columns, cover);
        }
        stopwatch.restart();
    };
    reset.addEventListener('click', handleSettingsSubmission);

    var handleFlipCard = function (event) {
        console.log(event);
        event.preventDefault();

        let status = $.play(this.index);

        if (status.code !== 0) {
            this.classList.toggle('clicked');
        }
        if (status.code === 2 || status.code === 4) {
            setTimeout(function () {
                let childNodes = document.getElementById('memory--cards').childNodes;
                childNodes[status.args[0]].classList.add('hide');
                childNodes[status.args[1]].classList.add('hide');
            }.bind(status), 300);
        }

        if (status.code === 3) {
            setTimeout(function () {
                let childNodes = document.getElementById('memory--cards').childNodes;
                childNodes[status.args[0]].classList.remove('clicked');
                childNodes[status.args[1]].classList.remove('clicked');
            }.bind(status), 500);
        }
        if (status.code === 4) {
            setTimeout(function () {
                let score = parseInt((($.attempts - $.mistakes) / $.attempts) * 100, 10);
                let message = getEndGameMessage(score);
                document.getElementById('memory--end-game-message').textContent = message;
                document.getElementById('memory--end-game-score').textContent =
                    'Score: ' + score + ' / 100' + "   Time " + document.getElementById("stopwatch").innerHTML;
                document.getElementById("memory--end-game-modal").classList.toggle('show');
                stopwatch.stop();
                stopwatch = false;
                document.getElementById('stopwatch').innerHTML = "";
            }.bind(status), 1100);
        }
    };

    var getEndGameMessage = function (score) {
        let message = "";

        if (score === 100) {
            message = "Amazing job!"
        }
        else if (score >= 70) {
            message = "Great job!"
        }
        else if (score >= 50) {
            message = "Great job!"
        }
        else {
            message = "You can do better.";
        }

        return message;
    };

    var buildLayout = function (cards, rows, columns, cover) {
        if (!cards.length) {
            return;
        }

        let memoryCards = document.getElementById("memory--cards");
        let index = 0;

        let cardMaxWidth = document.getElementById('memory--app-container').offsetWidth / columns;
        let cardHeightForMaxWidth = cardMaxWidth * (3 / 4);

        let cardMaxHeight = document.getElementById('memory--app-container').offsetHeight / rows;
        let cardWidthForMaxHeight = cardMaxHeight * (4 / 3);

        while (memoryCards.firstChild) {
            memoryCards.firstChild.removeEventListener('click', handleFlipCard);
            memoryCards.removeChild(memoryCards.firstChild);
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                memoryCards.appendChild(buildCardNode(
                    index, cards[index].value, cards[index].isRevealed,
                    (100 / columns) + "%", (100 / rows) + "%", cover));
                index++;
            }
        }

        if (cardMaxHeight > cardHeightForMaxWidth) {
            memoryCards.style.height = (cardHeightForMaxWidth * rows) + "px";
            memoryCards.style.width = document.getElementById('memory--app-container').offsetWidth + "px";
            memoryCards.style.top = ((cardMaxHeight * rows - (cardHeightForMaxWidth * rows)) / 2) + "px";
        }
        else {
            memoryCards.style.width = (cardWidthForMaxHeight * columns) + "px";
            memoryCards.style.height = document.getElementById('memory--app-container').offsetHeight + "px";
            memoryCards.style.top = 0;
        }
        stopwatch = new Stopwatch( document.getElementById('stopwatch'));
    };

    window.addEventListener('resize', function () {
        buildLayout($.cards, $.settings.rows, $.settings.columns);
    }, true);


    var buildCardNode = function (index, value, isRevealed, width, height, cover) {

        let flipContainer = document.createElement("li");
        let flipper = document.createElement("div");
        let front = document.createElement("a");
        let back = document.createElement("a");

        flipContainer.index = index;
        flipContainer.style.width = width;
        flipContainer.style.height = height;
        flipContainer.classList.add("flip-container");
        if (isRevealed) {
            flipContainer.classList.add("clicked");
        }

        flipper.classList.add("flipper");
        front.classList.add(cover);
        front.classList.add("front");
        front.setAttribute("href", "#");
        back.classList.add("back");
        back.classList.add("card-" + value);
        back.setAttribute("href", "#");

        flipper.appendChild(front);
        flipper.appendChild(back);
        flipContainer.appendChild(flipper);
        flipContainer.addEventListener('click', handleFlipCard);

        return flipContainer;
    };

})(MemoryGame);

