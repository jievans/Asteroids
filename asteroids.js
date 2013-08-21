Function.prototype.inherits = function(Parent){
  function Surrogate(){}
  Surrogate.prototype = Parent.prototype;
  this.prototype = new Surrogate();
}

(function(){
  // TODO
  // must define dimensions on Game
  // must actually get a canvas context for Game

  function Game(context) {
    var that = this;
    this.context = context;
    this.asteroids = [];

    for( var i = 0; i < 10; i++) {
      this.asteroids.push(Asteroid.randomAsteroid());
    }

    this.draw = function() {
      this.asteroids.forEach(function(asteroid) {
        asteroid.draw();
      });
    };

    this.update = function() {
      this.asteroids.forEach(function(asteroid) {
        asteroid.update();
      });
    };

    this.start = function() {
      window.setInterval(function() {
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
    var dimensions = Game.dimensions
    this.position.x <= 0 || this.position.x >= dimensions.x ||
    this.position.y <= 0 || this.position.y >= dimensions.y
  };

  function Asteroid(position){
    MovingObject.call(this, position);

    this.draw = function() {
      var context = Game.context;
      context.fillStyle = "red";
      context.fillRect(this.position.x, this.position.y, 5, 5);
    };
  }

  Asteroid.randomAsteroid = function(){
    position = {x: Math.random() * Game.dimensions.x,
                y: Math.random() * Game.dimensions.y};
    return new Asteroid(position);
  };

  Asteroid.inherits(MovingObject);


})();