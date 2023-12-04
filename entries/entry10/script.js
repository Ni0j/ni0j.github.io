document.addEventListener('DOMContentLoaded', function () {
    var banner1 = document.getElementById('imageA');
    
    
    var body = document.body;

    // 点击banner1时切换图片和背景
    banner1.addEventListener('click', function () {
        var textElements = document.querySelectorAll('.text, .text2, .paragraphjp1, .paragraphjp2, .paragraphjp3, .paragraphen1, .paragraphen2, .paragraphen3, .credit-text');

        textElements.forEach(function (element) {
            element.classList.toggle('text-color-change');
        });

        // 切换图片
        if (banner1.src.includes('banner1')) {
            banner1.src = 'imgs/banner2.png'; 
            body.classList.add('background-image'); 
        } else {
            banner1.src = 'imgs/banner1.png'; 
            body.classList.remove('background-image'); 
        }
    });

    
    // 悬停banner1时应用新的鼠标指针样式
    banner1.addEventListener('mouseover', function () {
        banner1.classList.add('pointer-click');
    });

    banner1.addEventListener('mouseout', function () {
        banner1.classList.remove('pointer-click');
    });
});


document.addEventListener('DOMContentLoaded', function () {
    var colorToggleButton = document.getElementById('colorToggleButton');
    var body = document.body;
  
    colorToggleButton.addEventListener('click', function () {
      body.classList.toggle('light-mode'); 
    });
  });
  

    // 弹出浏览器原生弹窗
    var showModal = function () {
        alert('just click yessss, but dont forget to turn on the light when u need');
        // 如果用户点击"是"，不需要添加任何处理逻辑，浏览器会继续加载页面
        // 如果用户点击"否"，浏览器会停留在当前页面
    };

    // 在页面加载时调用弹窗函数
    showModal();



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
window.location.href = "file:///Users/nioion0/Documents/2023FALL/C1_Interaction/Nio_c1if23/ni0j.github.io/entries/index2.html";
});
    