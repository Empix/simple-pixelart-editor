const canvas = document.querySelector("#draw-canvas");
const context = canvas.getContext("2d");

const overlayCanvas = document.querySelector("#overlay-canvas");
const overlayContext = overlayCanvas.getContext("2d");

const backgroundCanvas = document.querySelector("#background-canvas");
const backgroundContext = backgroundCanvas.getContext("2d");

const canvasWrapper = document.querySelector(".canvas-wrapper");

canvas.width = 32;
canvas.height = 32;

backgroundCanvas.width = canvas.width * 2;
backgroundCanvas.height = canvas.height * 2;

overlayCanvas.width = 1280;
overlayCanvas.height = 1280;

let originalWidth;
let originalHeight;
let originalTop;
let originalLeft;

function resizeCanvas() {
  const { innerWidth, innerHeight } = window;

  let width = innerWidth * 0.9;
  let height = innerHeight * 0.9;

  let ratio = canvas.width / canvas.height;
  width = ratio * height;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  overlayCanvas.style.width = `${width}px`;
  overlayCanvas.style.height = `${height}px`;

  backgroundCanvas.style.width = `${width}px`;
  backgroundCanvas.style.height = `${height}px`;

  originalWidth = width;
  originalHeight = height;

  const top = (window.innerHeight - parseInt(canvas.style.height)) / 2;
  const left = (window.innerWidth - parseInt(canvas.style.width)) / 2;

  canvas.style.left = `${left}px`;
  canvas.style.top = `${top}px`;

  overlayCanvas.style.left = `${left}px`;
  overlayCanvas.style.top = `${top}px`;

  backgroundCanvas.style.left = `${left}px`;
  backgroundCanvas.style.top = `${top}px`;

  originalTop = top;
  originalLeft = left;
}

resizeCanvas();

let isSpacePressed = false;
let isM1Pressed = false;
let isMouseOverCanvas = false;

let mouseStartX;
let mouseStartY;

let canvasX;
let canvasY;

overlayCanvas.addEventListener("mouseenter", () => {
  isMouseOverCanvas = true;
});

overlayCanvas.addEventListener("mouseleave", () => {
  isMouseOverCanvas = false;
});

canvasWrapper.addEventListener("wheel", (event) => {
  event.preventDefault();

  scale = event.deltaY * -0.5;

  width = `${parseInt(canvas.style.width) + scale}px`;
  height = `${parseInt(canvas.style.height) + scale}px`;

  if (parseInt(width) < 0 || parseInt(height) < 0) {
    return;
  }

  canvas.style.width = width;
  canvas.style.height = height;

  overlayCanvas.style.width = width;
  overlayCanvas.style.height = height;

  backgroundCanvas.style.width = width;
  backgroundCanvas.style.height = height;

  const left = parseInt(canvas.style.left) - scale / 2;
  const top = parseInt(canvas.style.top) - scale / 2;

  canvas.style.left = `${left}px`;
  canvas.style.top = `${top}px`;

  overlayCanvas.style.left = `${left}px`;
  overlayCanvas.style.top = `${top}px`;

  backgroundCanvas.style.left = `${left}px`;
  backgroundCanvas.style.top = `${top}px`;
});

document.addEventListener("keydown", (event) => {
  if (event.code == "Space") {
    canvasWrapper.style.cursor = "grab";
    isSpacePressed = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code == "Space") {
    canvasWrapper.style.cursor = "default";
    isSpacePressed = false;
  }
});

document.addEventListener("mousedown", (event) => {
  if (event.button == 0) {
    isM1Pressed = true;
  }

  if (event.button == 0 && isSpacePressed) {
    mouseStartX = event.x;
    mouseStartY = event.y;

    canvasX = parseInt(canvas.style.left) || 0;
    canvasY = parseInt(canvas.style.top) || 0;
    return;
  }
});

document.addEventListener("mouseup", (event) => {
  if (event.button == 0) {
    isM1Pressed = false;
  }

  if (event.button == 0) {
    canvas.style.borderColor = "var(--white)";
  }
});

