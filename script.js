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

//Create a button listener and an event for it.
const buttonListener = {
  listener: document.createElement('div'),
  event: 'buttonClicked',
};

//Listener and event for when a move is made
const moveListener = {
  listener: document.createElement('div'),
  event: 'moveMade',
};

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
  //
  const players = [];
  let currentPlayer;

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


  //Create a listener for when a cell is filled
  const buttonCheck = document.createElement('div');
  buttonListener.listener.appendChild(buttonCheck);
  buttonCheck.addEventListener(buttonListener.event,
    (event) => {
      //Setting temporary variables so I can reference them easier
      let dataX = event.detail.dataX;
      let dataY = event.detail.dataY;
      let pieces = event.detail.pieces;

      //If move is invalid then return
      if(pieces[dataX][dataY] != undefined) return;
      
      //Add the move to the array
      pieces[dataX][dataY] = GAME.currentPlayer == 0 ? 'X' : 'O';

      //Also dispatch an event noting that the move is valid
      [...moveListener.listener.children].forEach(
        (listener) => listener.dispatchEvent(
          new CustomEvent(
            moveListener.event,{
              detail: {
                dataX: dataX,
                dataY: dataY,}})));

      //Check to see if the game has ended
      checkGameStatus({dataX, dataY}, pieces);

      //Toggle next player
      GAME.currentPlayer = +(!GAME.currentPlayer); 
    }
  );

  function checkGameStatus(lastPiece, pieces){

    //console.log('Checking game status..');
    //console.log(`${lastPiece.dataX}, ${lastPiece.dataY}`);
    //console.table(pieces);

    let currentPieceValue = pieces[lastPiece.dataX][lastPiece.dataY];
    let dataX = lastPiece.dataX;
    let dataY = lastPiece.dataY;

    //Check the current row to see if its three consecutive
    let gameEnded = true;
    for(let x = 0; x <3; x++){
      if(pieces[x][dataY] == currentPieceValue) continue;
      
      gameEnded = false; //If it reaches here then the row check failed to confirm game has ended
      break;
    }
    if(gameEnded) return endGame('winner');

    //Check current column to see if its three consecutive
    gameEnded = true;
    for(let y = 0; y <3; y++){
      if(pieces[dataX][y] == currentPieceValue) continue;
      gameEnded = false; //If it reaches here then the row check failed to confirm game has ended
    }
    if(gameEnded) return endGame('winner');

    //Check the diagonals if there is a piece at the center (i.e. someone can win diagonally if there is a piece in the center)
    if(currentPieceValue == pieces[1][1]){
      const diag1 = pieces[0][0] == pieces[1][1] && pieces[1][1] == pieces[2][2];
      const diag2 = pieces[2][0] == pieces[1][1] && pieces[1][1] == pieces[0][2];
      if(diag1 || diag2) return endGame('winner');
    }

    //Check to see if there's no more viable moves afterwards
    let viableMovesLeft = false;
    for(let i = 0; i<3; i++){
      if(viableMovesLeft) break;
      for(let j = 0; j<3; j++){
        if(viableMovesLeft) break;
        viableMovesLeft = pieces[i][j] === undefined;
      }
    } if(!viableMovesLeft) return endGame('draw');

  }

  function endGame(condition){
    console.log(`Game ended in a ${condition}! The last player to make a move was ${GAME.currentPlayer}.`);
    
  }

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

    //Set current player as first person
    GAME.currentPlayer = 0;
  }

  function Restart(){
    console.log('Resetting game to default state');
    /*Set the page back to default:
    --Clear the players array
    --Hide the grid
    --Hide the scores
    --Show the options
    --Clear the names
    */

    //Clearing the player array
    GAME.players.length = 0;
    //Clearing the moves
    Board.pieces = [[],[],[]];

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
    [...BOARD.children].forEach((piece) => {
      piece.textContent = '';
    });
  }
  const restartGame = Restart;

  return{
    buttonListener,
    players,
    currentPlayer,
    restartGame,
  };
})();

//Object to keep track of and lay pieces on the board
const Board = (() =>{
  let pieces = [[],[],[]];

  //Hooking up behaviour of each individual grid item
  [...BOARD.children].forEach((piece) =>{  

    //Dispatches an event telling that this button has been clicked
    piece.addEventListener('click',() => {pieceClicked(piece, Board.pieces);});

    //Each piece will listen for when the GAME sends confirmation that a move is made correctly
    const moveCheck = document.createElement('div');
    moveListener.listener.appendChild(moveCheck);
    moveCheck.addEventListener(moveListener.event,(event)=>{
      if(event.detail.dataX == piece.getAttribute('data-x') && event.detail.dataY == piece.getAttribute('data-y'))
      {
        //Set either 'X' or 'O' on the board depending on who is the current player
        setPieceValue(piece,Board.pieces[event.detail.dataX][event.detail.dataY]);
      }
    });
  });

  function pieceClicked(piece,pieces){
    [...buttonListener.listener.children].forEach((listener)=>{
      listener.dispatchEvent(new CustomEvent(buttonListener.event,
        {
          detail: {
            dataX: piece.getAttribute('data-x'),
            dataY: piece.getAttribute('data-y'),
            pieces: pieces,
          }
        }));
    });
  }
  
  function setPieceValue(piece,value){
    piece.textContent = value;
  }

  return{
    pieces,
  };
})();


//Call Restart as soon as page loads so that the items are always empty
GAME.restartGame();