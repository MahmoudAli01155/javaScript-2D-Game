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

  class Enemy { }

  class Layer { }

  class Background { }

  class UI {           //  Drawing game UI   Aya Hassan
    constractor(game){
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
    }
    update() {
      this.player.update();
    }
    draw(context) { 
      this.player.draw(context);
      this.ui.draw(context);
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
