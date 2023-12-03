document.addEventListener('DOMContentLoaded', function () {
    var colorToggleButton = document.getElementById('colorToggleButton');

    colorToggleButton.addEventListener('click', function () {
        document.body.classList.toggle('invert');
    });
});


