const Player = (mark) => {
  const getMark = () => mark;
  return { getMark };
};

const playerX = Player('X');
const playerO = Player('O');

const displayController = (() => {
  const _squares = Array.from(document.querySelectorAll('.square'));

  document.getElementById('gameboard').addEventListener('click', (event) => {
    console.log(event.target);
    let index = _squares.findIndex((_square) => {
      return _square === event.target;
    });
    gameBoard.addMark(index);
    render();
  });

  const render = () => {
    gameBoard.getBoard().forEach((mark, index) => {
      _squares[index].textContent = mark;
    });
  };

  return {
    render,
  };
})();

const gameBoard = (() => {
  const _board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => _board;

  const clearBoard = () => {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = '';
    }
  };

  const addMark = (index) => {
    _board[index] = gameLogic.getCurrentTurn();
    gameLogic.setCurrentTurn();
    console.log(_board);
  };

  return { getBoard, clearBoard, addMark };
})();

const gameLogic = (() => {
  let _currentTurn = playerX.getMark();

  const getCurrentTurn = () => _currentTurn;

  const setCurrentTurn = () => {
    if (getCurrentTurn() === 'X') {
      _currentTurn = playerO.getMark();
    } else {
      _currentTurn = playerX.getMark();
    }
  };

  return { getCurrentTurn, setCurrentTurn };
})();
