// A empty Project with the Web Framework

import {
  createCanvas,
  drawRect,
  enableFullscreen,
  setupFullscreenButton,
} from "samengine";
import { setupInput, resetInput, getMouse } from "samengine";
import { startEngine } from "samengine";
import { makeRect } from "samengine/types";

const { canvas, ctx, applyScaling, virtualWidth, virtualHeight } = createCanvas(
  {
    fullscreen: true,
    scaling: "fit",
    virtualWidth: window.innerWidth,
    virtualHeight: window.innerHeight,
  },
);
setupInput(canvas, virtualWidth, virtualHeight);

enableFullscreen(canvas);
setupFullscreenButton(canvas);

async function gameStart() {
  // Code which runs at the Game Start
}

function gameLoop(dt: number) {
  // Code which runs every Frame

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const mouse = getMouse();

  applyScaling();

  // White Background
  drawRect(ctx, makeRect(0, 0, virtualWidth, virtualHeight), "white");

  resetInput();
}

// Because start Game is Async
startEngine(() => {
  gameStart().then(() => {
    /* ready */
  });
}, gameLoop);
