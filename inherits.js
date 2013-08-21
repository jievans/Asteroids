Function.prototype.inherits = function(Parent){
  function Surrogate(){}

  Surrogate.prototype = Parent.prototype;

  this.prototype = new Surrogate();
}

// TESTING
// function Animal(){};
// Animal.prototype.color = "pink";
// function Dog(){};
// Dog.inherits(Animal);
//
// var myDog = new Dog();
// console.log(myDog.color);