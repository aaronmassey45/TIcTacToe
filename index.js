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
  var numPlayers = 0; //stores number of players
  var turn = 0; //turn counter
  var prefix = 'grid';
  var el; //used with prefix to set mark on a grid position
  var empty = ['6', '2', '0', '1', '3', '4', '8', '5', '7']; //array for empty grid spaces
  var lastDigit; //gets the digit off grid id
  var win; //variable to stop game if there is a win or draw
  var turnTime = 350;

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
        return p1Win(a, b, c);
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
  function p1Win(x1, x2, x3) {
    win = true;
    p1.winCount++;

    $('#' + prefix + x1).css('background-color', 'black');
    $('#' + prefix + x2).css('background-color', 'black');
    $('#' + prefix + x3).css('background-color', 'black');

    $('#' + prefix + x1).css('color', 'white');
    $('#' + prefix + x2).css('color', 'white');
    $('#' + prefix + x3).css('color', 'white');

    setTimeout(function() {
      $('#' + prefix + x1).css('background-color', 'transparent');
      $('#' + prefix + x2).css('background-color', 'transparent');
      $('#' + prefix + x3).css('background-color', 'transparent');

      $('#' + prefix + x1).css('color', 'red');
      $('#' + prefix + x2).css('color', 'red');
      $('#' + prefix + x3).css('color', 'red');

      $('.p1WinCount').html(p1.winCount);
      $('#gameboard').hide();
      $('.playerOneTurn').hide();
      $('.playerTwoTurn').hide();
      $('#winner')
        .html('Player 1 wins!')
        .fadeIn()
        .fadeOut(1000);
      setTimeout(function() {
        reset();
      }, 2001);
    }, 1500);
  }

  function p2Win(x1, x2, x3) {
    win = true;

    $('#' + prefix + x1).css('background-color', 'black');
    $('#' + prefix + x2).css('background-color', 'black');
    $('#' + prefix + x3).css('background-color', 'black');

    $('#' + prefix + x1).css('color', 'white');
    $('#' + prefix + x2).css('color', 'white');
    $('#' + prefix + x3).css('color', 'white');

    setTimeout(function() {
      $('#' + prefix + x1).css('background-color', 'transparent');
      $('#' + prefix + x2).css('background-color', 'transparent');
      $('#' + prefix + x3).css('background-color', 'transparent');

      $('#' + prefix + x1).css('color', 'red');
      $('#' + prefix + x2).css('color', 'red');
      $('#' + prefix + x3).css('color', 'red');

      $('#gameboard').hide();
      $('.playerOneTurn').hide();
      $('.playerTwoTurn').hide();
      if (numPlayers === 1) {
        $('#winner')
          .html('Computer wins!')
          .fadeIn()
          .fadeOut(1000);
        p2.winCount++;
        $('.aiORp2WinCount').html(p2.winCount);
      } else if (numPlayers === 2) {
        $('#winner')
          .html('Player 2 wins!')
          .fadeIn()
          .fadeOut(1000);
        p2.winCount++;
        $('.aiORp2WinCount').html(p2.winCount);
      }
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
