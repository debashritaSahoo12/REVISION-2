console.log(a); //undefined
var a = 10;
function test() {
  console.log(a); //undefined
  var a = 20;
}
test();

//explanation: var hoisted but intialized as undefined