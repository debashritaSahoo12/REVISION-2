const searchInput = document.getElementById("searchInput");
const sortName = document.getElementById("sortName");
const sortArea = document.getElementById("sortArea");
const sortCat = document.getElementById("sortCat");
const reset = document.getElementById("reset");
const result = document.getElementById("result");

let allMeals = [];
let filterMeals = [];

searchInput.addEventListener("input", inputHandle);
sortName.addEventListener("change", applySorting);
sortArea.addEventListener("change", applySorting);
sortCat.addEventListener("change", applySorting);
reset.addEventListener("click", resetHandle);

async function fetchMeals() {
  let res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?f=a"
  );
  let data = await res.json();
  allMeals = data.meals;
  filterMeals = [...allMeals];
  displayMeals(filterMeals);
}

function displayMeals(meals) {
  result.innerHTML = "";
  meals.forEach((meal) => {
    let div = document.createElement("div");
    div.innerHTML = `
    <h3>${meal.strMeal}</h3>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200px">
    <p><strong>Category:</strong>${meal.strCategory}</p>
    <p><strong>Area:</strong>${meal.strArea}</p>
    `;
    result.appendChild(div);
  });
}

function inputHandle() {
  const query = searchInput.value.toLowerCase();
  filterMeals = allMeals.filter(
    (meal) =>
      meal.strMeal.toLowerCase().includes(query) ||
      meal.strCategory.toLowerCase().includes(query)
  );
  applySorting();
}

function applySorting() {
  let sortedMeals = [...filterMeals];

  if (sortName.value !== "") {
    sortedMeals.sort((a, b) =>
      sortName.value === "asc"
        ? a.strMeal.localeCompare(b.strMeal)
        : b.strMeal.localeCompare(a.strMeal)
    );
  }
  if (sortArea.value !== "") {
    sortedMeals.sort((a, b) =>
      sortArea.value === "asc"
        ? a.strArea.localeCompare(b.strArea)
        : b.strArea.localeCompare(a.strArea)
    );
  }
  if (sortCat.value !== "") {
    sortedMeals.sort((a, b) =>
      sortCat.value === "asc"
        ? a.strCategory.localeCompare(b.strCategory)
        : b.strCategory.localeCompare(a.strCategory)
    );
  }
  displayMeals(sortedMeals);
}

function resetHandle() {
  filterMeals = [...allMeals];
  searchInput.value = "";
  sortName.value = "";
  sortArea.value = "";
  sortCat.value = "";
  displayMeals(filterMeals);
}

fetchMeals();
