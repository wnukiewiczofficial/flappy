var bird; // Variable that contains bird object
var pipes = []; // An array of pipes

var started = false; // If the game is started or not

var highscore = localStorage.getItem("highscore") || 0; // Pick a highscore from local storage, if it's empty then highscoe is 0

//IMG (variable names clearly describe images)
var backgroundImg;
var pipeUpImg;
var pipeDownImg;
var baseImg; // Platform
var birdImg = []; // Spritesheet of bird animation
var base1X = 0, base2X; // Platform x positions, it is because bases are moving so variable must be dynamic

var startImg;
var gameoverImg;
var gameovertxtImg;
var medalImg;
var newImg;

//SOUNDS (variable names clearly describe sounds)
var scoreSound;
var hitSound;
var flySound;

// P5JS PRELOAD
function preload(){
  //Loading up IMAGES
  backgroundImg = loadImage("./assets/sprites/background-day.png");
  pipeUpImg = loadImage("./assets/sprites/pipeup.png");
  pipeDownImg = loadImage("./assets/sprites/pipedown.png");
  baseImg = loadImage("./assets/sprites/base.png");

  //Loading up spritesheet
  birdImg[0] = loadImage("./assets/sprites/bird_up.png");
  birdImg[1] = loadImage("./assets/sprites/bird_mid.png");
  birdImg[2] = loadImage("./assets/sprites/bird_down.png");

  startImg = loadImage("./assets/sprites/message.png");
  gameoverImg = loadImage("./assets/sprites/gameoverUI.png");
  gameovertxtImg = loadImage("./assets/sprites/gameover.png");
  medalImg = loadImage("./assets/sprites/silvermedal.png");
  newImg = loadImage("./assets/sprites/new.png");

  playImg = loadImage("./assets/sprites/playbtn.png");
  leaderboardImg = loadImage("./assets/sprites/leaderboard.png");


  //Loading up SOUNDS
  scoreSound = loadSound("./assets/audio/point.ogg");
  hitSound = loadSound("./assets/audio/hit.ogg");
  flySound = loadSound("./assets/audio/wing.ogg");
}

// P5JS SETUP
function setup() {
  createCanvas(windowWidth, windowHeight); // Creating canvas on the whole client size

  textFont('Flappy'); // Setting up the font for the game

  bird = new Bird(); // Creating new bird object
  pipes[0] = new Pipe(width); // Creating new pipe
  pipes[1] = new Pipe(width*1.5); // Creating new pipe

  base2X = width; // The x position of the second platform (There are 2 platforms to make the base look infinite)
}

// Function that shows UI - menu, gameover text, play again etc.
function UI(){

  // If the game is run and it is waiting for the start
  if(!started && !bird.hit){
    image(startImg, width/2 - width*0.2/2, height/2 - width*0.3/2, width*0.2, width*0.3); // Showing starting image
  }
  // If the game is started by the user and the bird hit the pipe, if he lost
  else if(started && bird.hit){
    image(gameovertxtImg, width/2 - width*0.3/2, width*0.1/2, width*0.3, width*0.05); // Showing gamover text

    image(gameoverImg, width/2 - width*0.3/2, height/2 - width*0.2/2, width*0.3, width*0.2); // Showing yellowish window
    image(medalImg, width/2 - width*0.22/2, height/2 - width*0.08/2, width*0.05, width*0.05); // Showing silver medal

    textSize(40); // Text size of 40px
    textAlign(RIGHT); // Text Align to right, so if the score has more digits, they push the text to the left not to the right
    text(bird.score, width/2 + width*0.25/2, height/2 - width*0.05/2); // Show the score

    // If user has beaten highscore
    if(bird.score > highscore){
      image(newImg, width/2 + width*0.05, height/2, width*0.02, width*0.01); // Showing a "new" highscore label
      text(bird.score, width/2 + width*0.25/2, height/2 + width*0.1/2); //  Showing the bird core as a highscore
    } else text(highscore, width/2 + width*0.25/2, height/2 + width*0.1/2); // If the user did not beat the highscore then show the highscore


    image(playImg, width/2 - width*0.3/2, height/2 + width*0.2/2, width*0.15, width*0.1); // Showing play button
    image(leaderboardImg, width/2, height/2 + width*0.2/2, width*0.15, width*0.1); // Showing leaderboard button (does not work)
  }
}

// Function that shows the score on the screen
function showScore(){
  textSize(100); // Text size of 100px
  stroke(0); // Black outline
  strokeWeight(2); // 2px outline thickness
  fill(255); // White fill
  textAlign(CENTER); // Centered text
  text(bird.score, width/2, textAscent()*2); // Drawing live score on the screen
}

// Function that shows and update base platform
function Base(){
  image(baseImg, base1X, height*0.9, width, height*0.1); // Showing first platform
  image(baseImg, base2X, height*0.9, width, height*0.1); // Showing second platform

  // If the game is started and user didnt lose
  if(!bird.hit && started){
    base1X-=5; // Push 1st platform to the left
    base2X-=5; // Push 2nd platform to the left

    // If one of the platforms pass the screen then reset it's position
    if(base1X + width <= 0) base1X = width;
    if(base2X + width <= 0) base2X = width;
  }
}

// P5JS DRAW
function draw() {
  // Background, it is looped beacuse of the image quality
  for(i = 0; i < width/400; i++)
  image(backgroundImg, i*400, 0, 400, height); // Showing one part of the background

  //For every pipe in the array
  for(let i in pipes){
    if(!bird.hit && started) pipes[i].move(); // If hte player didnt lose move the pipes
    pipes[i].draw(); // Drawing the pipes
  }
  Base(); // Drawing the platform

  bird.move(); // Moving the bird
  bird.collision(); // Checking bird's collisions
  bird.draw(); // Drawing the bird

  if(started && !bird.hit) showScore(); // Showing the score if user is playing and did not lose
  UI(); // Showing the UI
}
