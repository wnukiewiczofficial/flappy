// Class bird
class Bird {
  constructor() {
    this.score = 0; // User score
    this.x = 500; // x pos
    this.y = p5.height / 2; // y pos
    this.w = p5.width * 0.04; // Width
    this.h = p5.width * 0.025; // Height
    this.gravity = 0.62; // Gravity
    this.vel = 0; // Velocity

    this.spriteI = 0; // Sprtie index

    // Animation interval - go through every spritesheet, so bird has animation
    this.animation = window.setInterval(() => {
      this.spriteI++;
      if (this.spriteI >= 3) this.spriteI = 0;
    }, 100); // Call the function every 100ms

    this.hit = false; // If the bird hit a pipe or platform
    this.enteredPipe = false; // If the bird entered a pipe
  }

  // Function that draws the bird
  draw() {
    image(birdImg[this.spriteI], this.x, this.y, this.w, this.h); // Drawing bird image from spritesheet
  }

  // Funtion that moves the bird
  move() {
    if (started) this.vel += this.gravity; // If the game is started then activate the gravity, the velocity is always reduced

    if (this.vel < -12) this.vel = -12; // Limit the velocity, so the user cannot add too much velocity
    this.y += this.vel; // Always update the y pos with velocity
  }

  // Function that checks collisions
  collision() {
    // If the bird hits the top, the bird cant go through upper canvas border
    if (this.y <= 0) {
      this.y = 0;
      this.vel = 0;
    }
    // If the bird hits the platform
    if (this.y + this.h >= p5.height * 0.9) {
      this.y = p5.height * 0.9 - this.h; // The bird cannot go through the platform
      this.lose(); // Call the lose function
    }

    // For every pipe in the game
    for (let i in pipes) {
      //If the bird hits a pipe
      if (
        this.x + this.w >= pipes[i].x &&
        this.x <= pipes[i].x + pipes[i].w &&
        !this.hit
      ) {
        if (
          this.y <= pipes[i].y + pipes[i].h ||
          this.y + this.h >= pipes[i].y + pipes[i].h + pipes[i].space
        ) {
          this.lose(); // Call the lose function
        } else this.enteredPipe = true; // If passed the x pos of a pipe but did not hit, then tell the bird has entered an obstacle
      }

      // If the bird passed a pipe
      if (this.x > pipes[i].x + pipes[i].w && this.enteredPipe) {
        this.score++; // Add one point to the score
        this.enteredPipe = false; // Reset the enteredPipe
        scoreSound.play(); // Play the point sound
      }
    }
  }

  // Function that stops everything, beacuse the game is lost
  lose() {
    if (!this.hit) {
      if (this.score > parseInt(highscore))
        localStorage.setItem("highscore", this.score); // If the user made a highscore then update it in local storage
      hitSound.play(); // Play losing sound
    }
    this.vel = 0; // Reset the velocity
    this.hit = true; // Tell that bird has hit something and lost
    window.clearInterval(this.animation); // Clear the animation
  }

  // Function that resets all the values to play one more game
  reset() {
    started = false; // Tell the game that it is not started yet
    this.hit = false; // Reset the hit bool
    this.y = p5.height / 2; // Reset bird's position
    this.vel = 0; // Reset birds velocity
    this.score = 0; // Reset the current score
    // Start animating the bird
    this.animation = window.setInterval(() => {
      this.spriteI++;
      if (this.spriteI >= 3) this.spriteI = 0;
    }, 100);

    // Reset positions of every pipe
    for (let i in pipes) {
      pipes[i].x = p5.width + 0.5 * p5.width * i;
      pipes[i].y = p5.floor(p5.random(-height * 0.5, 0));
    }
  }
}

// P5JS Input, MOUSE INPUT
function mouseClicked() {
  if (!started) started = true; // If the game is not started, then start it

  // If the game is running and bird has not hit
  if (!bird.hit) {
    bird.vel -= abs(bird.vel) + 21.66; // Add some velocity to tell the bird to go up
    flySound.play(); // Play flying sound, wing sound
  }

  // If the bird has lost
  if (started && bird.hit) {
    // If user pushes the play button
    if (
      p5.mouseX >= p5.width / 2 - (p5.width * 0.3) / 2 &&
      p5.mouseX <= p5.width / 2 &&
      p5.mouseY >= p5.height / 2 + (p5.width * 0.2) / 2 &&
      p5.mouseY <= p5.height / 2 + (p5.width * 0.2) / 2 + p5.width * 0.1
    ) {
      if (bird.score > highscore) highscore = bird.score; // Update the highscore in the session
      bird.reset(); // Reset the game
    }
  }
}
