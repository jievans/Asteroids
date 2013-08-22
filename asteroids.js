Function.prototype.inherits = function(Parent){
  function Surrogate(){}
  Surrogate.prototype = Parent.prototype;
  this.prototype = new Surrogate();
};

// (function(){console.log("Hello");})();

(function(){
  // TODO
  // must define dimensions on Game
  // must actually get a canvas context for Game

  function Game(context, xDim, yDim) {
    var that = this;
    this.context = context;
    this.asteroids = [];
    this.bullets = [];
    this.dimensions = {x: xDim, y: yDim};
    this.ship = new Ship(this);
    this.surviving = true;

    for( var i = 0; i < 10; i++) {
      this.asteroids.push(Asteroid.randomAsteroid(this));
    }

    // this.Asteroid = function() {
    //   var aster = new Asteroid();
    //   aster.game = this;
    //   return aster;
    // }

    this.draw = function() {
      this.asteroids.forEach(function(asteroid) {
        asteroid.draw();
      });
      this.ship.draw();
      this.bullets.forEach(function(bullet) {
        bullet.draw();
      });
    };

    this.update = function() {
      this.asteroids.forEach(function(asteroid, index) {
        asteroid.update();
        if (asteroid.offscreen()) {
          delete that.asteroids[index];
          that.asteroids[index] = Asteroid.randomAsteroid(that);
        }
      });

      this.bullets.forEach(function(bullet, index) {
        bullet.update();
        if (bullet.offscreen()) {
          delete that.bullets[index];
        } else {
          that.asteroids.forEach(function(asteroid, astIndex) {
            if (bullet.isHit(asteroid)) {
                 delete that.asteroids[astIndex];
                 that.asteroids[astIndex] = Asteroid.randomAsteroid(that);
                 delete that.bullets[index];
               }
          });
        }

      });

      this.bullets = this.bullets.filter(Boolean);

      if(that.ship.isHit()){
        that.surviving = false;
      }

      this.ship.update();

      if(this.ship.offscreen){
        this.ship.replacePosition();
      }
    };

    this.start = function() {
      var id = window.setInterval(function() {
        if (that.surviving === true){
          that.context.clearRect(0, 0, xDim, yDim);
          that.update();
          that.draw();
        } else {
          console.log("You just got powned.");
          clearInterval(id);
        }
      }, 30);
    };

  };

  window.Game = Game;

  // var run = Game.run = function(){};

  function MovingObject(position){
    this.position = position;
  }

  MovingObject.prototype.update = function() {
    this.position = { x: this.position.x + this.velocity.x,
                      y: this.position.y + this.velocity.y};
  };

  MovingObject.prototype.offscreen = function(){
    var dimensions = this.game.dimensions;
    return (this.position.x <= 0 || this.position.x >= dimensions.x ||
            this.position.y <= 0 || this.position.y >= dimensions.y)
  };

  function Asteroid(game, position){
    MovingObject.call(this, position);
    this.game = game;
    this.radius = 7;
    this.velocity = {x: 1, y: 1};

    this.draw = function() {
      var context = this.game.context;
      context.fillStyle = "red";
      var size = this.radius * 2;
      context.fillRect(this.position.x, this.position.y, size, size);
    };
  }

  Asteroid.randomAsteroid = function(game) {
    position = {x: Math.random() * game.dimensions.x,
                y: Math.random() * game.dimensions.y};
    return new Asteroid(game, position);
  };

  Asteroid.inherits(MovingObject);

  function Ship(game){
    var that = this;
    this.game = game;
    this.radius = 5;
    this.position = {x: game.dimensions.x / 2, y: game.dimensions.y / 2};
    this.velocity = { x: 0, y: 0 };

    key('up', function() { that.power(0, -1); } );
    key('down', function() { that.power(0, 1); } );
    key('left', function() { that.power(-1, 0); } );
    key('right', function() { that.power(1, 0); } );
    key('space', function() { that.fireBullet(); } );

  }

  Ship.inherits(MovingObject);

  Ship.prototype.draw = function() {
    var context = this.game.context;
    context.fillStyle = "blue";
    var size = this.radius * 2;
    context.fillRect(this.position.x, this.position.y, size, size);
  };

  // Ship.prototype.update = function() {
//     this.position = { x: this.position.x + this.velocity.x,
//                       y: this.position.y + this.velocity.y};
//   };

  Ship.prototype.power = function(dx, dy) {
    this.velocity.x += dx;
    this.velocity.y += dy;
  };

  Ship.prototype.isHit = function(){
    var that = this;
    var hit = false;
    this.game.asteroids.forEach(function(asteroid){
      var distance = Math.sqrt(
        Math.pow(asteroid.position.x - that.position.x, 2)
      + Math.pow(asteroid.position.y - that.position.y, 2)
      );
      var sumRadii = asteroid.radius + that.radius;
      if( distance < sumRadii){
        hit = true;
      }
    });
    return hit;
  };

  Ship.prototype.replacePosition = function(){
    if(this.position.x <= 0){
      this.position.x = this.game.dimensions.x;
    } else if(this.position.x >= this.game.dimensions.x){
      this.position.x = 0;
    }

    if(this.position.y <= 0){
      this.position.y = this.game.dimensions.y;
    } else if(this.position.y >= this.game.dimensions.y){
      this.position.y = 0;
    }
  };

  Ship.prototype.fireBullet = function(){
    var currentDirection = {}
    var speed = Math.sqrt(Math.pow(this.velocity.x, 2)
                          + Math.pow(this.velocity.y, 2));

    currentDirection.x = this.velocity.x / speed
    currentDirection.y = this.velocity.y / speed

    new Bullet(this.game, this.position, currentDirection)
  };

  function Bullet(game, position, direction){
    MovingObject.call(this, position)
    this.game = game;
    this.game.bullets.push(this);
    this.direction = direction;
    this.speed = 10;
    this.velocity = { x: this.direction.x * this.speed,
                      y: this.direction.y * this.speed };

    this.position;
    this.radius = 3;
  }
  Bullet.inherits(MovingObject);

  Bullet.prototype.draw = function() {
    var context = this.game.context;
    context.fillStyle = "purple";
    var size = this.radius * 2;
    context.fillRect(this.position.x, this.position.y, size, size);
  };

  Bullet.prototype.isHit = function(asteroid) {
    var that = this;
    var hit = false;

    var distance = Math.sqrt(
      Math.pow(asteroid.position.x - that.position.x, 2)
    + Math.pow(asteroid.position.y - that.position.y, 2)
    );
    var sumRadii = asteroid.radius + that.radius;
    if( distance < sumRadii){
      hit = true;
    }
    return hit;
  };

  Bullet.prototype.update = function() {
    this.position = { x: this.position.x + this.velocity.x,
                      y: this.position.y + this.velocity.y};
  };





})();



window.onload = function(){
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var myGame = new Game(context, 800, 600);
  console.log("hello");
  console.log(myGame);
  myGame.start();
};
