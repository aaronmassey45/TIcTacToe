$(document).ready(function() {
  let grid = Array(9).fill(null);
  const p1 = { xo: '', winCount: 0 };
  const p2 = { xo: '', winCount: 0, isComputer: false, isComputerTurn: false };
  var numPlayers = 0; //stores number of players
  var turn = 0; //turn counter
  var prefix = 'grid';
  var el; //used with prefix to set mark on a grid position
  var empty = ['6', '2', '0', '1', '3', '4', '8', '5', '7']; //array for empty grid spaces
  var lastDigit; //gets the digit off grid id
  var p1Mark = [],
    p2Mark = []; //stores p1 and p2/AI's marks
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
        checkWin(grid); //checks to see if p1 has won
        if (win === true) {
          return;
        }
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
        $('#gameboard').css('pointer-events', 'none'); //disables clicking during computer turn
        lastDigit = this.id.substr(-1); //grabs digit from grid id
        setTimeout(function() {
          grid[lastDigit] = p1.xo;
          //p1Mark.push(lastDigit); //adds grid location to array of p1 marks
          empty.splice(empty.indexOf(lastDigit), 1); //removes the clicked location from array of empty spots
          almostWin(); //checks to see if user/AI has almost won before AI chooses a spot and if not sets computerGo to 1
          if (p2.isComputerTurn === true) {
            //denotes that it is the AI's turn and user/AI is not in a position to win
            el = document.getElementById(prefix + empty[0]); //sets el as the id of the first grid space in empty array
            $(el).html(p2.xo); //puts AI mark at el
            grid[empty.shift()] = p2.xo;
          }
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
  function almostWin() {
    //check AI's positions first
    if (p2Mark.includes('0') && p2Mark.includes('1') && empty.includes('2')) {
      $('#grid2').html(p2.xo);
    } else if (
      p2Mark.includes('0') &&
      p2Mark.includes('2') &&
      empty.includes('1')
    ) {
      $('#grid1').html(p2.xo);
    } else if (
      p2Mark.includes('0') &&
      p2Mark.includes('3') &&
      empty.includes('6')
    ) {
      $('#grid6').html(p2.xo);
    } else if (
      p2Mark.includes('0') &&
      p2Mark.includes('4') &&
      empty.includes('8')
    ) {
      $('#grid8').html(p2.xo);
    } else if (
      p2Mark.includes('0') &&
      p2Mark.includes('6') &&
      empty.includes('3')
    ) {
      $('#grid3').html(p2.xo);
    } else if (
      p2Mark.includes('0') &&
      p2Mark.includes('8') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2.xo);
    }

    //1's
    else if (
      p2Mark.includes('1') &&
      p2Mark.includes('2') &&
      empty.includes('0')
    ) {
      $('#grid0').html(p2.xo);
    } else if (
      p2Mark.includes('1') &&
      p2Mark.includes('4') &&
      empty.includes('7')
    ) {
      $('#grid7').html(p2.xo);
    } else if (
      p2Mark.includes('1') &&
      p2Mark.includes('7') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2.xo);
    }

    //2's
    else if (
      p2Mark.includes('2') &&
      p2Mark.includes('6') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2.xo);
    } else if (
      p2Mark.includes('2') &&
      p2Mark.includes('4') &&
      empty.includes('6')
    ) {
      $('#grid6').html(p2.xo);
    } else if (
      p2Mark.includes('2') &&
      p2Mark.includes('5') &&
      empty.includes('8')
    ) {
      $('#grid8').html(p2.xo);
    } else if (
      p2Mark.includes('2') &&
      p2Mark.includes('8') &&
      empty.includes('5')
    ) {
      $('#grid5').html(p2.xo);
    }

    //3's
    else if (
      p2Mark.includes('3') &&
      p2Mark.includes('4') &&
      empty.includes('5')
    ) {
      $('#grid5').html(p2.xo);
    } else if (
      p2Mark.includes('3') &&
      p2Mark.includes('5') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2.xo);
    } else if (
      p2Mark.includes('3') &&
      p2Mark.includes('6') &&
      empty.includes('0')
    ) {
      $('#grid0').html(p2.xo);
    }

    //4's
    else if (
      p2Mark.includes('4') &&
      p2Mark.includes('5') &&
      empty.includes('3')
    ) {
      $('#grid3').html(p2.xo);
    } else if (
      p2Mark.includes('4') &&
      p2Mark.includes('6') &&
      empty.includes('2')
    ) {
      $('#grid2').html(p2.xo);
    } else if (
      p2Mark.includes('4') &&
      p2Mark.includes('7') &&
      empty.includes('1')
    ) {
      $('#grid1').html(p2.xo);
    } else if (
      p2Mark.includes('4') &&
      p2Mark.includes('8') &&
      empty.includes('0')
    ) {
      $('#grid0').html(p2.xo);
    }

    //6
    else if (
      p2Mark.includes('6') &&
      p2Mark.includes('7') &&
      empty.includes('8')
    ) {
      $('#grid8').html(p2.xo);
    }

    //8's
    else if (
      p2Mark.includes('8') &&
      p2Mark.includes('5') &&
      empty.includes('2')
    ) {
      $('#grid2').html(p2.xo);
    } else if (
      p2Mark.includes('8') &&
      p2Mark.includes('6') &&
      empty.includes('7')
    ) {
      $('#grid7').html(p2.xo);
    } else if (
      p2Mark.includes('8') &&
      p2Mark.includes('7') &&
      empty.includes('6')
    ) {
      $('#grid6').html(p2.xo);
    }

    //check p1's positions
    else if (
      p1Mark.includes('0') &&
      p1Mark.includes('1') &&
      empty.includes('2')
    ) {
      $('#grid2').html(p2.xo);
      empty.splice(empty.indexOf('2'), 1);
      p2Mark.push('2');
    } else if (
      p1Mark.includes('0') &&
      p1Mark.includes('2') &&
      empty.includes('1')
    ) {
      $('#grid1').html(p2.xo);
      empty.splice(empty.indexOf('1'), 1);
      p2Mark.push('1');
    } else if (
      p1Mark.includes('0') &&
      p1Mark.includes('3') &&
      empty.includes('6')
    ) {
      $('#grid6').html(p2.xo);
      empty.splice(empty.indexOf('6'), 1);
      p2Mark.push('6');
    } else if (
      p1Mark.includes('0') &&
      p1Mark.includes('4') &&
      empty.includes('8')
    ) {
      $('#grid8').html(p2.xo);
      empty.splice(empty.indexOf('8'), 1);
      p2Mark.push('8');
    } else if (
      p1Mark.includes('0') &&
      p1Mark.includes('6') &&
      empty.includes('3')
    ) {
      $('#grid3').html(p2.xo);
      empty.splice(empty.indexOf('3'), 1);
      p2Mark.push('3');
    } else if (
      p1Mark.includes('0') &&
      p1Mark.includes('8') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2.xo);
      empty.splice(empty.indexOf('4'), 1);
      p2Mark.push('4');
    }

    //1's
    else if (
      p1Mark.includes('1') &&
      p1Mark.includes('2') &&
      empty.includes('0')
    ) {
      $('#grid0').html(p2.xo);
      empty.splice(empty.indexOf('0'), 1);
      p2Mark.push('0');
    } else if (
      p1Mark.includes('1') &&
      p1Mark.includes('4') &&
      empty.includes('7')
    ) {
      $('#grid7').html(p2.xo);
      empty.splice(empty.indexOf('7'), 1);
      p2Mark.push('7');
    } else if (
      p1Mark.includes('1') &&
      p1Mark.includes('7') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2.xo);
      empty.splice(empty.indexOf('4'), 1);
      p2Mark.push('4');
    }

    //2's
    else if (
      p1Mark.includes('2') &&
      p1Mark.includes('6') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2.xo);
      empty.splice(empty.indexOf('4'), 1);
      p2Mark.push('4');
    } else if (
      p1Mark.includes('2') &&
      p1Mark.includes('4') &&
      empty.includes('6')
    ) {
      $('#grid6').html(p2.xo);
      empty.splice(empty.indexOf('6'), 1);
      p2Mark.push('6');
    } else if (
      p1Mark.includes('2') &&
      p1Mark.includes('5') &&
      empty.includes('8')
    ) {
      $('#grid8').html(p2.xo);
      empty.splice(empty.indexOf('8'), 1);
      p2Mark.push('8');
    } else if (
      p1Mark.includes('2') &&
      p1Mark.includes('8') &&
      empty.includes('5')
    ) {
      $('#grid5').html(p2.xo);
      empty.splice(empty.indexOf('5'), 1);
      p2Mark.push('5');
    }

    //3's
    else if (
      p1Mark.includes('3') &&
      p1Mark.includes('4') &&
      empty.includes('5')
    ) {
      $('#grid5').html(p2.xo);
      empty.splice(empty.indexOf('5'), 1);
      p2Mark.push('5');
    } else if (
      p1Mark.includes('3') &&
      p1Mark.includes('5') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2.xo);
      empty.splice(empty.indexOf('4'), 1);
      p2Mark.push('4');
    } else if (
      p1Mark.includes('3') &&
      p1Mark.includes('6') &&
      empty.includes('0')
    ) {
      $('#grid0').html(p2.xo);
      empty.splice(empty.indexOf('0'), 1);
      p2Mark.push('0');
    }

    //4's
    else if (
      p1Mark.includes('4') &&
      p1Mark.includes('5') &&
      empty.includes('3')
    ) {
      $('#grid3').html(p2.xo);
      empty.splice(empty.indexOf('3'), 1);
      p2Mark.push('3');
    } else if (
      p1Mark.includes('4') &&
      p1Mark.includes('6') &&
      empty.includes('2')
    ) {
      $('#grid2').html(p2.xo);
      empty.splice(empty.indexOf('2'), 1);
      p2Mark.push('2');
    } else if (
      p1Mark.includes('4') &&
      p1Mark.includes('7') &&
      empty.includes('1')
    ) {
      $('#grid1').html(p2.xo);
      empty.splice(empty.indexOf('1'), 1);
      p2Mark.push('1');
    } else if (
      p1Mark.includes('4') &&
      p1Mark.includes('8') &&
      empty.includes('0')
    ) {
      $('#grid0').html(p2.xo);
      empty.splice(empty.indexOf('0'), 1);
      p2Mark.push('0');
    }

    //6
    else if (
      p1Mark.includes('6') &&
      p1Mark.includes('7') &&
      empty.includes('8')
    ) {
      $('#grid8').html(p2.xo);
      empty.splice(empty.indexOf('8'), 1);
      p2Mark.push('8');
    }

    //8's
    else if (
      p1Mark.includes('8') &&
      p1Mark.includes('5') &&
      empty.includes('2')
    ) {
      $('#grid2').html(p2.xo);
      empty.splice(empty.indexOf('2'), 1);
      p2Mark.push('2');
    } else if (
      p1Mark.includes('8') &&
      p1Mark.includes('6') &&
      empty.includes('7')
    ) {
      $('#grid7').html(p2.xo);
      empty.splice(empty.indexOf('7'), 1);
      p2Mark.push('7');
    } else if (
      p1Mark.includes('8') &&
      p1Mark.includes('7') &&
      empty.includes('6')
    ) {
      $('#grid6').html(p2.xo);
      empty.splice(empty.indexOf('6'), 1);
      p2Mark.push('6');
    }

    // if none
    else {
      p2.isComputerTurn = true;
    }
  }

  //RESET FUNCTION TO RESET GAME AFTER A WIN OR DRAW
  function reset() {
    win = false;
    turn = 0;
    grid = Array(9).fill(null);
    empty = ['6', '2', '0', '1', '3', '4', '8', '5', '7'];
    p1Mark = [];
    p2Mark = [];

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
    computerWinCount = 0;
    grid = Array(9).fill(null);
    empty = ['6', '2', '0', '1', '3', '4', '8', '5', '7'];
    p1Mark = [];
    p2Mark = [];

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
        computerWinCount++;
        $('.aiORp2WinCount').html(computerWinCount);
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