document.addEventListener("mousemove", (event) => {
  if (isM1Pressed && isSpacePressed) {
    const left = `${event.x - mouseStartX + canvasX}px`;
    const top = `${event.y - mouseStartY + canvasY}px`;

    canvas.style.left = left;
    canvas.style.top = top;

    overlayCanvas.style.left = left;
    overlayCanvas.style.top = top;

    backgroundCanvas.style.left = left;
    backgroundCanvas.style.top = top;

    return;
  }

  if (isMouseOverCanvas && isM1Pressed) {
    const x = parseInt(
      mousePosition.x.map(0, overlayCanvas.width, 0, canvas.width)
    );
    const y = parseInt(
      mousePosition.y.map(0, overlayCanvas.height, 0, canvas.height)
    );

    if (selectedTool == "Pen") {
      context.fillStyle = color;
      context.fillRect(x, y, 1, 1);
    } else if (selectedTool == "Eraser") {
      context.clearRect(x, y, 1, 1);
    }
  }
});

document.addEventListener("keypress", (event) => {
  if (event.code == "KeyR") {
    resetPosition();
  }
});

function resetPosition() {
  canvas.style.top = `${originalTop}px`;
  canvas.style.left = `${originalLeft}px`;
  canvas.style.width = `${originalWidth}px`;
  canvas.style.height = `${originalHeight}px`;

  overlayCanvas.style.top = `${originalTop}px`;
  overlayCanvas.style.left = `${originalLeft}px`;
  overlayCanvas.style.width = `${originalWidth}px`;
  overlayCanvas.style.height = `${originalHeight}px`;

  backgroundCanvas.style.top = `${originalTop}px`;
  backgroundCanvas.style.left = `${originalLeft}px`;
  backgroundCanvas.style.width = `${originalWidth}px`;
  backgroundCanvas.style.height = `${originalHeight}px`;
}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

let mousePosition = { x: 0, y: 0 };

let mousePositionUI = document.querySelector(".cursor-position");

overlayCanvas.addEventListener("mousemove", (event) => {
  mousePosition.x = Math.min(
    parseInt(
      Number(event.x - overlayCanvas.offsetLeft).map(
        0,
        parseInt(overlayCanvas.style.width),
        0,
        overlayCanvas.width
      )
    ),
    overlayCanvas.width - 1
  );

  mousePosition.y = Math.min(
    parseInt(
      Number(event.y - overlayCanvas.offsetTop).map(
        0,
        parseInt(overlayCanvas.style.height),
        0,
        overlayCanvas.height
      )
    ),
    overlayCanvas.height - 1
  );
});

(function drawBackgroundGrid() {
  let color = "rgba(120, 120, 120, 0.8)";

  for (let y = 0; y < backgroundCanvas.height; y++) {
    color =
      color == "rgba(120, 120, 120, 0.8)"
        ? "rgba(120, 120, 120, 0.5)"
        : "rgba(120, 120, 120, 0.8)";

    for (let x = 0; x < backgroundCanvas.width; x++) {
      color =
        color == "rgba(120, 120, 120, 0.8)"
          ? "rgba(120, 120, 120, 0.5)"
          : "rgba(120, 120, 120, 0.8)";
      backgroundContext.fillStyle = color;
      backgroundContext.fillRect(x, y, 1, 1);
    }
  }
})();

function draw() {
  overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  const width = overlayCanvas.width / canvas.width;
  const height = overlayCanvas.height / canvas.height;

  let x = parseInt(
    mousePosition.x.map(0, overlayCanvas.width, 0, canvas.width)
  );
  let y = parseInt(
    mousePosition.y.map(0, overlayCanvas.height, 0, canvas.height)
  );

  mousePositionUI.innerText = `X: ${x + 1}, Y: ${y + 1}`;

  x *= height;
  y *= width;

  overlayContext.fillStyle = "rgba(255, 255, 255, 0.5)";
  overlayContext.fillRect(
    parseInt(x),
    parseInt(y),
    parseInt(width),
    parseInt(height)
  );

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
