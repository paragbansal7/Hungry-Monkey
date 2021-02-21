var ground;
var monkey, monkeyRunning, monkeyStanding;
var banana, bananaImage;
var obstacle, obstacleImage;
var bananaGroup, obstacleGroup;
var score, highScore, lifeline;
var jumpSound, dieSound, bananaSound;
var Play = 1;
var End = 0;
var gameState = Play;

function preload() {


  monkeyRunning = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png")

  monkeyStanding = loadAnimation("sprite_0.png");

  bananaImage = loadImage("banana.png");
  obstaceImage = loadImage("obstacle.png");

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  bananaSound = loadSound("banana.mp3")

}

function setup() {
  createCanvas(400, 300);

  monkey = createSprite(50, 260, 100, 100);

  monkey.addAnimation("collided", monkeyStanding)
  monkey.addAnimation("running", monkeyRunning);

  monkey.scale = 0.1;

  ground = createSprite(300, 280, 1000, 10);

  bananaGroup = createGroup();
  obstacleGroup = createGroup();

  score = 0;
  highScore = 0;
  lifeline = 3;
}


function draw() {
  background("white");

  monkey.collide(ground);
  fill("black");
  textSize(15);
  text("Score:" + score, 330, 20);
  text("High Score:" + highScore, 295, 40);
  text("Lives Left:" + lifeline, 10, 20);

  if (score > highScore) {
    highScore = score;
  }

  if (gameState === Play) {

    monkey.changeAnimation("running", monkeyRunning);

    ground.velocityX = -9;

    if (ground.x < 50) {
      ground.x = ground.width / 2;
    }

    if (keyDown("space") && monkey.y >= 200) {
      monkey.velocityY = -12;
      jumpSound.play();
    }

    monkey.velocityY = monkey.velocityY + 0.8;

    spawnBanana();
    spawnObstacles();

    if (monkey.isTouching(bananaGroup)) {
      bananaSound.play();
      bananaGroup.destroyEach();
      score = score + 1;
    }

    if (monkey.isTouching(obstacleGroup)) {
      dieSound.play();
      lifeline = lifeline - 1;
      gameState = End;
      score = 0;
    }

    if (lifeline === 0) {
      highScore = 0;
    }

  } else if (gameState === End) {

    monkey.changeAnimation("collided", monkeyStanding);

    bananaGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);

    bananaGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);

    ground.velocityX = 0;

    stroke("black");
    fill("red");
    textSize(25);
    text("GAME OVER!", 130, 120);


    textSize(18);
    text("Press 'R' to restart", 140, 150);

    if (keyDown("r")) {
      gameState = Play;
      obstacleGroup.destroyEach();
      bananaGroup.destroyEach();
    }

    if (lifeline === 0 && keyDown("r")) {
      lifeline = 3;
    }
  }

  drawSprites();

}

function spawnBanana() {

  var rand = Math.round(random(120, 200));

  if (frameCount % 60 === 0) {
 
    banana = createSprite(420, rand, 10, 10);
    banana.addImage("abc", bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -(5 + score / 2);
    banana.lifetime = 100;
    bananaGroup.add(banana);
    monkey.depth = banana.depth + 1;

  }
}

function spawnObstacles() {
  if (frameCount % 140 === 0) {
    obstacle = createSprite(420, 260, 10, 10);
    obstacle.addImage("abc", obstaceImage);
    obstacle.scale = 0.1;
    
obstacle.setCollider("rectangle",-10,0,450 ,420);
    
    obstacle.velocityX = -(6 + score / 4);
    obstacle.lifetime = 70;
    obstacleGroup.add(obstacle);
    

  }
}