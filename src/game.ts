import { Shuttle } from "./shuttle";
import { Positionable } from "./positionable";
import { Shot } from "./shot";
  
export class Game {
  positionedShuttle: Positionable<Shuttle>;
  shots: Positionable<Shot>[] = [];

  constructor(private width: number, private height: number) {
    this.positionedShuttle = new Positionable<Shuttle>(new Shuttle(0, 45), 50, 50);
  }

  moveShuttle() {
    const velocity = this.positionedShuttle.object.velocity;
    const angle = this.positionedShuttle.object.angle;

    const c = velocity;
    const a = c * Math.sin(angle / Math.PI);
    const b = c * Math.cos(angle / Math.PI);

    const xOffset = b;
    const yOffset = a;

    this.positionedShuttle.x = this.positionedShuttle.x + xOffset;
    this.positionedShuttle.x = this.positionedShuttle.x <= 0 ? this.width + this.positionedShuttle.x : this.positionedShuttle.x;
    this.positionedShuttle.x = this.positionedShuttle.x % this.width;

    this.positionedShuttle.y = this.positionedShuttle.y + yOffset;
    this.positionedShuttle.y = this.positionedShuttle.y <= 0 ? this.height + this.positionedShuttle.y : this.positionedShuttle.y;
    this.positionedShuttle.y = this.positionedShuttle.y % this.height;
  }

  moveShots() {
    this.shots.forEach(shot => {
      const angle = shot.object.angle;
      const c = shot.object.velocity;
      const a = c * Math.sin(angle / Math.PI);
      const b = c * Math.cos(angle / Math.PI);

      const xOffset = b;
      const yOffset = a;

      shot.x += xOffset;
      shot.y += yOffset;
    });
  }

  shoot(x: number, y: number, angle: number): any {
    this.shots.push(new Positionable<Shot>(new Shot(angle), x, y));
  }

  removeShotsOutOfScreen() {
    this.shots = this.shots.filter(shot => shot.x > 0 && shot.y > 0 && shot.x < this.width && shot.y < this.height);
  }

  tick(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);

    this.moveShots();
    this.removeShotsOutOfScreen()
    this.moveShuttle();

    this.drawShuttle(ctx);
    this.drawShots(ctx);
  }

  drawShuttle(ctx: CanvasRenderingContext2D) {
    const SHUTTLE_BODY = 20;
    const SHUTTLE_CABINE = 5;

    ctx.beginPath();
    ctx.arc(this.positionedShuttle.x, this.positionedShuttle.y, SHUTTLE_BODY, 0, 2 * Math.PI);
    ctx.stroke();

    const alpha = this.positionedShuttle.object.angle;
    const c = SHUTTLE_BODY + SHUTTLE_CABINE;
    const a = c * Math.sin(alpha / Math.PI);
    const b = c * Math.cos(alpha / Math.PI);

    const xOffset = b;
    const yOffset = a;

    const cabine = {
      x: this.positionedShuttle.x + xOffset,
      y: this.positionedShuttle.y + yOffset
    }

    ctx.beginPath();
    ctx.arc(cabine.x, cabine.y, SHUTTLE_CABINE, 0, 2 * Math.PI);
    ctx.stroke();
  }

  drawShots(ctx: CanvasRenderingContext2D) {
    this.shots.forEach(shot => {
      ctx.beginPath();
      ctx.arc(shot.x, shot.y, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    })
  }
}