document.addEventListener('DOMContentLoaded', function () {
    var colorToggleButton = document.getElementById('colorToggleButton');
    var body = document.body;
    var imageA = document.getElementById('imageA');
    var imageB = document.getElementById('imageB');

    colorToggleButton.addEventListener('click', function () {
        // 切换整个页面的背景和文本颜色
        body.classList.toggle('invert');

        // 切换图片源
        if (body.classList.contains('invert')) {
            imageA.src = 'imgs/banner3.png';
            imageB.src = 'imgs/banner4.png';
        } else {
            imageA.src = 'imgs/banner1.png';
            imageB.src = 'imgs/banner2.png';
        }
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

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}


// function generateImage() {
//     const wrapper = document.querySelector('.wrapper');
//     const newImage = document.createElement('img');

//     const randomImage = 'imgs/bh' + Math.floor(Math.random() * 3 + 1) + '.png';
//     newImage.src = randomImage;


//     const screenWidth = window.innerWidth;


//     let maxX, maxY;

//     if (screenWidth <= 800) {
//         maxX = screenWidth - 500;
//         maxY = window.innerHeight - 10000;
//     } else {
//         maxX = screenWidth - 1000;
//         maxY = window.innerHeight - 10000;
//     }

//     newImage.style.left = Math.random() * maxX + 'px';
//     newImage.style.top = Math.random() * maxY + 'px';

//     const randomRotation = Math.random() * 360;
//     newImage.style.transform = 'rotate(' + randomRotation + 'deg)';

//     newImage.addEventListener('click', function () {
//         this.remove();
//     });

//     wrapper.appendChild(newImage);
// }


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


// script.js
// script.js
const gridItems = document.querySelectorAll('.grid-item');
const colorLog = document.querySelector('.color-log');

gridItems.forEach(item => {
  item.addEventListener('click', () => {
    const color = getRandomColor();
    item.style.backgroundColor = color;
    logColor(color);
  });
});

// 添加键盘事件监听
document.addEventListener('keydown', (event) => {
  const key = event.key.toUpperCase();
  const cell = document.getElementById(`cell${key}`);
  if (cell) {
    const color = getRandomColor();
    cell.style.backgroundColor = color;
    logColor(color);
  }
});

function logColor(color) {
  const colorLogItem = document.createElement('div');
  colorLogItem.classList.add('color-log-item');
  colorLogItem.style.backgroundColor = color;
  colorLog.appendChild(colorLogItem);
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


document.addEventListener('keydown', (event) => {
  const key = event.key.toUpperCase();
  // 检查按下的键是否为字母
  if (/^[A-I]$/.test(key)) {
    const cell = document.getElementById(`cell${key}`);
    if (cell) {
      const color = getRandomColor();
      cell.style.backgroundColor = color;
      logColor(color);
    }
  }
});
