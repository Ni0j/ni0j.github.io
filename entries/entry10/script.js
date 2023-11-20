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
  