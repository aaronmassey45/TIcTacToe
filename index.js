$(document).ready(function() {
  var numPlayers = 0; //stores number of players
  var p1xo, p2xo; //stores p1 and p2 as 'X' or 'O'
  var turn = 0; //turn counter
  var prefix = 'grid';
  var el; //used with prefix to set mark on a grid position
  var spots = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //array of spots for checkWin conditions
  var empty = ['6', '2', '0', '1', '3', '4', '8', '5', '7']; //array for empty grid spaces
  var lastDigit; //gets the digit off grid id
  var p1Mark = [],
    p2Mark = []; //stores p1 and p2/AI's marks
  var computerGo; //true/false variable for the AI turn
  var win; //variable to stop game if there is a win or draw
  var turnTime = 350;
  var p1WinCount = 0,
    p2WinCount = 0,
    computerWinCount = 0;

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
    p1xo = 'X';
    p2xo = 'O';
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
    p1xo = 'O';
    p2xo = 'X';
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
        computerGo = false;
        $(this).html(p1xo); //sets p1 marker at the clicked location
        turn++; //increments turn
        checkWin(); //checks to see if p1 has won
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
          p1Mark.push(lastDigit); //adds grid location to array of p1 marks
          empty.splice(empty.indexOf(lastDigit), 1); //removes the clicked location from array of empty spots
          almostWin(); //checks to see if user/AI has almost won before AI chooses a spot and if not sets computerGo to 1
          if (computerGo === true) {
            //denotes that it is the AI's turn and user/AI is not in a position to win
            el = document.getElementById(prefix + empty[0]); //sets el as the id of the first grid space in empty array
            $(el).html(p2xo); //puts AI mark at el
            p2Mark.push(empty.shift()); //removes first value from empty and adds to p2mark
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
          checkWin(); //checks to see if AI has won
        }, 1200);
      }
    }

    //GAMEPLAY FOR TWO PLAYERS
    else if (numPlayers === 2 && turn < 9) {
      if (turn % 2 === 0) {
        //if turn is even, p1 goes
        if ($(this).html() === '') {
          $(this).html(p1xo); //sets p1 marker at the clicked location
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
          checkWin(); //checks if p1 has won
          if (win === true) {
            return;
          }
        }
      } else {
        //if turn is odd, p2 goes
        if ($(this).html() === '') {
          $(this).html(p2xo); //sets p2 marker at the clicked location
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
          checkWin(); //checks if p2 has won
        }
      }
    }
  });

  //checkWin FUNCTION
  function checkWin() {
    for (var i = 0; (el = document.getElementById(prefix + i)); i++) {
      //since prefix is 'grid', checks from grid0 - grid9
      if ($(el).html() === p1xo) {
        //if that grid space = p1
        spots.splice(i, 1, 1); //replace the 0 in spots array with a 1 at i's location
      } else if ($(el).html() === p2xo) {
        //if that grid space = p2
        spots.splice(i, 1, 2); //replace the 0 in spots array with a 2 at i's location
      }
    }
    //Goes through all possible win combinations and displays winner if conditions met
    if (spots[0] === 1 && spots[1] === 1 && spots[2] === 1) {
      p1Win(0, 1, 2);
    } else if (spots[3] === 1 && spots[4] === 1 && spots[5] === 1) {
      p1Win(3, 4, 5);
    } else if (spots[6] === 1 && spots[7] === 1 && spots[8] === 1) {
      p1Win(6, 7, 8);
    } else if (spots[0] === 1 && spots[3] === 1 && spots[6] === 1) {
      p1Win(0, 3, 6);
    } else if (spots[1] === 1 && spots[4] === 1 && spots[7] === 1) {
      p1Win(1, 4, 7);
    } else if (spots[2] === 1 && spots[5] === 1 && spots[8] === 1) {
      p1Win(2, 5, 8);
    } else if (spots[0] === 1 && spots[4] === 1 && spots[8] === 1) {
      p1Win(0, 4, 8);
    } else if (spots[2] === 1 && spots[4] === 1 && spots[6] === 1) {
      p1Win(2, 4, 6);
    } else if (spots[0] === 2 && spots[1] === 2 && spots[2] === 2) {
      p2Win(0, 1, 2);
    } else if (spots[3] === 2 && spots[4] === 2 && spots[5] === 2) {
      p2Win(3, 4, 5);
    } else if (spots[6] === 2 && spots[7] === 2 && spots[8] === 2) {
      p2Win(6, 7, 8);
    } else if (spots[0] === 2 && spots[3] === 2 && spots[6] === 2) {
      p2Win(0, 3, 6);
    } else if (spots[1] === 2 && spots[4] === 2 && spots[7] === 2) {
      p2Win(1, 4, 7);
    } else if (spots[2] === 2 && spots[5] === 2 && spots[8] === 2) {
      p2Win(2, 5, 8);
    } else if (spots[0] === 2 && spots[4] === 2 && spots[8] === 2) {
      p2Win(0, 4, 8);
    } else if (spots[2] === 2 && spots[4] === 2 && spots[6] === 2) {
      p2Win(2, 4, 6);
    } else if (turn === 9) {
      noWin();
    }
  }

  //Chooses where AI marks on the grid if p1 or AI is about to win
  function almostWin() {
    //check AI's positions first
    if (p2Mark.includes('0') && p2Mark.includes('1') && empty.includes('2')) {
      $('#grid2').html(p2xo);
    } else if (
      p2Mark.includes('0') &&
      p2Mark.includes('2') &&
      empty.includes('1')
    ) {
      $('#grid1').html(p2xo);
    } else if (
      p2Mark.includes('0') &&
      p2Mark.includes('3') &&
      empty.includes('6')
    ) {
      $('#grid6').html(p2xo);
    } else if (
      p2Mark.includes('0') &&
      p2Mark.includes('4') &&
      empty.includes('8')
    ) {
      $('#grid8').html(p2xo);
    } else if (
      p2Mark.includes('0') &&
      p2Mark.includes('6') &&
      empty.includes('3')
    ) {
      $('#grid3').html(p2xo);
    } else if (
      p2Mark.includes('0') &&
      p2Mark.includes('8') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2xo);
    }

    //1's
    else if (
      p2Mark.includes('1') &&
      p2Mark.includes('2') &&
      empty.includes('0')
    ) {
      $('#grid0').html(p2xo);
    } else if (
      p2Mark.includes('1') &&
      p2Mark.includes('4') &&
      empty.includes('7')
    ) {
      $('#grid7').html(p2xo);
    } else if (
      p2Mark.includes('1') &&
      p2Mark.includes('7') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2xo);
    }

    //2's
    else if (
      p2Mark.includes('2') &&
      p2Mark.includes('6') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2xo);
    } else if (
      p2Mark.includes('2') &&
      p2Mark.includes('4') &&
      empty.includes('6')
    ) {
      $('#grid6').html(p2xo);
    } else if (
      p2Mark.includes('2') &&
      p2Mark.includes('5') &&
      empty.includes('8')
    ) {
      $('#grid8').html(p2xo);
    } else if (
      p2Mark.includes('2') &&
      p2Mark.includes('8') &&
      empty.includes('5')
    ) {
      $('#grid5').html(p2xo);
    }

    //3's
    else if (
      p2Mark.includes('3') &&
      p2Mark.includes('4') &&
      empty.includes('5')
    ) {
      $('#grid5').html(p2xo);
    } else if (
      p2Mark.includes('3') &&
      p2Mark.includes('5') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2xo);
    } else if (
      p2Mark.includes('3') &&
      p2Mark.includes('6') &&
      empty.includes('0')
    ) {
      $('#grid0').html(p2xo);
    }

    //4's
    else if (
      p2Mark.includes('4') &&
      p2Mark.includes('5') &&
      empty.includes('3')
    ) {
      $('#grid3').html(p2xo);
    } else if (
      p2Mark.includes('4') &&
      p2Mark.includes('6') &&
      empty.includes('2')
    ) {
      $('#grid2').html(p2xo);
    } else if (
      p2Mark.includes('4') &&
      p2Mark.includes('7') &&
      empty.includes('1')
    ) {
      $('#grid1').html(p2xo);
    } else if (
      p2Mark.includes('4') &&
      p2Mark.includes('8') &&
      empty.includes('0')
    ) {
      $('#grid0').html(p2xo);
    }

    //6
    else if (
      p2Mark.includes('6') &&
      p2Mark.includes('7') &&
      empty.includes('8')
    ) {
      $('#grid8').html(p2xo);
    }

    //8's
    else if (
      p2Mark.includes('8') &&
      p2Mark.includes('5') &&
      empty.includes('2')
    ) {
      $('#grid2').html(p2xo);
    } else if (
      p2Mark.includes('8') &&
      p2Mark.includes('6') &&
      empty.includes('7')
    ) {
      $('#grid7').html(p2xo);
    } else if (
      p2Mark.includes('8') &&
      p2Mark.includes('7') &&
      empty.includes('6')
    ) {
      $('#grid6').html(p2xo);
    }

    //check p1's positions
    else if (
      p1Mark.includes('0') &&
      p1Mark.includes('1') &&
      empty.includes('2')
    ) {
      $('#grid2').html(p2xo);
      empty.splice(empty.indexOf('2'), 1);
      p2Mark.push('2');
    } else if (
      p1Mark.includes('0') &&
      p1Mark.includes('2') &&
      empty.includes('1')
    ) {
      $('#grid1').html(p2xo);
      empty.splice(empty.indexOf('1'), 1);
      p2Mark.push('1');
    } else if (
      p1Mark.includes('0') &&
      p1Mark.includes('3') &&
      empty.includes('6')
    ) {
      $('#grid6').html(p2xo);
      empty.splice(empty.indexOf('6'), 1);
      p2Mark.push('6');
    } else if (
      p1Mark.includes('0') &&
      p1Mark.includes('4') &&
      empty.includes('8')
    ) {
      $('#grid8').html(p2xo);
      empty.splice(empty.indexOf('8'), 1);
      p2Mark.push('8');
    } else if (
      p1Mark.includes('0') &&
      p1Mark.includes('6') &&
      empty.includes('3')
    ) {
      $('#grid3').html(p2xo);
      empty.splice(empty.indexOf('3'), 1);
      p2Mark.push('3');
    } else if (
      p1Mark.includes('0') &&
      p1Mark.includes('8') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2xo);
      empty.splice(empty.indexOf('4'), 1);
      p2Mark.push('4');
    }

    //1's
    else if (
      p1Mark.includes('1') &&
      p1Mark.includes('2') &&
      empty.includes('0')
    ) {
      $('#grid0').html(p2xo);
      empty.splice(empty.indexOf('0'), 1);
      p2Mark.push('0');
    } else if (
      p1Mark.includes('1') &&
      p1Mark.includes('4') &&
      empty.includes('7')
    ) {
      $('#grid7').html(p2xo);
      empty.splice(empty.indexOf('7'), 1);
      p2Mark.push('7');
    } else if (
      p1Mark.includes('1') &&
      p1Mark.includes('7') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2xo);
      empty.splice(empty.indexOf('4'), 1);
      p2Mark.push('4');
    }

    //2's
    else if (
      p1Mark.includes('2') &&
      p1Mark.includes('6') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2xo);
      empty.splice(empty.indexOf('4'), 1);
      p2Mark.push('4');
    } else if (
      p1Mark.includes('2') &&
      p1Mark.includes('4') &&
      empty.includes('6')
    ) {
      $('#grid6').html(p2xo);
      empty.splice(empty.indexOf('6'), 1);
      p2Mark.push('6');
    } else if (
      p1Mark.includes('2') &&
      p1Mark.includes('5') &&
      empty.includes('8')
    ) {
      $('#grid8').html(p2xo);
      empty.splice(empty.indexOf('8'), 1);
      p2Mark.push('8');
    } else if (
      p1Mark.includes('2') &&
      p1Mark.includes('8') &&
      empty.includes('5')
    ) {
      $('#grid5').html(p2xo);
      empty.splice(empty.indexOf('5'), 1);
      p2Mark.push('5');
    }

    //3's
    else if (
      p1Mark.includes('3') &&
      p1Mark.includes('4') &&
      empty.includes('5')
    ) {
      $('#grid5').html(p2xo);
      empty.splice(empty.indexOf('5'), 1);
      p2Mark.push('5');
    } else if (
      p1Mark.includes('3') &&
      p1Mark.includes('5') &&
      empty.includes('4')
    ) {
      $('#grid4').html(p2xo);
      empty.splice(empty.indexOf('4'), 1);
      p2Mark.push('4');
    } else if (
      p1Mark.includes('3') &&
      p1Mark.includes('6') &&
      empty.includes('0')
    ) {
      $('#grid0').html(p2xo);
      empty.splice(empty.indexOf('0'), 1);
      p2Mark.push('0');
    }

    //4's
    else if (
      p1Mark.includes('4') &&
      p1Mark.includes('5') &&
      empty.includes('3')
    ) {
      $('#grid3').html(p2xo);
      empty.splice(empty.indexOf('3'), 1);
      p2Mark.push('3');
    } else if (
      p1Mark.includes('4') &&
      p1Mark.includes('6') &&
      empty.includes('2')
    ) {
      $('#grid2').html(p2xo);
      empty.splice(empty.indexOf('2'), 1);
      p2Mark.push('2');
    } else if (
      p1Mark.includes('4') &&
      p1Mark.includes('7') &&
      empty.includes('1')
    ) {
      $('#grid1').html(p2xo);
      empty.splice(empty.indexOf('1'), 1);
      p2Mark.push('1');
    } else if (
      p1Mark.includes('4') &&
      p1Mark.includes('8') &&
      empty.includes('0')
    ) {
      $('#grid0').html(p2xo);
      empty.splice(empty.indexOf('0'), 1);
      p2Mark.push('0');
    }

    //6
    else if (
      p1Mark.includes('6') &&
      p1Mark.includes('7') &&
      empty.includes('8')
    ) {
      $('#grid8').html(p2xo);
      empty.splice(empty.indexOf('8'), 1);
      p2Mark.push('8');
    }

    //8's
    else if (
      p1Mark.includes('8') &&
      p1Mark.includes('5') &&
      empty.includes('2')
    ) {
      $('#grid2').html(p2xo);
      empty.splice(empty.indexOf('2'), 1);
      p2Mark.push('2');
    } else if (
      p1Mark.includes('8') &&
      p1Mark.includes('6') &&
      empty.includes('7')
    ) {
      $('#grid7').html(p2xo);
      empty.splice(empty.indexOf('7'), 1);
      p2Mark.push('7');
    } else if (
      p1Mark.includes('8') &&
      p1Mark.includes('7') &&
      empty.includes('6')
    ) {
      $('#grid6').html(p2xo);
      empty.splice(empty.indexOf('6'), 1);
      p2Mark.push('6');
    }

    // if none
    else {
      computerGo = true;
    }
  }

  //RESET FUNCTION TO RESET GAME AFTER A WIN OR DRAW
  function reset() {
    win = false;
    turn = 0;
    spots = [0, 0, 0, 0, 0, 0, 0, 0, 0];
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
    p1xo = '';
    p2xo = '';
    win = false;
    turn = 0;
    p1WinCount = 0;
    p2WinCount = 0;
    computerWinCount = 0;
    spots = [0, 0, 0, 0, 0, 0, 0, 0, 0];
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
    p1WinCount++;

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

      $('.p1WinCount').html(p1WinCount);
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
        p2WinCount++;
        $('.aiORp2WinCount').html(p2WinCount);
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
