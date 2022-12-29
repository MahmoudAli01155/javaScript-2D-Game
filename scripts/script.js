window.addEventListener("load", function () {
  // canvas setup
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 700;
  canvas.height = 500;

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowUp" || e.key === "ArrowDown") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        } else if (e.key === " ") {
          this.game.player.shootTop();
        }
      });
      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }
  //7 creat class Projectile
  class Projectile {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 3;
      this.markedForDeletion = false;
    }
    //7 meathod to change the Position of projectle using it's speed attribute
    update() {
      this.x += this.speed;
      // the condation to Deleton the Projectile
      if (this.x > game.width * 0.8) this.markedForDeletion = true;
    }
    //7
    draw(context) {
      context.fillStyle = "yellow";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Particle {}

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 120;
      this.height = 190;
      this.x = 20;
      this.y = 100;
      this.speedY = 0;
      this.maxSpeed = 5;
      this.projectiles = [];
    }
    update() {
      if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes("ArrowDown"))
        this.speedY = this.maxSpeed;
      else this.speedY = 0;
      this.y += this.speedY;
      //7 handel projectiles
      this.projectiles.forEach((projectile) => {
        projectile.update();
      });
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDeletion
      );
    }
    draw(context) {
      context.fillStyle = "black";
      context.fillRect(this.x, this.y, this.width, this.height);
      this.projectiles.forEach((projectile) => {
        projectile.draw(context);
      });
    }
    //7 creat method to shoot from mouse
    shootTop() {
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 30)
        );
        this.game.ammo--;
      }
    }
  }


  //Base enemy class lesson 10 m7moud hassan
  class Enemy { 
    constructor(game) //get argument game as object from class Game
    {
      this.game=game; //assign game to game to use game in this class after
      this.x=this.game.width; //get width of game (game there is enemy)
      this.speedX=Math.random() * -1.5 -0.5; //speed game (enemy) in x axis ex: (0.9001*-1.5)=1.35015-5=-1.85015 is negative because enemy move on x axis
      this.markedForDeletation=false;
      this.lives=5;
      this.score=this.lives;
    }

    //this function use to update place enemy and move it
    update(){
      this.x+=this.speedX; //increase x by speedx to move enemy
      if(this.x+this.width<0) this.markedForDeletation=true //check if enemy reach to end screen delete it
    }

    //this function use to draw enemy afetr move it (after call update method)
    draw(context){ //get context argument as parameter (context instance from convas)
      context.fillStyle='red'; //color red
      context.fillRect(this.x,this.y,this.width,this.height); //draw rectangle in position x,y and width and height
      context.fillStyle='black'; //color black
      context.font='20px Helvetica'; //
      context.fillText(this.lives,this.x,this.y); //draw text like 5
    }
  }

  //then create types from enemy first angler1
  class Angler1 extends Enemy{//Enemy is the parent class and angler1 is child this mean angler contain all 
                              //properties of class enemy (update and draw and game x speedx ..)
        constructor(game){ //get parameter game  and pass it to super class (Enemy)
          super(game); //because Enemy need parameter game then nedd pass game to it
          this.width=228 *0.2; //
          this.height=169 *0.2;
          this.y=Math.random()* (this.game.height *0.9 -this.height); //set y axis by random
        }                      
  }

  class Layer {}

  class Background {}

  class UI {           //  Drawing game UI   Aya Hassan
    constructor(game){
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = 'Helvetica';
      this.color = 'yellow';
    }
    draw(context){
        // ammo
        context.fillStyle = this.color;
        for(let i =0; i < this.game.ammo;i++){
          context.fillRect(20 + 5 * i,50,3,20)
        }
    }
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.keys=[];
      this.enemies=[];//list of enemies to contain all enemy
      this.enemyTimer=0;
      this.enemyInterval=1000; //this tow properties to create every 1s enemy
      this.gameOver=false; 
      this.ammo = 20;
      this.maxAmmo = 50;
      this.amoTimer = 0;
      this.ammoInterval = 500; // shoots refill after half a second
    }
    update(deltaTime) {
      this.player.update();
      if (this.ammoTimer > this.ammoInterval){
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      }else{
        this.ammoTimer += deltaTime;
      }
      this.enemies.forEach(enemy => {
        enemy.update() // call update method all enmies on window to move them 
        if(this.checkCollision(this.player,enemy)){ //check here if exists collision between player and enemy
          enemy.markedForDeletation=true; //delete enemy
        }
        this.player.projectiles.forEach(projectile =>{ //then check for all projectile if collision with enemy to delete it
          if(this.checkCollision(projectile,enemy)){
            enemy.lives--; 
            projectile.markedForDeletation=true; //delete projectile
            if(enemy.lives <= 0){
              enemy.markedForDeletation=true; //delete enemy if lives of it equel 0
              this.score+=enemy.score;
            }
          }
        })
      });
      this.enemies=this.enemies.filter(enemy =>!enemy.markedForDeletation);//filter enemies and get enmies active only
      if(this.enemyTimer>this.enemyInterval && !this.gameOver)//check if timer over or not or game overOrNot
      {
        //if true add enemy to window and rest timer
        this.addEnemy();
        this.enemyTimer=0;
      }else{
        //not  increate timer
        this.enemyTimer+=deltaTime;
      }
    }
    draw(context) { 
      this.player.draw(context);

      this.ui.draw(context);

      this.enemies.forEach(enemy => {
        enemy.draw(context); // call draw method all enmies on window to draw them  after moving
      });
    }
    //this function to addEnemy to window 
    addEnemy(){
      this.enemies.push(new Angler1(this));  //add instance from Angler1 to list enemies
      console.log(this.enemies);
    }
    //m7moud check collision return true or false 
    checkCollision(rect1,rect2){
      //take tow parameter to check collision
      return   rect1.x<rect2.x + rect2.width &&
          rect1.x+rect1.width>rect2.x&&
          rect1.y<rect2.y+rect2.height &&
          rect1.height+rect1.y>rect2.y;
      
    }
  }
  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  // Animation loop m7moudn hassan
  function animate(timeStamp) {
    const deltaTime = timeStamp- lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height); //to clear when redraw game
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate); //to start animation
  }
  animate(0);
});
