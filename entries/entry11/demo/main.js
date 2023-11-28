
let button = document.querySelector(".button");
let colors = ["#255c34", "#726756", "#703a56", "#953e00"];
let body = document.querySelector("body");

function newColor() {
  let randIndex = Math.floor(Math.random() * colors.length);
  let randColor = colors[randIndex];
  body.style.backgroundColor = randColor;
}

button.addEventListener("click", newColor);