import { Observable } from 'rxjs';
import { Movement } from './movement';
import { animationFrame } from 'rxjs/scheduler/animationFrame';
import { Shuttle } from './shuttle';
import { Game } from './game';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const game = new Game(canvas.width, canvas.height);

const keyPress$: Observable<KeyboardEvent> = Observable.fromEvent(document, 'keydown');
const moveRight$ = keyPress$.filter(event => event.code === 'ArrowRight').mapTo(1);
const moveLeft$ = keyPress$.filter(event => event.code === 'ArrowLeft').mapTo(-1);
const moveUp$ = keyPress$.filter(event => event.code === 'ArrowUp').mapTo(1);
const moveDown$ = keyPress$.filter(event => event.code === 'ArrowDown').mapTo(-1);
const fire$ = keyPress$.filter(event => event.code === 'Space');

const tick$ = Observable.interval(17, animationFrame);

const angle$ = Observable.merge(moveLeft$, moveRight$)
  .scan((acc, curr) => {
    let sum = (acc + curr) % 360;
    sum = sum <= 0 ? 360 + sum : sum;
    return sum
  }, 0)
  .throttleTime(20)
  .startWith(0)

const acceleration$ = Observable.merge(moveUp$, moveDown$)
  .throttleTime(300)
  .scan((acc, curr) => Math.max(0, acc + curr), 0)
  .startWith(0)

const movement$ =
  Observable.combineLatest(angle$, acceleration$, (angle, acceleration) => ({ angle, acceleration }))
  .map(({angle, acceleration}) => {
    game.positionedShuttle.object.angle = angle;
    game.positionedShuttle.object.velocity = acceleration;
  });

const shots$ = fire$.map(() => game.shoot(game.positionedShuttle.x, game.positionedShuttle.y, game.positionedShuttle.object.angle));

const game$ = Observable.merge(tick$, movement$, shots$);
game$.sample(tick$).subscribe(() => game.tick(ctx));
