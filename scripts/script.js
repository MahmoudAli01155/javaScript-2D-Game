window.addEventListener("load", function () {
  // canvas setup
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 700;
  canvas.height = 500;

  class InputHandler { 
    constructor(game){
      this.game=game;
      window.addEventListener('keydown', e =>{
        if ((  (e.key === 'ArrowUp') ||
              (e.key === 'ArrowDown')
        ) &&this.game.keys.indexOf(e.key) === -1){
          this.game.keys.push(e.key)
        }
        console.log(this.game.keys)
      });
      window.addEventListener('keyup',e=>{
        if(this.game.keys.indexOf(e.key) > -1){
          this.game.keys.splice(this.game.keys.indexOf(e.key),1);
        }
        console.log(this.game.keys);
      })
    }
  
  }

  class Projectile { }

  class Particle { }

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 120;
      this.height = 190;
      this.x = 20;
      this.y = 100;
      this.speedY = 0;
      this.maxSpeed = 5;
    }
    update() {
      if(this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
      else if(this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
      else this.speedY = 0;
      this.y += this.speedY;

    }
    draw(context) {
      context.fillRect(this.x, this.y, this.width, this.height);

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

  class Layer { }

  class Background { }

  class UI { }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.keys=[];
      this.enemies=[];//list of enemies to contain all enemy
      this.enemyTimer=0;
      this.enemyInterval=1000; //this tow properties to create every 1s enemy
      this.gameOver=false; 
    }
    update(deltaTime) {
      this.player.update();
      this.enemies.forEach(enemy => {
        enemy.update() // call update method all enmies on window to move them 
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

      this.enemies.forEach(enemy => {
        enemy.draw(context); // call draw method all enmies on window to draw them  after moving
      });
    }
    //this function to addEnemy to window 
    addEnemy(){
      this.enemies.push(new Angler1(this));  //add instance from Angler1 to list enemies
      console.log(this.enemies);
    }
  }
  const game = new Game(canvas.width, canvas.height);
  // Animation loop m7moudn hassan
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //to clear when redraw game
    game.update();
    game.draw(ctx); 
    requestAnimationFrame(animate); //to start animation
  }
  animate();
})
