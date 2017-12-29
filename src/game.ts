import { Shuttle } from "./shuttle";
import { Positionable } from "./positionable";
import { Shot } from "./shot";
import { GameState } from "./game-state";
  
export class Game {

  constructor(private ctx: CanvasRenderingContext2D, private width: number, private height: number) {
  }

  draw(state: GameState) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawShuttle(state.shuttle);
    this.drawShots(state.shots);
    this.drawSpeed(state.shuttle.object.velocity);
  }

  drawShuttle(shuttle: Positionable<Shuttle>) {
    const SHUTTLE_BODY = 20;
    const SHUTTLE_CABINE = 5;

    this.ctx.beginPath();
    this.ctx.arc(shuttle.x, shuttle.y, SHUTTLE_BODY, 0, 2 * Math.PI);
    this.ctx.stroke();

    const alpha = Math.PI / 180 * shuttle.object.angle;
    const c = SHUTTLE_BODY + SHUTTLE_CABINE;
    const a = c * Math.sin(alpha);
    const b = c * Math.cos(alpha);

    const xOffset = b;
    const yOffset = a;

    const cabine = {
      x: shuttle.x + xOffset,
      y: shuttle.y + yOffset
    }

    this.ctx.beginPath();
    this.ctx.arc(cabine.x, cabine.y, SHUTTLE_CABINE, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  drawSpeed(speed: number): any {
    this.ctx.font = "12px Arial";
    this.ctx.fillText(`Speed: ${speed}`, 10, 20);
  }

  drawShots(shots: Positionable<Shot>[]) {
    shots.forEach(shot => {
      this.ctx.beginPath();
      this.ctx.arc(shot.x, shot.y, 3, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    })
  }
}