
let body = document.body;
let headlines = document.querySelectorAll("h1");

console.log(headlines);

// uses forEach to loop through all of the headlines
headlines.forEach(function(headline) {
  // add an event listener to each individual headline
  headline.addEventListener('click', function (event) {
    // toggle the red class on this headline
    headline.classList.toggle("red");
  });
});


let teenDramas = ["Gossip Girl", "90210", "Degrassi", "Riverdale", "13 Reasons Why", "Euphoria", "Dawsons Creek"];

for (let i = 0; i < teenDramas.length; i++) {
  console.log(teenDramas[i], "is in spot", i);
}