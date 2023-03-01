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
const PLAYER_OPTIONS = document.querySelectorAll('.options');

//Score fields for player 1 and player 2
//Access any generic child with '.children[#]'
const PLAYER_SCORES = document.querySelectorAll('.score');

//Grid items on the tic-tac-toe 
//Storing it into an array with spread operator so I can filter the array
//later with Array methods.
const BOARD = document.querySelector('.board');
/* TODO: Select a specific piece with X = numX and Y = numY by the following code:

GRID.filter((x) => {
  return x.getAttribute('data-x') == numX && x.getAttribute('data-y') == numY
});
*/

/*
TODO: Hook up restart and start buttons
-- Restart should set the page back to default
-- Start should only appear once players have been selected properly to start the game
*/
const BUTTON_START = document.querySelector('.start');
const BUTTON_RESTART = document.querySelector('.restart')

//The game-end window
const WINDOW_GAME_END = document.querySelector('.pop-up.game-end');

/*--------------------------------------------------------------------------------------
Inititializing the objects for the game
--------------------------------------------------------------------------------------*/

//Object to do things related to a specific piece on the board?
const Player = (name) => {
  let _isHuman = false;
  let score = 0;

  const setHuman = (flag) => {
    _isHuman = flag;
  }

  return{
    name,
    score,
    setHuman,
    get isHuman() {return _isHuman;},
  };
}

//Object to manage the logic of the game
const GAME = (() =>{
  const players = [];

  //Initial buttons for setting up the game and selecting player type
  PLAYER_OPTIONS.forEach((player, index) =>{
    let button1 = player.children[1];
    let button2 = player.children[2];
    let nameInput = player.children[3]
    let nameBox = nameInput.children[0];
    let nameSubmit = nameInput.children[1];
    
    //Clicking first button sets the player as a human
    button1.addEventListener('click',
    () => {
      //Hide the two buttons
      button1.setAttribute('id','hidden');
      button2.setAttribute('id','hidden');

      //Show the name input
      nameInput.setAttribute('id','');
    }
    );

    //Fourth item is the name input. It's second item is the submit button
    nameSubmit.addEventListener('click',() => {
        //Disable the input
        [...nameInput.children].forEach((child) => {
          child.disabled = true;
        });
        nameSubmit.setAttribute('id','hidden');

        //Sets the player as a human
        let p = Player(nameBox.value);
        console.log(p);
        p.setHuman(true);
        players[index] = p;

        //If there are enough players, unhide the 'Start' button
        if(players.filter((x) => !(x === undefined)).length == 2){
          BUTTON_START.disabled = false;
        };
     });

    //Clicking second button sets the player as a robot
    player.children[2].addEventListener('click',
    () => {
      //Hide the two buttons
      player.children[1].setAttribute('id','hidden');
      player.children[2].setAttribute('id','hidden');

      //Set the player as a computer
      let p = Player('Computer');
      p.setHuman(false);
      players[index] = p;

      //Show the name input and set it to say 'Computer'
      nameInput.setAttribute('id','');

      //Disable the input
      [...nameInput.children].forEach((child) => {
        child.disabled = true;
      });
      nameSubmit.setAttribute('id','hidden');
      nameBox.value='Computer';

      //If there are enough players, unhide the 'Start' button
      if(players.filter((x) => !(x === undefined)).length == 2){
        BUTTON_START.disabled = false;
      };
    }
    );
  }); 

  //Hooking up behaviour of start button
  BUTTON_START.addEventListener('click',
  ()=>{

    //Check to see if enough players have been defined
    if(players.filter((x) => !(x === undefined)).length<2) return;

    Start();
  }
  );

  //Hooking up behaviour of restart button
  BUTTON_RESTART.addEventListener('click',Restart);

  function Start(){
    console.log('Starting');
    //Hide all the options
    [...PLAYER_OPTIONS].forEach((item) => item.setAttribute('id','hidden'));

    //Show the score board
    [...PLAYER_SCORES].forEach((item) => item.setAttribute('id',''));

    //Show the grid
    BOARD.setAttribute('id','');

    //Hide the start button
    BUTTON_START.setAttribute('id','hidden');

    //Set the name of player one to the actual player
    PLAYER_SCORES[0].children[0].textContent = `${players[0].name}'s Score`;
    PLAYER_SCORES[1].children[0].textContent = `${players[1].name}'s Score`;
  }

  function Restart(){
    console.log('Restarting');
    /*Set the page back to default:
    --Clear the players array
    --Hide the grid
    --Hide the scores
    --Show the options
    --Clear the names
    */

    //Clearing the player array
    players.length = 0;

    //Resetting the options to the default page state
    PLAYER_OPTIONS.forEach((player) => {
     player.setAttribute('id','');
     player.children[1].setAttribute('id','');
     player.children[2].setAttribute('id','');
     player.children[3].setAttribute('id','hidden');
     player.children[3].children[0].value ='';
     player.children[3].children[0].disabled = false;
     player.children[3].children[1].setAttribute('id','');
     player.children[3].children[1].disabled = false;
    });

    //Resetting the scores to default page state
    PLAYER_SCORES.forEach((player) => {
        player.setAttribute('id','hidden');
    });

    //Resetting the start button to default state
    BUTTON_START.setAttribute('id','');
    BUTTON_START.disabled = true;

    //Resetting the grid to default page state
    BOARD.setAttribute('id','hidden');
  }

  return{
    players,
  };
})();

//Object to keep track of and lay pieces on the board
const Board = (() =>{
  const pieces = [];

  
  
  
  return{

  };
})();



//Call Restart as soon as page loads so that the items are always empty
Restart();