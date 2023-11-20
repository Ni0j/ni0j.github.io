let isDragging = false;
let offsetX, offsetY;

document.querySelectorAll('.draggable').forEach(item => {
  item.addEventListener('mousedown', startDrag);
});

function startDrag(e) {
  isDragging = true;

  offsetX = e.clientX - parseFloat(e.target.style.left || 0);
  offsetY = e.clientY - parseFloat(e.target.style.top || 0);

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
  if (isDragging) {
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    document.querySelectorAll('.draggable').forEach(item => {
      item.style.left = x + 'px';
      item.style.top = y + 'px';
    });
  }
}

function stopDrag() {
  isDragging = false;

  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
}
