const API_KEY = "f0743c83922cb2a5a45486ba9ae57d42";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("moviesContainer");
const loading = document.getElementById("loading");
const message = document.getElementById("message");
const searchInput = document.getElementById("searchInput");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
let currentQuery = "";
let totalPages = 1;
let isThrottled = false;

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function throttle(func, limit) {
  if (isThrottled) return;
  isThrottled = true;
  func();
  setTimeout(() => (isThrottled = false), limit);
}

async function fetchMovies(page = 1, query = "") {
  showLoading(true);
  message.textContent = "";
  let url = query
    ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`
    : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response failed");
    const data = await res.json();

    if (data.results.length === 0) {
      showMessage("No movies found.");
      renderMovies([]);
      return;
    }

    totalPages = data.total_pages;
    renderMovies(data.results);
    updatePagination();
  } catch (error) {
    showMessage("An error occurred while fetching movies.");
  } finally {
    showLoading(false);
  }
}

function renderMovies(movies) {
  moviesContainer.innerHTML = "";
  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = `
      <img src="${
        movie.poster_path
          ? IMAGE_BASE + movie.poster_path
          : "https://via.placeholder.com/500x750?text=No+Image"
      }" alt="${movie.title}" />
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</p>
      </div>
    `;
    moviesContainer.appendChild(card);
  });
}

function showLoading(isLoading) {
  loading.style.display = isLoading ? "block" : "none";
}

function showMessage(msg) {
  message.textContent = msg;
}

function updatePagination() {
  pageInfo.textContent = `Page ${currentPage}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage >= totalPages;
}

const handleSearch = debounce(() => {
  currentQuery = searchInput.value.trim();
  currentPage = 1;
  fetchMovies(currentPage, currentQuery);
}, 600);

searchInput.addEventListener("input", handleSearch);

prevBtn.addEventListener("click", () =>
  throttle(() => {
    if (currentPage > 1) {
      currentPage--;
      fetchMovies(currentPage, currentQuery);
    }
  }, 1000)
);

nextBtn.addEventListener("click", () =>
  throttle(() => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchMovies(currentPage, currentQuery);
    }
  }, 1000)
);

fetchMovies();
