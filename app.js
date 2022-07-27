const Gameboard = (() => {

    let board = ["","","","","","","",""];

    const placeMarker = (position, marker) => {
        board[position] = marker;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    const getField = (position) => {
        if (position > board.length) return;
        return board[position];
    }

    return {
        placeMarker,
        resetBoard,
        getField
    };
})();

const Player = (marker) => {
    this.marker = marker;

    const getMarker = () => {
        return marker;
    };

    return {
        getMarker
    };
};

const displayController = (() => {
    const fieldElements = document.querySelectorAll(".field");
    const restartBtn = document.getElementById("restart-btn");
    const messageBox = document.getElementById("message");

    fieldElements.forEach((field) => {
        field.addEventListener("click", (e) => {
            if (gameController.getGameOver() || e.target.textContent !== "") return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameBoard();
        })
    });

    restartBtn.addEventListener("click", (e) => {
        Gameboard.resetBoard();
        gameController.reset();
        updateGameBoard();
        setMessageElement("X's turn");
    });

    const updateGameBoard = () => {
        for (let i = 0; i < fieldElements.length; i++) {
            fieldElements[i].textContent = Gameboard.getField(i);
        }
    };

    const setResultMessage = (winner) => {
        if (winner === "Draw") {
            setMessageElement("It's a draw!");
        } else {
            setMessageElement(`Player ${winner} has won!`);
        }
    };

    const setMessageElement = (message) => {
        messageBox.textContent = message;
    };

    return {setResultMessage, setMessageElement};
})();

const gameController = (() => {
    const playerOne = Player("X");
    const playerTwo = Player("O");
    let round = 1;
    let gameOver = false;
    
    const playRound = (position) => {
        Gameboard.placeMarker(position, getCurrentPlayerMarker());
        if (checkWinner(position)) {
            displayController.setResultMessage(getCurrentPlayerMarker());
            gameOver = true;
            return;
        }

        if (round === 9) {
            displayController.setResultMessage("Draw");
            gameOver = true;
            return;
        }
        round++;
        displayController.setMessageElement(
            `Player ${getCurrentPlayerMarker()}'s turn`
        );
    };

    const getCurrentPlayerMarker = () => {
        return round % 2 === 1 ? playerOne.getMarker() : playerTwo.getMarker();
    };

    const checkWinner = (position) => {
        const winConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        return winConditions
            .filter((combination) => combination.includes(position))
            .some((possibleCombination) =>
            possibleCombination.every(
                (index) => Gameboard.getField(index) === getCurrentPlayerMarker()
            )
            );
    };

    const getGameOver = () => {
        return gameOver;
    };

    const reset = () => {
        round = 1;
        gameOver = false;
    };

    return {playRound, getGameOver, reset};
})();