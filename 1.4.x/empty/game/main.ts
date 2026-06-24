// A Empty Project for samengine

import {
  createCanvas,
  enableFullscreen,
  setupFullscreenButton,
} from "@shadowdara/webgameengine";
import { setupInput, resetInput } from "@shadowdara/webgameengine";
import { startEngine } from "@shadowdara/webgameengine";

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

function gameStart() {
  // dlog("Game gestartet");
}

function gameLoop(dt: number) {
  applyScaling();

  ctx.clearRect(0, 0, virtualWidth, virtualHeight);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, virtualWidth, virtualHeight);

  // Reset Input
  resetInput();
}

startEngine(gameStart, gameLoop);
