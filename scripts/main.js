const Player = (mark) => {
  const getMark = () => mark;
  return { getMark };
};

const playerX = Player('X');
const playerO = Player('O');

const displayController = (() => {
  const _squares = Array.from(document.querySelectorAll('.square'));
  const gameInfo = document.querySelector('.game-info');

  document.getElementById('gameboard').addEventListener('click', (event) => {
    let index = _squares.findIndex((_square) => {
      return _square === event.target;
    });
    if (!gameLogic.getGameOver()) {
      gameBoard.checkIndex(index);
      render();
    }
  });

  const changeGameInfo = (text) => {
    gameInfo.textContent = text;
    render();
  };

  const render = () => {
    gameBoard.getBoard().forEach((mark, index) => {
      _squares[index].textContent = mark;
    });
  };

  return {
    changeGameInfo,
  };
})();

const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => board;

  const clearBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  };

  const addMark = (index) => {
    board[index] = gameLogic.getCurrentTurn();
    if (gameLogic.checkWinner(gameLogic.getCurrentTurn())) {
      displayController.changeGameInfo(
        `Player ${gameLogic.getCurrentTurn()} has won!`
      );
      gameLogic.setGameOver();
    } else {
      gameLogic.setCurrentTurn();
      displayController.changeGameInfo(
        `Player ${gameLogic.getCurrentTurn()}'s turn!`
      );
      gameLogic.checkDraw();
    }
  };

  const checkIndex = (index) => {
    if (board[index] === '') {
      addMark(index);
    }
  };

  return { getBoard, clearBoard, checkIndex };
})();

const gameLogic = (() => {
  let currentTurn = playerX.getMark();
  let winner = false;
  let gameOver = false;
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getCurrentTurn = () => currentTurn;

  const setCurrentTurn = () => {
    if (getCurrentTurn() === 'X') {
      currentTurn = playerO.getMark();
    } else {
      currentTurn = playerX.getMark();
    }
  };

  const getGameOver = () => gameOver;

  const setGameOver = () => {
    if (getGameOver()) {
      gameOver = false;
    } else {
      gameOver = true;
    }
  };

  const checkWinner = (mark) => {
    console.log(`checking if player${mark} is the winner`);
    return (winner = winningCombos.some((combo) => {
      console.log(`checking if ${combo} combo has ${mark} mark`);
      return combo.every((index) => {
        console.log(
          `index: ${index}  hasMark: ${gameBoard
            .getBoard()
            [index].includes(mark)}`
        );
        return gameBoard.getBoard()[index].includes(mark);
      });
    }));
  };

  const checkDraw = () => {
    let drawStatus = !gameBoard.getBoard().includes('');
    if (drawStatus) {
      displayController.changeGameInfo(`It's a draw!`);
      setGameOver();
    }
  };

  return {
    getCurrentTurn,
    setCurrentTurn,
    getGameOver,
    setGameOver,
    checkWinner,
    checkDraw,
  };
})();
