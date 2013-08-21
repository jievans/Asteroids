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
    };

    this.update = function() {
      this.asteroids.forEach(function(asteroid, index) {
        asteroid.update({x: 1, y: 1});
        if (asteroid.offscreen()) {
          delete that.asteroids[index];
          that.asteroids[index] = Asteroid.randomAsteroid(that);
        }
        if(that.ship.isHit()){
          that.surviving = false;
        }
      });
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

  MovingObject.prototype.update = function(velocity) {
    this.position = { x: this.position.x + velocity.x,
                      y: this.position.y + velocity.y};
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
    this.game = game;
    this.radius = 5;
    this.position = {x: game.dimensions.x / 2, y: game.dimensions.y / 2};
  }

  Ship.inherits(MovingObject);

  Ship.prototype.draw = function() {
    var context = this.game.context;
    context.fillStyle = "blue";
    var size = this.radius * 2;
    context.fillRect(this.position.x, this.position.y, size, size);
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



})();



window.onload = function(){
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var myGame = new Game(context, 800, 600);
  console.log("hello");
  console.log(myGame);
  myGame.start();
};
