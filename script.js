/* My notes:

1) Game will load and the game settings option will show.
-- It will ask for both player 1 and player 2 if it will be played by 
a human or by a computer
-- Selecting human will hide the buttons and show a text box to enter
the player name
-- After both player 1 and player 2 are complete, a button will show up
for 'Game Start'. 
-- A 'Restart' button will always be visible to restart game 

2) Once game starts, the player options disappear, and is replaced by
a player score window. The Restart button will still be visible to restart

3) The Grid will show up. Players will take turns clicking on the grids
to place an 'X' (player 1) or an 'O' (player 2)

4) Once a draw or someone wins, a message will pop up saying who wins,
and then ask if you want to play the next round, or to restart

*/

/* CSS related stuff..

1) Game grid, score will be hidden until optiosn selected
2) Options will be visibile until after options selected
3) Pop up window noting who has won will be hidden until a round is over
*/


/* ----------------------------------------------------------------------
Getting the different elements and stuff that pre-generated on the HTML page
-----------------------------------------------------------------------*/

//Options fields for player 1 and player 2
//Access buttons through '.elements[#]'
const P1_OPTIONS = document.querySelector('.player-one.options');
const P2_OPTIONS = document.querySelector('.player-two.options');

//Score fields for player 1 and player 2
//Access any generic child with '.children[#]'
const P1_SCORE = document.querySelector('.player-one.score');
const P2_SCORE = document.querySelector('.player-two.score');

//Grid items on the tic-tac-toe 
//Storing it into an array with spread operator so I can filter the array
//later with Array methods.
const GRID_ITEMS = [...document.querySelectorAll('.board>.piece')];
/* TODO: Select a specific piece with X = numX and Y = numY by the following code:

GRID.filter((x) => {
  return x.getAttribute('data-x') == numX && x.getAttribute('data-y') == numY
});
*/

//The game-end window
const GAME_END = document.querySelector('.pop-up.game-end');

