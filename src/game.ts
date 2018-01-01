
export class Game {

  constructor(private ctx: CanvasRenderingContext2D, private width: number, private height: number) {}

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.beginPath();
    this.ctx.arc(50, 50, 20, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

}