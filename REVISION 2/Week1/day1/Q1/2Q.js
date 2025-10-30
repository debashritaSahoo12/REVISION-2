const people = [
  { name: "A", age: 21 },
  { name: "B", age: 42 },
  { name: "C", age: 29 },
  { name: "D", age: 36 },
];
let res = people
  .sort((a, b) => b.age - a.age)
  .slice(0, 3)
  .reduce((acc, curr) => (acc += curr.age), 0);
console.log(res); //107
