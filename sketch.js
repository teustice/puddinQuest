let stretchy;
let face;
let food;
let score = 0;
let projectiles = [];
let foodPaths;
let playing = false;
let gameOver = false;
let startCircle;
let timer = true;
let infoText;

function setup() {
  foodPaths = [loadImage('assets/banana.png'), loadImage('assets/burger.png'), loadImage('assets/cake.png'), loadImage('assets/pizza.png')];
  canvas = createCanvas(800,800);
  canvas.parent('sketch-holder');
  face = loadImage("https://t5.rbxcdn.com/e597ed8a8a0fde9574c6cbd6b54cb177");
  renderStartTile();
  renderStretchy();
}

function draw() {
  noCursor();
  background(0);
  purge();
  if(playing == true){
    //set number of projectiles at one time
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
            reset();
            alert(`GAME OVER, YOUR SCORE WAS: ${score}`);
          }
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

  countDown();

  drawSprites();
}

function updateScore(reset){
  let scoreBoard = document.getElementById("scoreBoard");
  if(reset){
    score = 0;
  } else {
    score++;
  }
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

function start(){
  playing = true;
  renderStartTile();
  food = createSprite(random(50,750), random(50,750), 20, 20);
  randomFood = foodPaths[Math.floor(Math.random() * foodPaths.length)];
  food.addImage(randomFood);
  updateScore(true);
}

function reset(){
  playing = false;
  renderStartTile();
  stretchy.remove();
  renderStretchy();
  timer = true;
  gameOver = false;
  for(let i=0; i<projectiles.length; i++){
    projectiles[i].remove();
  }
  projectiles = [];
  food.remove();
  food = null;
}

function renderStartTile(){
  if(playing == false){
    startCircle = createSprite(400, 400, 100, 100);
  } else {
    startCircle.remove();
    startCircle = null;
  }
}

function countDown(){
  countDownDisplay = document.getElementById("scoreBoard");
  let timerCount = 5;
  if(timer && stretchy.overlap(startCircle)){
    timer = false;
    let interval = setInterval(function(){
      countDownDisplay.innerHTML = `Starting in ${timerCount}`;
      if(timerCount == 1){
        start();
      } else if(timerCount < 1 || !stretchy.overlap(startCircle)){
        clearInterval(interval);
        if(timerCount > 1){
          countDownDisplay.innerHTML = `Stay on the tile to start!`;
          timer = true;
        }
      }
      timerCount--;
    }, 1000);
  }
}

function renderStretchy(){
  stretchy = createSprite(400, 200, 1, 1);

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
