import { Positionable } from "./positionable";
import { Shuttle } from "./shuttle";
import { MovementDirection } from "./movement";
import { Shot } from "./shot";

export function moveShuttle(canvas: HTMLCanvasElement, shuttle: Positionable<Shuttle>, {angle, velocity}: MovementDirection): Positionable<Shuttle> {
  const c = velocity;
  const xOffset = c * Math.cos(Math.PI / 180 * angle);
  const yOffset = c * Math.sin(Math.PI / 180 * angle);
  
  let x = shuttle.x + xOffset;
  x = x <= 0 ? canvas.width + x : x;
  x = x % canvas.width;

  let y = shuttle.y + yOffset;
  y = y <= 0 ? canvas.height + y : y;
  y = y % canvas.height;

  return new Positionable<Shuttle>(new Shuttle(velocity, angle), x, y);
}

export function moveShots(canvas: HTMLCanvasElement, shots: Positionable<Shot>[]) {
  return shots
    .map(shot => {
      const angle = shot.object.angle;
      const c = shot.object.velocity;
      const yOffset = c * Math.sin(Math.PI / 180 * angle);
      const xOffset = c * Math.cos(Math.PI / 180 * angle);

      return new Positionable<Shot>(new Shot(shot.object.angle, shot.object.velocity), shot.x + xOffset, shot.y + yOffset);
    })
    .filter(shot => shot.x > 0 && shot.y > 0 && shot.x < canvas.width && shot.y < canvas.height);
}