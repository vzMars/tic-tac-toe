const Player = (name, mark) => {
  const setName = (newName) => (name = newName);
  const getName = () => name;
  const getMark = () => mark;
  return { getMark, getName, setName };
};

const playerX = Player('Player X', 'X');
const playerO = Player('Player O', 'O');

const displayController = (() => {
  const squares = Array.from(document.querySelectorAll('.square'));
  const gameInfo = document.querySelector('.game-info');
  const restartBtn = document.querySelector('#restartBtn');
  const newGameBtn = document.querySelector('#newGameBtn');
  const modal = document.querySelector('.modal');
  const playerXName = document.querySelector('#playerXName');
  const renameBtnX = document.querySelector('#renameX');
  const playerOName = document.querySelector('#playerOName');
  const renameBtnO = document.querySelector('#renameO');
  const startBtn = document.querySelector('#startBtn');

  document.getElementById('gameboard').addEventListener('click', (event) => {
    let index = squares.findIndex((square) => {
      return square === event.target;
    });
    if (!gameLogic.getGameOver()) {
      gameBoard.checkIndex(index);
      render();
    }
  });

  restartBtn.addEventListener('click', () => {
    init();
  });

  newGameBtn.addEventListener('click', () => {
    init();
    console.log('hi');
    modal.style.display = 'flex';
  });

  renameBtnX.addEventListener('click', () => {
    playerX.setName(playerXName.value);
    init();
  });

  renameBtnO.addEventListener('click', () => {
    playerO.setName(playerOName.value);
    init();
  });

  startBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  const changeGameInfo = (text) => {
    gameInfo.textContent = text;
    render();
  };

  const init = () => {
    gameBoard.clearBoard();
    gameLogic.setWinner(false);
    gameLogic.setGameOver(false);
    gameLogic.setCurrentTurn(playerX.getMark());
    changeGameInfo(`${playerX.getName()}'s turn!`);
    render();
  };

  const render = () => {
    gameBoard.getBoard().forEach((mark, index) => {
      squares[index].textContent = mark;
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
      if (gameLogic.getCurrentTurn() === playerX.getMark()) {
        displayController.changeGameInfo(`${playerX.getName()} has won!`);
      } else {
        displayController.changeGameInfo(`${playerO.getName()} has won!`);
      }
      gameLogic.setGameOver(true);
    } else {
      if (gameLogic.getCurrentTurn() === playerX.getMark()) {
        gameLogic.setCurrentTurn(playerO.getMark());
        displayController.changeGameInfo(`${playerO.getName()}'s turn!`);
      } else {
        gameLogic.setCurrentTurn(playerX.getMark());
        displayController.changeGameInfo(`${playerX.getName()}'s turn!`);
      }
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

  const setCurrentTurn = (mark) => {
    currentTurn = mark;
  };

  const getGameOver = () => gameOver;

  const setGameOver = (status) => {
    gameOver = status;
  };

  const getWinner = () => winner;

  const setWinner = (status) => {
    winner = status;
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
      setGameOver(true);
    }
  };

  return {
    getCurrentTurn,
    setCurrentTurn,
    getGameOver,
    setGameOver,
    getWinner,
    setWinner,
    checkWinner,
    checkDraw,
  };
})();
