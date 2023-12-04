document.addEventListener('DOMContentLoaded', function () {
    var colorToggleButton = document.getElementById('colorToggleButton');
    var generateImagesBtn = document.getElementById('generateImagesBtn');
    var imageContainer = document.getElementById('imageContainer');

    colorToggleButton.addEventListener('click', function () {
        document.body.classList.toggle('invert');
    });

    // Define the generateImage function
    window.generateImage = function () {
        const wrapper = document.querySelector('.wrapper');
        const newImage = document.createElement('img');

        const randomImage = 'imgs/bone1.png';
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

        wrapper.appendChild(newImage);

        // Make the newImage draggable
        $(newImage).draggable();
    };
});

$(document).ready(function() {$("#bone1").draggable(); }) 
