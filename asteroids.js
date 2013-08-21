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
    };

    this.update = function() {
      this.asteroids.forEach(function(asteroid, index) {
        asteroid.update({x: 1, y: 1});
        if (asteroid.offscreen()) {
          console.log("asteroids are being deleted!!!");
          delete that.asteroids[index];
          that.asteroids[index] = Asteroid.randomAsteroid(that);
        }
      });
    };

    this.start = function() {
      window.setInterval(function() {
        that.context.clearRect(0, 0, xDim, yDim);
        that.update();
        that.draw();
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
    var dimensions = this.game.dimensions
    console.log(this.position.x, this.position.y);
    return (this.position.x <= 0 || this.position.x >= dimensions.x ||
            this.position.y <= 0 || this.position.y >= dimensions.y)
  };

  function Asteroid(game, position){
    MovingObject.call(this, position);
    this.game = game;

    this.draw = function() {
      var context = game.context;
      context.fillStyle = "red";
      context.fillRect(this.position.x, this.position.y, 5, 5);
    };
  }

  Asteroid.randomAsteroid = function(game) {
    position = {x: Math.random() * game.dimensions.x,
                y: Math.random() * game.dimensions.y};
    return new Asteroid(game, position);
  };

  Asteroid.inherits(MovingObject);


})();



window.onload = function(){
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var myGame = new Game(context, 800, 600);
  console.log("hello");
  console.log(myGame);
  myGame.start();
};
