function sum() {
  var total = 0;
  args = Array.prototype.slice.call(arguments);
  args.forEach(function(el) {
    total += el;
  });

  return total;
}

// console.log(sum(1, 2, 3, 4 ,5));

Function.prototype.myBind = function(object) {
  var that = this;
  var oldArgs = Array.prototype.slice.call(arguments, 1);

  return function() {
    var newArgs = Array.prototype.slice.call(arguments);
    that.apply(object, oldArgs.concat(newArgs));
  };
}

// var myObj = {
//   name: "hello"
// };
//
// function printName() {
//   var args = Array.prototype.slice.call(arguments);
//   console.log(this.name);
//   args.forEach(function(arg) {
//     console.log(arg);
//   });
// }
//
//
// var newPrintName = printName.myBind(myObj, 1, 2, 3);
// newPrintName(4, 5);

function curriedSum(numArgs) {
  var numbers = [];
  function _curriedSum(number){
    numbers.push(number);
    if (numbers.length === numArgs) {
      var total = 0;
      numbers.forEach(function(num) {
        total += num;
      });

      return total;
    } else {
      return _curriedSum;
    }
  }
  return _curriedSum;
}

// var sum = curriedSum(4);
// console.log(sum(1)(2)(3)(4));

Function.prototype.curry = function(numArgs){
  var that = this;
  var args = [];

  return function currier(){
    // args.concat(arguments);
    args.push(arguments[0]);
    if (args.length === numArgs){
      that.apply(null, args)
    } else{
      return currier;
    }
    // Array.prototype.slice.call(arguments)
  };
}

function printThings(){
  var args = Array.prototype.slice.call(arguments);
  args.forEach(function(arg){
    console.log(arg)
  });
}

var curry = printThings.curry(4);

// printThings(1,2,3,4);

console.log(curry(1)(2)(3)(4));