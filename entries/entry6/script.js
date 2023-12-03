document.addEventListener('DOMContentLoaded', function () {
    var colorToggleButton = document.getElementById('colorToggleButton');

    colorToggleButton.addEventListener('click', function () {
        document.body.classList.toggle('invert');
    });
});


function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function applyRandomFlashEffect(element) {
    const filterValue = `grayscale(${getRandomValue(0, 100)}%)`;
    const opacityValue = getRandomValue(0, 100) / 100;
  
    element.style.filter = filterValue;
    element.style.opacity = opacityValue;
  }
  
  function startRandomFlashing() {
    const imageA = document.getElementById('imageA');
    const imageB = document.getElementById('imageB');
  
    setInterval(() => {
      applyRandomFlashEffect(imageA);
      applyRandomFlashEffect(imageB);
  
      // Random animation delay in seconds (adjust the range as needed)
      const delayInSeconds = getRandomValue(1, 3);
      const delayInMilliseconds = delayInSeconds * 20;
  
      setTimeout(() => {
        applyRandomFlashEffect(imageA);
        applyRandomFlashEffect(imageB);
      }, delayInMilliseconds);
    }, getRandomValue(5, 100)); // Adjust the interval range as needed
  }
  
  startRandomFlashing();
  
  


function generateImage() {
    const wrapper = document.querySelector('.wrapper');
    const newImage = document.createElement('img');

    const randomImage = 'imgs/bh' + Math.floor(Math.random() * 3 + 1) + '.png';
    newImage.src = randomImage;


    const screenWidth = window.innerWidth;


    let maxX, maxY;

    if (screenWidth <= 800) {
        maxX = screenWidth - 500;
        maxY = window.innerHeight - 10000;
    } else {
        maxX = screenWidth - 1000;
        maxY = window.innerHeight - 10000;
    }

    newImage.style.left = Math.random() * maxX + 'px';
    newImage.style.top = Math.random() * maxY + 'px';

    const randomRotation = Math.random() * 360;
    newImage.style.transform = 'rotate(' + randomRotation + 'deg)';

    newImage.addEventListener('click', function () {
        this.remove();
    });

    wrapper.appendChild(newImage);
}


//save 
// document.addEventListener('DOMContentLoaded', function () {
//     var colorToggleButton = document.getElementById('colorToggleButton');

//     colorToggleButton.addEventListener('click', function () {
//         document.body.classList.toggle('invert');
//     });
// });


  

//   function generateImage() {
//     const wrapper = document.querySelector('.wrapper');


//     const newImage = document.createElement('img');

//     // this will randomly choose an img from bh1, bh2, bh3
//     const randomImage = 'imgs/bh' + Math.floor(Math.random() * 3 + 1) + '.png';

//     newImage.src = randomImage;

//     // random position
//     const maxX = window.innerWidth - 1000; 
//     const maxY = window.innerHeight - 10000; 

//     newImage.style.left = Math.random() * maxX + 'px';
//     newImage.style.top = Math.random() * maxY + 'px';

//     // random angle
//     const randomRotation = Math.random() * 360;
//     newImage.style.transform = 'rotate(' + randomRotation + 'deg)';

    

//     newImage.addEventListener('click', function () {
//         this.remove();
//     });

//     wrapper.appendChild(newImage);
// }
