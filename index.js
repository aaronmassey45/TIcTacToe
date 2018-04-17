$(document).ready(function() {
  let grid = Array(9).fill(null);
  const p1 = { xo: '', winCount: 0 };
  const p2 = { xo: '', winCount: 0, isComputer: false, isComputerTurn: false };
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
  let numPlayers = 0; //stores number of players
  let turn = 0; //turn counter
  let prefix = 'grid';
  let el; //used with prefix to set mark on a grid position
  let empty = ['6', '2', '0', '1', '3', '4', '8', '5', '7']; //array for empty grid spaces
  let lastDigit; //gets the digit off grid id
  let win; //variable to stop game if there is a win or draw
  let turnTime = 350;

  //CHOOSES NUMBER OF PLAYERS
  $('#oneP').click(function() {
    numPlayers = 1;
    $('#players').hide();
    $('#xo').show();
    $('.aiORp2').html('Computer');
  });
  $('#twoP').click(function() {
    numPlayers = 2;
    $('#players').hide();
    $('#xo').show();
    $('.aiORp2').html('Player 2');
  });

  //P1 CHOOSES X OR O
  $('#X').click(function() {
    p1.xo = 'X';
    p2.xo = 'O';
    $('#xo').hide();
    $('#gameboard').show();
    $('.playerOneTurn').animate(
      {
        width: 'toggle',
      },
      turnTime
    );
    $('.winCount').fadeTo('slow', 1);
  });
  $('#O').click(function() {
    p1.xo = 'O';
    p2.xo = 'X';
    $('#xo').hide();
    $('#gameboard').show();
    $('.playerOneTurn').animate(
      {
        width: 'toggle',
      },
      turnTime
    );
    $('.winCount').fadeTo('slow', 1);
  });

  //RESET BUTTON LOGIC
  $('#resetbtn').click(function() {
    resetAll();
  });

  $('td').on('click', function() {
    //GAMEPLAY FOR ONE PLAYER
    if (numPlayers === 1 && turn < 9) {
      if ($(this).html() === '') {
        //makes sure spot is empty first
        p2.isComputerTurn = false;
        $(this).html(p1.xo); //sets p1 marker at the clicked location
        turn++; //increments turn
        lastDigit = this.id.substr(-1); //grabs digit from grid id
        grid[lastDigit] = p1.xo;
        checkWin(grid); //checks to see if p1 has won
        if (win === true) {
          return;
        }
        $('.playerOneTurn').animate({ width: 'toggle' }, turnTime);
        $('.playerTwoTurn').animate({ width: 'toggle' }, turnTime);
        $('#gameboard').css('pointer-events', 'none'); //disables clicking during computer turn
        setTimeout(function() {
          const spot = chooseAiSquare(grid);
          el = document.getElementById(prefix + spot); //sets el
          $(el).html(p2.xo); //puts AI mark at el
          grid[spot] = p2.xo;
          $('.playerOneTurn').animate({ width: 'toggle' }, turnTime);
          $('.playerTwoTurn').animate({ width: 'toggle' }, turnTime);
          $('#gameboard').css('pointer-events', 'auto'); //re-enables clicking after computer turn
          turn++; //increments turn
          checkWin(grid); //checks to see if AI has won
        }, 1200);
      }
    }

    //GAMEPLAY FOR TWO PLAYERS
    else if (numPlayers === 2 && turn < 9) {
      if (turn % 2 === 0) {
        //if turn is even, p1 goes
        if ($(this).html() === '') {
          $(this).html(p1.xo); //sets p1 marker at the clicked location
          turn++; //increments turn
          $('.playerOneTurn').animate(
            {
              width: 'toggle',
            },
            turnTime
          );
          $('.playerTwoTurn').animate(
            {
              width: 'toggle',
            },
            turnTime
          );
          checkWin(grid); //checks if p1 has won
          if (win === true) {
            return;
          }
        }
      } else {
        //if turn is odd, p2 goes
        if ($(this).html() === '') {
          $(this).html(p2.xo); //sets p2 marker at the clicked location
          turn++; //increments turn
          $('.playerOneTurn').animate(
            {
              width: 'toggle',
            },
            turnTime
          );
          $('.playerTwoTurn').animate(
            {
              width: 'toggle',
            },
            turnTime
          );
          checkWin(grid); //checks if p2 has won
        }
      }
    }
  });

  //checkWin FUNCTION
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

  //Chooses where AI marks on the grid if p1 or AI is about to win
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
    return empty.shift();
  }

  //RESET FUNCTION TO RESET GAME AFTER A WIN OR DRAW
  function reset() {
    win = false;
    turn = 0;
    grid = Array(9).fill(null);
    empty = ['6', '2', '0', '1', '3', '4', '8', '5', '7'];

    for (i = 0; (el = document.getElementById(prefix + i)); i++) {
      $(el).html('');
    }
    $('#gameboard').show();
    $('.playerOneTurn').animate(
      {
        width: 'toggle',
      },
      turnTime
    );
    return (turn = 0);
  }

  //RESET FUNCTION TO RESET EVERYTHING
  function resetAll() {
    numPlayers = 0;
    p1.xo = '';
    p2.xo = '';
    win = false;
    turn = 0;
    p1.winCount = 0;
    p2.winCount = 0;
    grid = Array(9).fill(null);
    empty = ['6', '2', '0', '1', '3', '4', '8', '5', '7'];

    $('.p1WinCount').html('0');
    $('.aiORp2WinCount').html('0');

    for (i = 0; (el = document.getElementById(prefix + i)); i++) {
      $(el).html('');
    }
    $('#gameboard').hide();
    $('#xo').hide();
    $('#winner').hide();
    $('#players').show();
    $('.playerOneTurn').hide();
    $('.playerTwoTurn').hide();
    $('.winCount').fadeTo('slow', 0);

    return (turn = 0);
  }

  //WHAT TO DO IN DIFFERENT WIN/DRAW SCENARIOS
  function displayWinner(pos1, pos2, pos3) {
    win = true;
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

      $(`.p${winVariables.player}WinCount`).html(winVariables.winCount);
      $('#gameboard, .playerOneTurn, .playerTwoTurn').hide();
      $('#winner')
        .html(`Player ${winVariables.player} wins!`)
        .fadeIn()
        .fadeOut(1250);
      setTimeout(function() {
        reset();
      }, 2001);
    }, 1500);
  }

  function noWin() {
    win = true;
    $('#gameboard').hide();
    $('.playerOneTurn').hide();
    $('.playerTwoTurn').hide();
    $('#winner')
      .html("It's a draw!")
      .fadeIn()
      .fadeOut(1000);
    setTimeout(function() {
      reset();
    }, 2001);
  }
});
