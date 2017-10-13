let stretchy;
let face;
let food;
let score = 0;
let projectiles = [];
let foodPaths;
let gameOver = false;
function setup() {
  foodPaths = [loadImage('assets/banana.png'), loadImage('assets/burger.png'), loadImage('assets/cake.png'), loadImage('assets/pizza.png')];
  canvas = createCanvas(800,800);
  canvas.parent('sketch-holder');
  face = loadImage("https://t5.rbxcdn.com/e597ed8a8a0fde9574c6cbd6b54cb177");
  food = createSprite(random(50,750), random(50,750), 20, 20);
  randomFood = foodPaths[Math.floor(Math.random() * foodPaths.length)];
  food.addImage(randomFood);

  //Sometimes image sequences are not enough and you may want to
  //use p5's drawing function while retaining the built-in features of the
  //sprite class
  stretchy = createSprite(400, 200, 1, 1);

  //To do so you can override (overwrite) the draw() function of the sprite
  //and make it display anything you want in its current position.
  //In javascript function and methods can be assigned like variables

  stretchy.draw = function() {

    //the center of the sprite will be point 0,0
    //"this" in this function will reference the sprite itself
    fill(237,205,0);

    //make the ellipse stretch in the sprite direction
    //proportionally to its speed
    push();
    rotate(radians(this.getDirection()));
    ellipse(0,0, 50+this.getSpeed()/2, 50-this.getSpeed()/2);
    pop();

    //this.deltaX and this.deltaY are the position increment
    //since the last frame, move the face image toward the direction
    image(face, this.deltaX*2,this.deltaY*2, face.width/18, face.height/18);
    }

  stretchy.maxSpeed = 10;
}

function draw() {
  noCursor();
  background(0);
  //set number of projectiles at one time
  purge();
  if(projectiles.length < 10){
    newProjectile = createSprite(1, random(1, 800), width/20, height/20);
    projectiles.push(newProjectile);
    newProjectile.setSpeed(random(5,10), 360);
  }
  for(let i=0; i < projectiles.length; i++){
    if(projectiles.length > 0){
      if(stretchy.overlap(projectiles[i])){
        if(gameOver == false){
          gameOver = true;
          alert("YOU DIED!");
        }
      }
    }
  }

  //mouse trailer, the speed is inversely proportional to the mouse distance
  stretchy.velocity.x = (mouseX-stretchy.position.x)/10;
  stretchy.velocity.y = (mouseY-stretchy.position.y)/10;

  //food collison
  if(food && stretchy.overlap(food)){
    updateScore();
    food.remove();
    food = createSprite(random(1,800), random(1,800), width/20, height/20);
    randomFood = foodPaths[Math.floor(Math.random() * foodPaths.length)];
    food.addImage(randomFood);
  }

  drawSprites();
}

function updateScore(){
  score++;
  let scoreBoard = document.getElementById("scoreBoard");
  scoreBoard.innerHTML = `Score: ${score}`;
}

function purge(){
  for(let i=0; i<projectiles.length; i++){
    if(
      projectiles[i].position.y < -800 || projectiles[i].position.y > 800 || projectiles[i].position.x > 800 ||
      projectiles[i].position.x < -800){
      projectiles[i].remove();
      projectiles.splice(projectiles.indexOf(projectiles[i]), 1);
    }
  }
}
