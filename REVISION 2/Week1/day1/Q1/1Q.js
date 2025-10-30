const students = [
  { name: "Alice", marks: 85 },
  { name: "Bob", marks: 92 },
  { name: "Charlie", marks: 70 },
];
const res = students
  .filter((stud) => stud.marks > 80)
  .reduce(
    (acc, curr) => {
      acc.tot+= curr.marks
      acc.c++
      return acc
    },
    { tot: 0, c: 0 }
  );
console.log(res.tot/res.c); //88.5
