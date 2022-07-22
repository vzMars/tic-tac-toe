class Player {
  constructor(mark) {
    this._mark = mark;
  }

  get mark() {
    return this._mark;
  }
}

class GameBoard {
  constructor() {
    this._board = ['', '', '', '', '', '', '', '', ''];
    this._currentPlayer = player1.mark;
    this._winner = false;
    this._gameOver = false;
  }

  get board() {
    return this._board;
  }

  get currentPlayer() {
    return this._currentPlayer;
  }

  set currentPlayer(current) {
    if (current === player1.mark) {
      this._currentPlayer = player2.mark;
    } else {
      this._currentPlayer = player1.mark;
    }
  }

  get winner() {
    return this._winner;
  }

  set winner(status) {
    this._winner = status;
  }

  get gameOver() {
    return this._gameOver;
  }

  set gameOver(status) {
    this._gameOver = status;
  }

  placeMarker(index) {
    if (!this.board[index]) {
      this.board[index] = this.currentPlayer;
      if (this.checkWinner()) {
        this.winner = true;
        this.gameOver = true;
      } else if (this.board.every((item) => item)) {
        this.gameOver = true;
      } else {
        this.currentPlayer = this.currentPlayer;
        UI.activePlayer();
      }
    }
    UI.gameStatus();
    UI.displayBoard();
  }

  checkWinner() {
    return (
      this.checkHorizontal() ||
      this.checkVertical() ||
      this.checkDiagonal(0, 4) ||
      this.checkDiagonal(2, 2)
    );
  }

  checkHorizontal() {
    for (let i = 0; i <= 6; i += 3) {
      if (
        this.board[i] === this.currentPlayer &&
        this.board[i + 1] === this.currentPlayer &&
        this.board[i + 2] === this.currentPlayer
      ) {
        return true;
      }
    }
    return false;
  }

  checkVertical() {
    for (let i = 0; i <= 2; i++) {
      if (
        this.board[i] === this.currentPlayer &&
        this.board[i + 3] === this.currentPlayer &&
        this.board[i + 6] === this.currentPlayer
      ) {
        return true;
      }
    }
    return false;
  }

  checkDiagonal(i, acc) {
    return (
      this.board[i] === this.currentPlayer &&
      this.board[i + acc] === this.currentPlayer &&
      this.board[i + acc * 2] === this.currentPlayer
    );
  }

  resetGame() {
    const players = document.querySelectorAll('.player');
    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = '';
    }

    players.forEach((player) => {
      if (player.classList.contains('active')) {
        player.classList.toggle('active');
      }
    });
    players[0].classList.toggle('active');

    this.currentPlayer = player2.mark;
    this.winner = false;
    this.gameOver = false;

    UI.gameStatus();
    UI.displayBoard();
  }
}

class UI {
  static displayBoard() {
    const squares = document.querySelectorAll('.square');
    squares.forEach((square, i) => {
      const span = document.createElement('span');
      const marker = gameBoard.board[i];

      square.innerHTML = '';
      span.className = marker.toLowerCase();
      span.textContent = marker;

      square.appendChild(span);
    });
  }

  static activePlayer() {
    const active = document.querySelector('.player.active');

    active.classList.toggle('active');
    if (active.nextElementSibling) {
      active.nextElementSibling.classList.toggle('active');
    } else {
      active.previousElementSibling.classList.toggle('active');
    }
  }

  static gameStatus() {
    const h1 = document.querySelector('h1');

    if (gameBoard.winner) {
      h1.textContent = `Player ${gameBoard.currentPlayer} has won!`;
    } else if (gameBoard.gameOver) {
      h1.textContent = "It's a draw!";
    } else {
      h1.textContent = `Player ${gameBoard.currentPlayer}'s turn!`;
    }
  }
}

const player1 = new Player('X');
const player2 = new Player('O');
const gameBoard = new GameBoard();
document.addEventListener('DOMContentLoaded', UI.gameStatus);
document.querySelector('.board').addEventListener('click', (e) => {
  if (e.target.classList.contains('square') && !gameBoard.gameOver) {
    gameBoard.placeMarker(e.target.id);
  }
});
document.querySelector('button').addEventListener('click', () => {
  gameBoard.resetGame();
});
