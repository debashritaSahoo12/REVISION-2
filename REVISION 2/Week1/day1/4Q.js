const employees = [
  { name: "Amit", dept: "Tech", salary: 70000, rating: 4.8 },
  { name: "Neha", dept: "Tech", salary: 60000, rating: 4.2 },
  { name: "Ravi", dept: "HR", salary: 55000, rating: 4.7 },
  { name: "Sonia", dept: "Tech", salary: 75000, rating: 4.9 },
  { name: "Karan", dept: "Finance", salary: 50000, rating: 3.9 },
];
let tech = employees.filter((e) => e.dept == "Tech" && e.rating > 4.5);
let names = tech.map((e) => e.name);
console.log(names);
let sortedtech = tech
  .sort((a, b) => b.salary - a.salary)
  .reduce((acc, curr) => acc + curr.salary, 0);
console.log("Total Salary:", sortedtech);
