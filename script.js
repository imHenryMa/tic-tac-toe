/* ----------------------------------------------------------------------
Getting the different elements and stuff that pre-generated on the HTML page
-----------------------------------------------------------------------*/

//Options fields for player 1 and player 2
const PLAYER_OPTIONS = document.querySelectorAll('.options');

//Score fields for player 1 and player 2
const PLAYER_SCORES = document.querySelectorAll('.score');

//Grid items on the tic-tac-toe 
//Storing it into an array with spread operator so I can filter the array later with Array methods.
const BOARD = document.querySelector('.board');

/*
-Restart should set the page back to default
-Start should only appear once players have been selected properly to start the game
*/
const BUTTON_START = document.querySelector('.start');
const BUTTON_RESTART = document.querySelector('.restart')

//The game-end window
const WINDOW_GAME_END = document.querySelector('.pop-up');

//Listener and event string for when a grid element.
const buttonListener = {
  listener: document.createElement('div'),
  event: 'buttonClicked',
};

//Listener and event string for when a move is made
const moveListener = {
  listener: document.createElement('div'),
  event: 'moveMade',
};

/*--------------------------------------------------------------------------------------
Inititializing the objects for the game
--------------------------------------------------------------------------------------*/

//Object to track player details
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


//Object to manage the logic of the game
const GAME = (() =>{
  //
  const players = [];
  const icons = ['X','O'];
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

  //Create a listener for when a grid element is clicked
  const buttonCheck = document.createElement('div');
  buttonListener.listener.appendChild(buttonCheck);
  buttonCheck.addEventListener(buttonListener.event,
    (event) => {

      //Button click does nothing if the player is not human
      if(!GAME.players[GAME.currentPlayer].isHuman) return;

      //Setting temporary variables so I can reference them easier
      let dataX = event.detail.dataX;
      let dataY = event.detail.dataY;
      let pieces = event.detail.pieces;

      //If move is invalid then return otherwise...
      if(pieces[dataX][dataY] != undefined) return;
      
      //Otherwise make the move
      makeMove(dataX,dataY,pieces);

    }
  );

  //Hooking up function of the end game window Next Button
  WINDOW_GAME_END.children[0].children[1].elements[0].addEventListener('click',
    () => {
      //Clear the board
      Restart(false);
      
      //Startconst a new game. 
      //The loser, or in the case of a draw the person who is supposed to go next, starts the next game
      Start(GAME.currentPlayer);
    }
  );

  //Hooking up function of the End-game Restart button
  WINDOW_GAME_END.children[0].children[1].elements[1].addEventListener('click',Restart);

  //AI for the game
  function makeCPUMove(pieces,myPiece,perfectPlayChance = 1){
      //Determine valid moves for the board
      let validItems = [];
      for(let i = 0; i< 3; i++){
        for(let j = 0; j < 3; j++){
          if(pieces[i][j] === undefined) validItems.push({dataX: i, dataY: j});
        }
      }

      //1. 
      //Random chances for PC to make a random move instead of perfect move
      if(Math.random() > perfectPlayChance){
        let index = Math.floor(Math.random()*(validItems.length));
        return {move: validItems[index], quality: -999};
      }

      //2.
      //Function checks all available moves recursively to see if
      //The move can eventually result in a win (preferred) or a draw
      //If it finds a winning path -> Always select it
      //If it finds a draw or a losing path -> Check all other paths first
      //Then selects path that results in a draw
      //Then selects path that results in a loss

      //1. For each valid moves...
      //2. Make a copy of the pieces array, add the move to the array
      //3. Call the makeCPU move for the other player to see their moves
      let moveQuality = [];
      validItems.forEach((move) =>{
          //Will need to make a deep copy of the array because it is multidimensional
          //Since its just a 3x3, just iterate through and copy the values to a new array
          let movePieces = [[],[],[]];
          for(let i = 0; i<3; i++)
            for(let j=0; j<3; j++)
              movePieces[i][j] = pieces[i][j];
          
          //Adding move to array..
          movePieces[move.dataX][move.dataY] = myPiece;

          //Check to see if the move would end the game
          let gameStatus = checkGameStatus(move.dataX,move.dataY, movePieces);

          //If the gameStatus is 0 or 1, then we know the game ends. Thus just save the result
          ////No need to continue after this, therefore go to next move in the validItems array by returning
          if(gameStatus == 0 || gameStatus == 1){
            moveQuality.push({move, quality: gameStatus});
            return; 
          }
          
          //Otherwise the game continues.. thus recursively check. However next move is the opponents move
          //Because its the opponents move, the result is multiplied by -1 -> If they win, then we lose
          gameStatus = makeCPUMove(movePieces, GAME.icons.filter((x) => x != myPiece)[0] , 1).quality * -1;
          moveQuality.push({move,quality: gameStatus});
      });

      //After going through all the moves, filter through and find the best move
      moveQuality.sort((x,y) => y.quality - x.quality);

      //The first entry is always the best move. There may be multiple best moves.. but always pick the first one
      return moveQuality[0];
  }

  //This function, when called, will make a move and notify all relevant parties that a move has beebn made
  function makeMove(dataX, dataY, pieces){
    //Add the move to the array
    let nextPiece = GAME.icons.shift();
    console.log(dataX);
    pieces[dataX][dataY] = nextPiece;
    GAME.icons.push(nextPiece);

    //Also dispatch an event noting that the move is valid
    [...moveListener.listener.children].forEach(
      (listener) => listener.dispatchEvent(
        new CustomEvent(
          moveListener.event,{
            detail: {
              dataX: dataX,
              dataY: dataY,}})));

    //Check to see if the game has ended
    let gameStatus = checkGameStatus(dataX, dataY, pieces);
    switch (gameStatus){
      case -1: 
        //Game is continuing, so need to toggle next player before having the CPU make its move
        GAME.currentPlayer = +(!GAME.currentPlayer); 
        //If the next player is a CPU, then have it make a move
        if(!GAME.players[GAME.currentPlayer].isHuman){
          let nextMove = makeCPUMove(Board.pieces,GAME.icons[0],Math.random()); //TODO: Player can select difficulty
          makeMove(nextMove.move.dataX,nextMove.move.dataY,Board.pieces);
        }
        break;
      case 0:
        endGame(false);
        break;
      case 1:
        endGame(true);
      default:
        //Otherwise toggle it after the endgame checks
        GAME.currentPlayer = +(!GAME.currentPlayer); 
        break;
    }
  }

  //Checks to see if a game end condition is satisfied
  function checkGameStatus(dataX,dataY, pieces){

    //Setting easy to reference temporary variable names
    let currentPieceValue = pieces[dataX][dataY];

    //Check the current row to see if its three consecutive
    let gameEnded = true;
    for(let x = 0; x <3; x++){
      if(pieces[x][dataY] == currentPieceValue) continue;
      
      gameEnded = false; //If it reaches here then the row check failed to confirm game has ended
      break;
    }
    if(gameEnded) return 1;//1 Means someone has won

    //Check current column to see if its three consecutive
    gameEnded = true;
    for(let y = 0; y <3; y++){
      if(pieces[dataX][y] == currentPieceValue) continue;
      gameEnded = false; //If it reaches here then the row check failed to confirm game has ended
    }
    if(gameEnded) return 1;//1 Means someone has won

    //Check the diagonals if there is a piece at the center (i.e. someone can win diagonally if there is a piece in the center)
    if(currentPieceValue == pieces[1][1]){
      const diag1 = pieces[0][0] == pieces[1][1] && pieces[1][1] == pieces[2][2];
      const diag2 = pieces[2][0] == pieces[1][1] && pieces[1][1] == pieces[0][2];
      if(diag1 || diag2) return 1; //1 Means someone has won
    }

    //Check to see if there's no more viable moves
    let viableMovesLeft = false;
    for(let i = 0; i<3; i++){
      if(viableMovesLeft) break;
      for(let j = 0; j<3; j++){
        if(viableMovesLeft) break;
        viableMovesLeft = pieces[i][j] === undefined;
      }
    } if(!viableMovesLeft) return 0; //0 Means tie game

    return -1; //-1 means game can still continue
  }

  function endGame(hasWinner){
    //Console related stuff for later
    let condition = hasWinner ? 'winner' : 'draw';
    console.log(`Game ended in a ${condition}! The last player to make a move was ${GAME.players[GAME.currentPlayer].name}.`);
  
    //Showing the window and setting the text
    WINDOW_GAME_END.setAttribute('id','');
    WINDOW_GAME_END.children[0].children[0].textContent = hasWinner ? `${GAME.players[GAME.currentPlayer].name} won this round` : 'The game ended in a draw!';
  
    //Incrementing the winner's score
    if(hasWinner) GAME.players[GAME.currentPlayer].score++;

    return true; //If this function is called always return true -> Related to checkGameStatus seeing if game has ended
  }

  function Start(firstPlayer = 0){
    console.log('Starting');
    //Hide all the options
    [...PLAYER_OPTIONS].forEach((item) => item.setAttribute('id','hidden'));

    //Show the score board
    [...PLAYER_SCORES].forEach((item) => item.setAttribute('id',''));

    //Show the grid
    BOARD.setAttribute('id','');

    //Hide the start button
    BUTTON_START.setAttribute('id','hidden');

    //Set the name of players to the actual player
    PLAYER_SCORES[0].children[0].textContent = `${players[0].name}'s Score`;
    PLAYER_SCORES[1].children[0].textContent = `${players[1].name}'s Score`;

    //Set the SCORES of players to the actual player
    PLAYER_SCORES[0].children[1].textContent = `${players[0].score}`;
    PLAYER_SCORES[1].children[1].textContent = `${players[1].score}`;

    //Set current player as first person
    GAME.currentPlayer = firstPlayer;
    //If the current player is a PC, then have it make a move
    if(!GAME.players[GAME.currentPlayer].isHuman){
      let initialMove = makeCPUMove(Board.pieces,GAME.icons[0],Math.random()); //TODO: Let player select difficulty
      makeMove(initialMove.move.dataX,initialMove.move.dataY,Board.pieces);
    };
  }

  function Restart(fullRestart = true){
    console.log('Resetting game to default state');

    //Clearing the moves
    Board.pieces = [[],[],[]];

    //Resetting the moves array
    GAME.icons = ['X','O'];

    //Resetting the end-game-window to the default page state
    WINDOW_GAME_END.setAttribute('id','hidden');

    //Resetting the grid to default page state
    [...BOARD.children].forEach((piece) => {
      piece.textContent = '';
    });

    //The items below only pertain to a full restart of the game
    if(!fullRestart) return;

    //Clearing the player array
    GAME.players.length = 0;

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

    //Resetting the board to its default state
    BOARD.setAttribute('id','hidden');

    //Resetting the start button to default state
    BUTTON_START.setAttribute('id','');
    BUTTON_START.disabled = true;
  }
  const restartGame = Restart;

  return{
    makeCPUMove,
    icons,
    endGame,
    buttonListener,
    players,
    currentPlayer,
    restartGame,
  };
})();

//Call Restart as soon as page loads so that the items are always empty
GAME.restartGame();