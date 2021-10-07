const Player = (name, mark, human) => {
  const setName = (newName) => (name = newName);
  const getName = () => name;
  const setHuman = (status) => (human = status);
  const getHuman = () => human;
  const getMark = () => mark;
  return { getMark, getName, setName, getHuman, setHuman };
};

const playerX = Player('Player X', 'X', true);
const playerO = Player('Player O', 'O', true);

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
  const playerBtn = document.querySelector('#playerBtn');
  const computerBtn = document.querySelector('#computerBtn');

  document.getElementById('gameboard').addEventListener('click', (event) => {
    let index = squares.findIndex((square) => {
      return square === event.target;
    });
    if (!gameLogic.getGameOver()) {
      gameBoard.addPlayerMark(index);
      if (!gameLogic.getCurrentHuman()) {
        console.log(`computer's time to shine`);
        document.addEventListener('click', freezeClick, true);
        setTimeout(() => {
          gameBoard.addComputerMark();
          document.removeEventListener('click', freezeClick, true);
        }, 2000);
      }
    }
  });

  restartBtn.addEventListener('click', () => {
    init();
  });

  newGameBtn.addEventListener('click', () => {
    init();
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

  playerBtn.addEventListener('click', () => {
    playerO.setName('Player O');
    playerO.setHuman(true);
    playerOName.disabled = false;
    buttonEnabled();
  });

  computerBtn.addEventListener('click', () => {
    playerO.setName('Computer');
    playerO.setHuman(false);
    playerOName.disabled = true;
    buttonDisabled();
  });

  const freezeClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const buttonDisabled = () => {
    renameBtnO.disabled = true;
    renameBtnO.style.border = '5px solid #bdc3c7';
    renameBtnO.style.backgroundColor = '#bdc3c7';
    renameBtnO.style.cursor = 'default';
  };

  const buttonEnabled = () => {
    renameBtnO.disabled = false;
    renameBtnO.removeAttribute('style');
  };

  const changeGameInfo = (text) => {
    gameInfo.textContent = text;
    render();
  };

  const init = () => {
    gameBoard.clearBoard();
    gameLogic.setWinner(false);
    gameLogic.setGameOver(false);
    gameLogic.setCurrentHuman(playerX.getHuman());
    gameLogic.setCurrentTurn(playerX.getMark());
    gameLogic.setCurrentPlayer(playerX.getName());
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

  const addPlayerMark = (index) => {
    if (checkIndex(index) && gameLogic.getCurrentHuman()) {
      addMarkToBoard(index);
    }
  };

  const addComputerMark = () => {
    console.log('inside the addComputerMark method');
    let randomIndex = Math.floor(Math.random() * 8);
    if (checkIndex(randomIndex)) {
      console.log(randomIndex);
      addMarkToBoard(randomIndex);
    } else {
      addComputerMark();
    }
    // let index = board.findIndex((item) => {
    //   return item === '';
    // });
  };

  const addMarkToBoard = (index) => {
    board[index] = gameLogic.getCurrentTurn();
    if (gameLogic.checkWinner(gameLogic.getCurrentTurn())) {
      displayController.changeGameInfo(
        `${gameLogic.getCurrentPlayer()} has won!`
      );
      gameLogic.setGameOver(true);
    } else {
      gameLogic.switchTurnPlayer();
      displayController.changeGameInfo(
        `${gameLogic.getCurrentPlayer()}'s turn!`
      );
      gameLogic.checkDraw();
    }
  };

  const checkIndex = (index) => {
    if (board[index] === '') return true;
  };

  return { getBoard, clearBoard, addPlayerMark, addComputerMark };
})();

const gameLogic = (() => {
  let currentTurn = playerX.getMark();
  let currentPlayer = playerX.getName();
  let currentHuman = playerX.getHuman();
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

  const getCurrentPlayer = () => currentPlayer;

  const setCurrentPlayer = (player) => {
    currentPlayer = player;
  };

  const getCurrentHuman = () => currentHuman;

  const setCurrentHuman = (status) => {
    currentHuman = status;
  };

  const switchTurnPlayer = () => {
    if (getCurrentPlayer() === playerX.getName()) {
      setCurrentPlayer(playerO.getName());
      setCurrentTurn(playerO.getMark());
      setCurrentHuman(playerO.getHuman());
    } else {
      setCurrentPlayer(playerX.getName());
      setCurrentTurn(playerX.getMark());
      setCurrentHuman(playerX.getHuman());
    }
  };

  const getGameOver = () => gameOver;

  const setGameOver = (status) => {
    gameOver = status;
  };

  const setWinner = (status) => {
    winner = status;
  };

  const checkWinner = (mark) => {
    return (winner = winningCombos.some((combo) => {
      return combo.every((index) => {
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
    getCurrentPlayer,
    getGameOver,
    getCurrentHuman,
    setCurrentTurn,
    setCurrentPlayer,
    setGameOver,
    setCurrentHuman,
    setWinner,
    switchTurnPlayer,
    checkWinner,
    checkDraw,
  };
})();
