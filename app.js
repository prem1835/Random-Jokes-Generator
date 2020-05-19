// Selecting element
const factsTextBox = document.querySelector(".main__text");
const newJockBtn = document.querySelector(".button__newJock");
const timerBtn = document.querySelector(".button__timer");
const addFavsBtn = document.querySelector(".button__addfavs");
const openFavBtn = document.querySelector(".button__openfavs");
const timer = document.querySelector(".timer");
const favlist = document.querySelector(".favlist");
const clearFavBtn = document.querySelector(".button__clear");
const backBtn = document.querySelector(".button__back");
const homePage = document.querySelector(".homepage");
const favText = document.querySelector(".facts__textbox");

// global varible

const API_URL = "https://api.chucknorris.io/jokes/random";
let intervalId;
let timerStart;
let fact;
let factList = getSavedFacts();
let deleteBtn;
let wrapper;

// function

function getSavedFacts() {
  const factJSON = localStorage.getItem("fact");
  try {
    return factJSON ? JSON.parse(factJSON) : [];
  } catch (e) {
    return [];
  }
}

function preLoader() {
  const loading = `<div class="loader">
    <img
      src="./images/loading-bar.gif"
      alt="Loading..."
      class="loader__img"
    />
  </div>`;
  factsTextBox.innerHTML = loading;
}
function newJock() {
  preLoader();
  axios
    .get(API_URL)
    .then((res) => {
      fact = res.data.value;
      factsTextBox.textContent = fact;
    })
    .catch((err) => {
      console.log(err);
    });
  addFavsBtn.textContent = "ADD TO FAVS";
  addFavsBtn.style.color = "#acaaf5";
}

function countdownTimer() {
  timerStart -= 0.1;
  if (timerStart <= 0.0) {
    timerStart = 3.1;
  }
  timer.textContent = `NEW JOKE IN ${timerStart.toFixed(1)}`;
}

function startTimer() {
  if (timerBtn.textContent.includes("START")) {
    intervalId = setInterval(newJock, 3000);
    intervalId2 = setInterval(countdownTimer, 100);
    timerStart = 3.1;
    timerBtn.textContent = "STOP 3 SEC TIMER";
  } else if (timerBtn.textContent.includes("STOP")) {
    clearInterval(intervalId);
    clearInterval(intervalId2);
    timerBtn.textContent = "START 3 SEC TIMER";
    timer.textContent = "";
  }
}
function addFactToList() {
  if (addFavsBtn.textContent.includes("ADD") & (fact !== undefined)) {
    factList.push(fact);
    addFavsBtn.textContent = "DELETE FROM FAVS";
    addFavsBtn.style.color = "#fc6969";
  } else if (addFavsBtn.textContent.includes("DELETE")) {
    factList.pop();
    addFavsBtn.textContent = "ADD TO FAVS";
    addFavsBtn.style.color = "#acaaf5";
  }
  if (factList.length === 10) {
    factList.shift();
  }
  writeFact();
}
writeFact();
function writeFact() {
  favText.innerHTML = "";
  localStorage.setItem("fact", JSON.stringify(factList));
  if (factList.length > 0) {
    factList.forEach((factt, index) => {
      let output = `
          <div class='wrapper'>
          <div class="facts__text fav__text">
           ${factt}
          </div>
          <div class="bottom-wrapper">
            <span class="favfactnumber">${index + 1}</span>
            <div class="btn-2 button__delete">
              DELETE
            </div>
          </div>
          </div>`;
      favText.innerHTML += output;
    });
  } else {
    const emptymsg = document.createElement("p");
    emptymsg.classList.add("emptymsg");
    emptymsg.textContent = "No Favs to show 🧙‍♂️";
    favText.appendChild(emptymsg);
  }
  wrapper = document.querySelectorAll(".wrapper");
  deleteBtn = document.querySelectorAll(".button__delete");
  deletefav();
}
function openFavList() {
  favlist.classList.remove("disable");
  homePage.classList.add("disable");
}

function clearFavButton() {
  localStorage.clear();
  factList = [];
  writeFact();
  addFavsBtn.textContent = "ADD TO FAVS";
  addFavsBtn.style.color = "#acaaf5";
}

function deleteButton(btn, index) {
  factList.splice(index, 1);
  localStorage.setItem("fact", JSON.stringify(factList));

  wrapper.forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target === btn) {
        // el.remove();
        writeFact();
      }
      wrapper = document.querySelectorAll(".wrapper");
      deleteBtn = document.querySelectorAll(".button__delete");
      if (deleteBtn.length === 0) {
        addFavsBtn.textContent = "ADD TO FAVS";
        addFavsBtn.style.color = "#acaaf5";
      }
    });
  });
}

function backButton() {
  favlist.classList.add("disable");
  homePage.classList.remove("disable");
}

function deletefav() {
  if (deleteBtn.length > 0) {
    deleteBtn.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        deleteButton(btn, index);
      });
    });
  }
}
deletefav();

// Adding event listener

backBtn.addEventListener("click", backButton);
newJockBtn.addEventListener("click", newJock);
addFavsBtn.addEventListener("click", addFactToList);
timerBtn.addEventListener("click", startTimer);
openFavBtn.addEventListener("click", openFavList);
clearFavBtn.addEventListener("click", clearFavButton);
