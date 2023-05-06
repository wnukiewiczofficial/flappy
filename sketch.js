let bird; // Variable that contains bird object
let pipes = []; // An array of pipes

let started = false; // If the game is started or not

let highscore = localStorage.getItem("highscore") || 0; // Pick a highscore from local storage, if it's empty then highscoe is 0

//IMG (variable names clearly describe images)
let backgroundImg;
let pipeUpImg;
let pipeDownImg;
let baseImg; // Platform
let birdImg = []; // Spritesheet of bird animation
let base1X = 0,
  base2X; // Platform x positions, it is because bases are moving so variable must be dynamic

let startImg;
let gameoverImg;
let gameovertxtImg;
let medalImg;
let newImg;

//SOUNDS (variable names clearly describe sounds)
let scoreSound;
let hitSound;
let flySound;

// P5JS PRELOAD
function preload() {
  //Loading up IMAGES
  backgroundImg = p5.loadImage("./assets/sprites/background-day.png");
  pipeUpImg = p5.loadImage("./assets/sprites/pipeup.png");
  pipeDownImg = p5.loadImage("./assets/sprites/pipedown.png");
  baseImg = p5.loadImage("./assets/sprites/base.png");

  //Loading up spritesheet
  birdImg[0] = p5.loadImage("./assets/sprites/bird_up.png");
  birdImg[1] = p5.loadImage("./assets/sprites/bird_mid.png");
  birdImg[2] = p5.loadImage("./assets/sprites/bird_down.png");

  startImg = p5.loadImage("./assets/sprites/message.png");
  gameoverImg = p5.loadImage("./assets/sprites/gameoverUI.png");
  gameovertxtImg = p5.loadImage("./assets/sprites/gameover.png");
  medalImg = p5.loadImage("./assets/sprites/silvermedal.png");
  newImg = p5.loadImage("./assets/sprites/new.png");

  playImg = p5.loadImage("./assets/sprites/playbtn.png");
  leaderboardImg = p5.loadImage("./assets/sprites/leaderboard.png");

  //Loading up SOUNDS
  scoreSound = p5.loadSound("./assets/audio/point.ogg");
  hitSound = p5.loadSound("./assets/audio/hit.ogg");
  flySound = p5.loadSound("./assets/audio/wing.ogg");
}

// P5JS SETUP
function setup(p5, canvasParentRef) {
  p5.createCanvas(windowWidth, windowHeight); // Creating canvas on the whole client size

  textFont("Flappy"); // Setting up the font for the game

  bird = new Bird(); // Creating new bird object
  pipes[0] = new Pipe(p5.width); // Creating new pipe
  pipes[1] = new Pipe(p5.width * 1.5); // Creating new pipe

  base2X = p5.width; // The x position of the second platform (There are 2 platforms to make the base look infinite)
}

// Function that shows UI - menu, gameover text, play again etc.
function UI() {
  // If the game is run and it is waiting for the start
  if (!started && !bird.hit) {
    image(
      startImg,
      p5.width / 2 - (p5.width * 0.2) / 2,
      p5.height / 2 - (p5.width * 0.3) / 2,
      p5.width * 0.2,
      p5.width * 0.3
    ); // Showing starting image
  }
  // If the game is started by the user and the bird hit the pipe, if he lost
  else if (started && bird.hit) {
    image(
      gameovertxtImg,
      p5.width / 2 - (p5.width * 0.3) / 2,
      (p5.width * 0.1) / 2,
      p5.width * 0.3,
      p5.width * 0.05
    ); // Showing gamover text

    image(
      gameoverImg,
      p5.width / 2 - (p5.width * 0.3) / 2,
      p5.height / 2 - (p5.width * 0.2) / 2,
      p5.width * 0.3,
      p5.width * 0.2
    ); // Showing yellowish window
    image(
      medalImg,
      p5.width / 2 - (p5.width * 0.22) / 2,
      p5.height / 2 - (p5.width * 0.08) / 2,
      p5.width * 0.05,
      p5.width * 0.05
    ); // Showing silver medal

    p5.textSize(40); // Text size of 40px
    p5.textAlign(p5.RIGHT); // Text Align to right, so if the score has more digits, they push the text to the left not to the right
    p5.text(
      bird.score,
      p5.width / 2 + (p5.width * 0.25) / 2,
      p5.height / 2 - (p5.width * 0.05) / 2
    ); // Show the score

    // If user has beaten highscore
    if (bird.score > highscore) {
      image(
        newImg,
        p5.width / 2 + p5.width * 0.05,
        p5.height / 2,
        p5.width * 0.02,
        p5.width * 0.01
      ); // Showing a "new" highscore label
      p5.text(
        bird.score,
        p5.width / 2 + (p5.width * 0.25) / 2,
        p5.height / 2 + (p5.width * 0.1) / 2
      ); //  Showing the bird core as a highscore
    } else
      p5.text(
        highscore,
        p5.width / 2 + (p5.width * 0.25) / 2,
        p5.height / 2 + (p5.width * 0.1) / 2
      ); // If the user did not beat the highscore then show the highscore

    image(
      playImg,
      p5.width / 2 - (p5.width * 0.3) / 2,
      p5.height / 2 + (p5.width * 0.2) / 2,
      p5.width * 0.15,
      p5.width * 0.1
    ); // Showing play button
    image(
      leaderboardImg,
      p5.width / 2,
      p5.height / 2 + (p5.width * 0.2) / 2,
      p5.width * 0.15,
      p5.width * 0.1
    ); // Showing leaderboard button (does not work)
  }
}

// Function that shows the score on the screen
function showScore() {
  p5.textSize(100); // Text size of 100px
  p5.stroke(0); // Black outline
  p5.strokeWeight(2); // 2px outline thickness
  p5.fill(255); // White p5.fill
  p5.textAlign(p5.CENTER); // Centered text
  p5.text(bird.score, p5.width / 2, p5.textAscent() * 2); // Drawing live score on the screen
}

// Function that shows and update base platform
function Base() {
  image(baseImg, base1X, p5.height * 0.9, p5.width, p5.height * 0.1); // Showing first platform
  image(baseImg, base2X, p5.height * 0.9, p5.width, p5.height * 0.1); // Showing second platform

  // If the game is started and user didnt lose
  if (!bird.hit && started) {
    base1X -= 5; // Push 1st platform to the left
    base2X -= 5; // Push 2nd platform to the left

    // If one of the platforms pass the screen then reset it's position
    if (base1X + p5.width <= 0) base1X = p5.width;
    if (base2X + p5.width <= 0) base2X = p5.width;
  }
}

// P5JS DRAW
function draw() {
  // Background, it is looped beacuse of the image quality
  for (i = 0; i < p5.width / 400; i++)
    image(backgroundImg, i * 400, 0, 400, p5.height); // Showing one part of the background

  //For every pipe in the array
  for (let i in pipes) {
    if (!bird.hit && started) pipes[i].move(); // If hte player didnt lose move the pipes
    pipes[i].draw(); // Drawing the pipes
  }
  Base(); // Drawing the platform

  bird.move(); // Moving the bird
  bird.collision(); // Checking bird's collisions
  bird.draw(); // Drawing the bird

  if (started && !bird.hit) showScore(); // Showing the score if user is playing and did not lose
  UI(); // Showing the UI
}
