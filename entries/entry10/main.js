console.log("hello!");


// 获取点击的banner1元素
var banner1 = document.getElementById('imageA');

// 获取cover元素
var cover = document.querySelector('.cover');

// 添加事件监听器，点击banner1时切换图片和背景
banner1.addEventListener('click', function() {
  // 获取所有需要更改颜色的元素
  var textElements = document.querySelectorAll('.text, .text2, .paragraphjp1, .paragraphjp2, .paragraphjp3, .paragraphen1, .paragraphen2, .paragraphen3, .credit-text');

  // 遍历元素并应用新的颜色类
  textElements.forEach(function(element) {
    element.classList.toggle('text-color-change');
  });

  // 显示或隐藏cover
  cover.classList.toggle('show-cover');

  // 切换图片
  banner1.src = 'imgs/banner2.png'; // 替换为你的banner2图片路径
});

// 添加事件监听器，悬停banner1时应用新的鼠标指针样式
banner1.addEventListener('mouseover', function() {
  banner1.classList.add('pointer-click');
});

banner1.addEventListener('mouseout', function() {
  banner1.classList.remove('pointer-click');
});




// function turnOnLight() {
//     console.log("Lights on!");
//   }
  
//   let button = document.querySelector(".button");
//   button.addEventListener("click", turnOnLight);


// let body = document.body;

// function turnOnLight() {
//   body.classList.add("light");
//   button.classList.add("buttonOn");
// }

// let button = document.querySelector(".button");
// button.addEventListener("click", turnOnLight);


let body = document.body;

function turnOnLight() {
  body.classList.toggle("light");
  button.classList.toggle("buttonOn");
}

let button = document.querySelector(".button");
button.addEventListener("click", turnOnLight);