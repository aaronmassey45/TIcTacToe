$(document).ready(function() {
  const p1 = { xo: '', winCount: 0 };
  const p2 = { xo: '', winCount: 0 };
  const turnTime = 350;
  const game = {
    isGameOver: false,
    isTwoPlayers: false,
    turn: 0,
  };
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let grid = Array(9).fill(null);
  let aiSequence = ['6', '2', '0', '1', '3', '4', '8', '5', '7']; //array for ai moves

  $('#oneP, #twoP').click(function() {
    game.isTwoPlayers = this.id === 'twoP';
    $('#players').hide();
    $('#xo').show();
    $('.p2').text(game.isTwoPlayers ? 'Player 2' : 'Computer');
  });

  $('#X, #O').click(function() {
    if (this.id === 'X') {
      p1.xo = 'X';
      p2.xo = 'O';
    } else {
      p1.xo = 'O';
      p2.xo = 'X';
    }

    $('#xo').hide();
    $('#gameboard').show();
    $('.playerOneTurn').animate({ width: 'toggle' }, turnTime);
    $('.winCount').fadeTo('slow', 1);
  });

  $('#resetbtn').click(reset);

  $('#gameboard td').on('click', function() {
    const hasError = handleClick(this);
    if (hasError) return;
    checkWin(grid);

    if (!game.isTwoPlayers && !game.isGameOver) {
      $('#gameboard').css('pointer-events', 'none'); //disables clicking during computer turn
      setTimeout(handleAiTurn, 1200);
    }
  });

  function handleClick(element) {
    if (!$(element).text()) {
      const isPlayerTwo = game.isTwoPlayers && game.turn % 2 === 0;
      isPlayerTwo ? $(element).text(p2.xo) : $(element).text(p1.xo);
      game.turn += 1;
      if (game.turn > 8) return handleGameOver("It's a draw!");
      $('.playerOneTurn, .playerTwoTurn').animate(
        { width: 'toggle' },
        turnTime
      );
      const lastDigit = element.id.substr(-1);
      grid[lastDigit] = isPlayerTwo ? p2.xo : p1.xo;
      return false;
    }
    return true;
  }

  function handleAiTurn() {
    const spot = chooseAiSquare(grid);
    $(`#grid${spot}`).html(p2.xo);
    grid[spot] = p2.xo;
    $('.playerOneTurn, .playerTwoTurn').animate({ width: 'toggle' }, turnTime);
    game.turn += 1;
    if (game.turn > 8) return handleGameOver("It's a draw!");
    checkWin(grid);
    $('#gameboard').css('pointer-events', 'auto');
  }

  function checkWin(squares) {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return displayWinner(a, b, c);
      }
    }
    return null;
  }

  function chooseAiSquare(squares) {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[c] === null) {
        return c;
      } else if (
        squares[a] &&
        squares[a] === squares[c] &&
        squares[b] === null
      ) {
        return b;
      } else if (
        squares[b] &&
        squares[b] === squares[c] &&
        squares[a] === null
      ) {
        return a;
      }
    }
    for (let i = 0; i < aiSequence.length; i++) {
      const spot = aiSequence[i];
      if (grid[spot] === null) return spot;
      aiSequence.splice(i, 1);
    }
  }

  function clearBoard() {
    game.turn = 0;
    game.isGameOver = false;
    grid = Array(9).fill(null);
    aiSequence = ['6', '2', '0', '1', '3', '4', '8', '5', '7'];

    for (let i = 0; i < 9; i++) {
      $(`#grid${i}`).text('');
    }
  }

  function newGame() {
    clearBoard();
    $('#gameboard').show();
    $('.playerOneTurn').animate({ width: 'toggle' }, turnTime);
  }

  function reset() {
    clearBoard();
    game.isTwoPlayers = false;
    p1.xo = '';
    p2.xo = '';
    p1.winCount = 0;
    p2.winCount = 0;

    $('.p1WinCount, .p2WinCount').text('0');
    $('#gameboard, #xo, #winner, .playerOneTurn, .playerTwoTurn').hide();
    $('#players').show();
    $('.winCount').fadeTo('slow', 0);
  }

  function handleGameOver(msg) {
    game.isGameOver = true;
    $('#gameboard, .playerOneTurn, .playerTwoTurn').hide();
    $('#winner')
      .text(msg)
      .fadeIn()
      .fadeOut(1500);
    setTimeout(newGame, 2001);
  }

  function displayWinner(pos1, pos2, pos3) {
    game.isGameOver = true;
    const positions = `#grid${pos1}, #grid${pos2}, #grid${pos3}`;
    const winVariables = {};

    if (grid[pos1] === p1.xo) {
      p1.winCount++;
      winVariables.player = '1';
      winVariables.winCount = p1.winCount;
    } else {
      p2.winCount++;
      winVariables.player = '2';
      winVariables.winCount = p2.winCount;
    }
    $(positions).css({ 'background-color': 'black', color: 'white' });

    setTimeout(function() {
      $(positions).css({ 'background-color': 'transparent', color: 'red' });

      $(`.p${winVariables.player}WinCount`).text(winVariables.winCount);
      handleGameOver(`Player ${winVariables.player} wins!`);
    }, 1500);
  }
});
