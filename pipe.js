// Pipe class
class Pipe {
  constructor(x) {
    this.x = x; // X pos which is given as the parameter
    this.y = p5.floor(p5.random(-height * 0.5, 0)); // p5.random y pos of the pipe, so the gap is p5.randomly placed
    this.space = p5.height * 0.3; // Constant space between upper and bottom pipes
    this.w = p5.width * 0.05; // Pipep5.width
    this.h = p5.height * 0.6; // Pipe p5.height
  }

  //Function that moves pipe
  move() {
    this.x -= 5; // Push it to the left
    if (this.x + this.w <= 0) this.x = p5.width; // If it passed the screen the reset the position
  }

  //Function that draws both pipes images
  draw() {
    image(pipeUpImg, this.x, this.y, this.w, this.h); // Showing upper pipe
    image(pipeDownImg, this.x, this.y + this.h + this.space, this.w, this.h); // Showing bottom pipe
  }
}
