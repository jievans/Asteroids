(function(){

  window.Asteroids = {};

  var run = Asteroids.run = function(){};

  function MovingObject(position){
    this.position = position;

    this.update = function(velocity){
      this.position = { x: this.position.x + velocity.x,
                        y: this.position.y + velocity.y}
    }

    this.offscreen = function(){
      var dimensions = Asteroids.dimensions
      this.position.x <= 0 || this.position.x >= dimensions.x ||
      this.position.y <= 0 || this.position.y >= dimensions.y
    }

  }





  return Asteroids;
})();