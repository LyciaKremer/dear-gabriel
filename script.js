const desktopFilePath = './assets/pixels.txt';
const mobileFilePath = './assets/pixels-mb.txt';

function loadPixelFile(filePath) {
  return fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar o arquivo');
      }
      return response.text();
    });
}

function processPixels(data, baseWidth, baseHeight) {
  const pixelList = data.trim().split('\n');
  generatePixelArt(pixelList, baseWidth, baseHeight);
}

function generatePixelArt(pixelList, baseWidth, baseHeight) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let canvasWidth = baseWidth;
  let canvasHeight = baseHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const pixels = [];
  pixelList.forEach((color, index) => {
    const x = index % baseWidth;
    const y = Math.floor(index / baseWidth);
    pixels.push({ x, y, color: color.trim() });
  });

  let index = 0;
  const batchSize = 50;

  function drawNextBatch() {
    const startIndex = index;
    const endIndex = Math.min(index + batchSize, pixels.length);

    for (let i = startIndex; i < endIndex; i++) {
      const pixel = pixels[i];
      ctx.fillStyle = pixel.color;
      ctx.fillRect(pixel.x * (canvasWidth / baseWidth), pixel.y * (canvasHeight / baseHeight), canvasWidth / baseWidth, canvasHeight / baseHeight);
    }

    index += batchSize;

    if (index < pixels.length) {
      setTimeout(drawNextBatch, 0.1);
    } else {
      const textSpan = document.querySelector('span');
      textSpan.classList.add('show');
    }
  }

  drawNextBatch();

  document.body.appendChild(canvas);

  window.addEventListener('resize', () => {
    canvas.width = baseWidth;
    canvas.height = baseHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    index = 0;
    drawNextBatch();
  });
}

const isMobile = window.innerWidth < 768;
const filePath = isMobile ? mobileFilePath : desktopFilePath;

const audio = document.getElementById('background-audio');
const playButton = document.getElementById('play-audio');

audio.volume = 0.05;

playButton.addEventListener('click', () => {
  audio.play();
  playButton.style.display = 'none';

  loadPixelFile(filePath)
    .then(data => {
      const baseWidth = isMobile ? 269 : 409;
      const baseHeight = isMobile ? 336 : 511;
      processPixels(data, baseWidth, baseHeight);
    })
    .catch(error => console.error('Erro:', error));
});
