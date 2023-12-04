document.addEventListener('DOMContentLoaded', function () {
    var colorToggleButton = document.getElementById('colorToggleButton');

    colorToggleButton.addEventListener('click', function () {
        document.body.classList.toggle('invert');
    });
});


var music = document.getElementById("music");
    var myaudio = document.getElementById("myaudio");
    var pausedTime = 0;

    music.addEventListener("click", function() {
        // 如果音频正在播放，则暂停
        if (myaudio.paused) {
            myaudio.play();
            music.textContent = "⏸️"; // 按钮文本改为暂停
        } else {
            myaudio.pause();
            pausedTime = myaudio.currentTime; // 记录暂停时的时间
            music.textContent = "🎵"; // 按钮文本改为播放
        }
    });

    // 添加音频播放结束事件监听器
    myaudio.addEventListener("ended", function() {
        music.textContent = "🎵"; // 按钮文本改为播放
    });
    

var myButton = document.getElementById("backtohome");

// 添加点击事件
myButton.addEventListener("click", function() {
    // 在这里设置要跳转的网页地址
    window.location.href = "https://ni0j.github.io/entries/index2.html";
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
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}


// JavaScript function to show danmaku
function showDanmaku() {
  const danmakuContainer = document.getElementById('danmakuContainer');

  // Define your text options
  const textOptions = ['Buy Me', 'So Feeling', ];

  // Randomly choose between text A and text B
  const danmakuText = textOptions[Math.floor(Math.random() * textOptions.length)];

  // Create a new danmaku element
  const newDanmaku = document.createElement('div');
  newDanmaku.innerText = danmakuText;

  // Set random position and direction
  const initialX = getRandomNumber(0, window.innerWidth);
  const initialY = getRandomNumber(0, window.innerHeight);
  const direction = Math.random() < 0.5 ? 1 : -1; // 1 for left to right, -1 for right to left

  // Set initial position outside the viewport based on direction
  newDanmaku.style.transform = `translate(${initialX}px, ${initialY}px) scaleX(${direction})`;

  // Append danmaku to the container
  danmakuContainer.appendChild(newDanmaku);

  // Animate the danmaku
  const animation = newDanmaku.animate([
      { transform: `translate(${initialX}px, ${initialY}px) scaleX(${direction})` },
      { transform: `translate(${direction === 1 ? window.innerWidth : -100}px, ${initialY}px) scaleX(${direction})` }
  ], {
      duration: 5000, // Adjust the duration as needed
      easing: 'linear',
      iterations: 1
  });

  // Remove the danmaku element after the animation completes
  animation.onfinish = () => {
      danmakuContainer.removeChild(newDanmaku);
  };
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
